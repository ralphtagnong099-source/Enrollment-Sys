import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './auth.css';
import './registration.css';

type Meeting = { day: string; time_slot: string; room: string };
type Item = {
  classes: {
    id: number;
    class_no: string;
    section: string;
    description: string;
    units: number;
    instructor: string | null;
    class_meetings: Meeting[];
  };
};
type Student = {
  student_no: string;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  program: string;
  year_level: string;
};

export default function Registration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [term, setTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: enr, error: e1 } = await supabase
        .from('enrollments')
        .select('sy_term, total_units, students(*), enrollment_items(classes(*, class_meetings(*)))')
        .eq('id', id)
        .single();

      if (e1 || !enr) return setError(e1?.message ?? 'Enrollment not found.');

      setTerm(enr.sy_term);
      setTotal(Number(enr.total_units));
      setStudent(enr.students as unknown as Student);
      setItems(enr.enrollment_items as unknown as Item[]);
    }
    load();
  }, [id]);

  if (error) return <p style={{ color: 'red', padding: 24 }}>{error}</p>;
  if (!student) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div className="reg-page">
      <div className="blob-top" />
      <div className="blob-bottom" />

      <div className="reg-sheet">
        <div className="reg-head">
          <div className="reg-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" />
            </svg>
          </div>
          <div>
            <p className="reg-eyebrow">BSIT ENROLLMENT SYSTEM</p>
            <h1 className="reg-title">Certificate of Registration</h1>
          </div>
        </div>

        <div className="reg-info">
          <div><label>SY &amp; Term</label><div>{term}</div></div>
          <div><label>Program</label><div>{student.program}</div></div>
          <div><label>Year Level</label><div>{student.year_level}</div></div>
          <div><label>Student No.</label><div>{student.student_no}</div></div>
          <div><label>Last Name</label><div>{student.last_name}</div></div>
          <div><label>First Name</label><div>{student.first_name}</div></div>
          <div><label>Middle Name</label><div>{student.middle_name || '-'}</div></div>
        </div>

        <div className="reg-bar">ACADEMIC</div>
        <div className="reg-wrap">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Course Description</th>
                <th>Units</th>
                <th>Class No / Sec</th>
                <th>Days</th>
                <th>Time</th>
                <th>Room</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ classes: c }) => (
                <tr key={c.id}>
                  <td>
                    <span className="reg-code">{c.section}</span>
                    {c.description}
                  </td>
                  <td>{Number(c.units).toFixed(2)}</td>
                  <td>{c.class_no} / {c.section}</td>
                  <td>{c.class_meetings.map((m, i) => <div key={i}>{m.day}</div>)}</td>
                  <td>{c.class_meetings.map((m, i) => <div key={i}>{m.time_slot}</div>)}</td>
                  <td>{c.class_meetings.map((m, i) => <div key={i}>{m.room}</div>)}</td>
                  <td>{c.instructor || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reg-total">Total Units: <strong>{total.toFixed(2)}</strong></div>

        <div className="reg-actions">
          <button className="btn btn-ghost" onClick={() => window.print()}>Print</button>
          <button className="btn btn-ghost" onClick={() => navigate('/subjects')}>Back</button>
        </div>
      </div>
    </div>
  );
}