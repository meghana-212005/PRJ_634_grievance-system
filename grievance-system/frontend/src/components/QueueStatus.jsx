import useQueue from '../queue/useQueue';

function QueueStatus() {
  const { jobs, retry, clearFailed } = useQueue();
  if (!jobs.length) return null;

  return (
    <div className="card">
      <h4>Submission Queue</h4>
      <ul className="queue-list">
        {jobs.map((job) => (
          <li key={job.id}>
            <span>{job.label}</span>
            <span className={`badge badge-${job.status}`}>{job.status}</span>
            {job.status === 'failed' && <button onClick={() => retry(job.id)}>Retry</button>}
          </li>
        ))}
      </ul>
      {jobs.some((j) => j.status === 'failed') && (
        <button onClick={clearFailed}>Clear failed</button>
      )}
    </div>
  );
}

export default QueueStatus;
