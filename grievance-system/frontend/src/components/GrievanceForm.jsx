import { useState } from 'react';
import queue from '../queue/RequestQueue';
import { submitGrievance } from '../api/grievanceApi';

const MAX_IMAGE_MB = 3;

function GrievanceForm({ onQueued }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    if (!file) {
      setImagePreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    const citizenId = localStorage.getItem('userId') || localStorage.getItem('email');


    queue.enqueue(
      `Submit grievance: ${form.title}`,
      () => submitGrievance({ ...form, citizen_id: citizenId, image: imagePreview }),
      { payload: form }
    );

    setMsg('Grievance queued for submission. It will be auto-routed to the right department.');
    setForm({ title: '', description: '' });
    setImagePreview(null);
    onQueued && onQueued();
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="card">
      <h3>File a Grievance</h3>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail — the department is assigned automatically based on what you write."
          required
        />

        <label>Photo evidence (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageError && <p className="error-text">{imageError}</p>}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Grievance evidence preview" />
            <button type="button" className="btn-remove-image" onClick={removeImage}>Remove</button>
          </div>
        )}

        <button type="submit">Submit Grievance</button>
        {msg && <p className="success-text">{msg}</p>}
      </form>
    </div>
  );
}

export default GrievanceForm;
