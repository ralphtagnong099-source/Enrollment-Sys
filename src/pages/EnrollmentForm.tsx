import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './enrollment.css';

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);

export default function EnrollmentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_no: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    program: 'BSIT',
    year_level: '',
  });
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.student_no.trim() || !form.last_name.trim() || !form.first_name.trim() || !form.year_level) {
      return setError('Please fill in all required fields.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/');

    const { error } = await supabase.from('students').upsert({ id: user.id, ...form });
    if (error) return setError(error.message);

    navigate('/subjects');
  }

  return (
    <div className="en-page">
      <div className="en-blob-top" />
      <div className="en-blob-bottom" />

      <div className="en-card">
        <p className="en-eyebrow">BSIT ENROLLMENT SYSTEM</p>
        <h1 className="en-title">Enrollment Form</h1>
        <p className="en-sub">Enter your student information to continue</p>

        <form onSubmit={handleSubmit}>
          <label className="en-label">Student No. <span className="en-req">*</span></label>
          <input className="en-input" name="student_no" value={form.student_no} onChange={handleChange} />

          <div className="en-grid3">
            <div>
              <label className="en-label">Last Name <span className="en-req">*</span></label>
              <input className="en-input" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
            <div>
              <label className="en-label">First Name <span className="en-req">*</span></label>
              <input className="en-input" name="first_name" value={form.first_name} onChange={handleChange} />
            </div>
            <div>
              <label className="en-label">Middle Name</label>
              <input className="en-input" name="middle_name" value={form.middle_name} onChange={handleChange} />
            </div>
          </div>

          <div className="en-grid2">
            <div>
  <label className="en-label">Program</label>
  <input className="en-input" name="program" value="BSIT" readOnly />
</div>
            <div>
              <label className="en-label">Year Level <span className="en-req">*</span></label>
              <select className="en-select" name="year_level" value={form.year_level} onChange={handleChange}>
                <option value="">Select year level</option>
                <option value="1Y1">1Y1</option>
                <option value="2Y1">2Y1</option>
                <option value="3Y1">3Y1</option>
                <option value="4Y1">4Y1</option>
              </select>
            </div>
          </div>

          <p className="en-note">* Required fields</p>
          {error && <div className="en-error">{error}</div>}

          <button type="submit" className="en-btn">
            <SendIcon /> Submit
          </button>
        </form>
      </div>
    </div>
  );
}