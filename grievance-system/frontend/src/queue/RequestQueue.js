

const STORAGE_KEY = 'grievance_submission_queue';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

class RequestQueue {
  constructor() {
    this.jobs = this._loadFromStorage();
    this.isProcessing = false;
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getSnapshot());
    return () => this.listeners.delete(callback);
  }

  _notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((cb) => cb(snapshot));
  }

  getSnapshot() {
    return this.jobs.map(({ id, label, status, error, retries }) => ({
      id, label, status, error, retries,
    }));
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).filter((j) => j.status !== 'done') : [];
    } catch {
      return [];
    }
  }

  _saveToStorage() {
    const serializable = this.jobs.map(
      ({ id, label, status, error, retries, payload }) => ({
        id, label, status, error, retries, payload,
      })
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  }

  /**
   * @param {string} label - shown in the UI, e.g. "Submit grievance: Water leak"
   * @param {Function} apiCall - () => Promise (the Axios call to run)
   * @param {object} meta - { payload } for persistence/debugging only
   */
  enqueue(label, apiCall, meta = {}) {
    const job = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label,
      apiCall,
      status: 'pending', // pending -> processing -> done | failed
      error: null,
      retries: 0,
      payload: meta.payload || null,
    };
    this.jobs.push(job);
    this._saveToStorage();
    this._notify();
    this._processNext();
    return job.id;
  }

  async _processNext() {
    if (this.isProcessing) return;
    const job = this.jobs.find((j) => j.status === 'pending' || j.status === 'retrying');
    if (!job) return;

    this.isProcessing = true;
    job.status = 'processing';
    this._notify();

    try {
      const result = await job.apiCall();
      job.status = 'done';
      job.result = result;
      this._notify();
      this.jobs = this.jobs.filter((j) => j.id !== job.id);
    } catch (err) {
      job.retries += 1;
      if (job.retries < MAX_RETRIES) {
        job.status = 'retrying';
        job.error = err.message;
        this._saveToStorage();
        this._notify();
        this.isProcessing = false;
        setTimeout(() => this._processNext(), RETRY_DELAY_MS * job.retries);
        return;
      }
      job.status = 'failed';
      job.error = err.message;
    }

    this._saveToStorage();
    this._notify();
    this.isProcessing = false;
    this._processNext();
  }

  retry(jobId) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (job) {
      job.status = 'pending';
      job.retries = 0;
      this._notify();
      this._processNext();
    }
  }

  clearFailed() {
    this.jobs = this.jobs.filter((j) => j.status !== 'failed');
    this._saveToStorage();
    this._notify();
  }
}

const queue = new RequestQueue();
export default queue;
