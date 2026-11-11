import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './subjects.css';

type ClassRow = {
  id: number;
  class_no: string;
  section: string;
  description: string;
  units: number;
  sy_term: string;
  class_meetings: { day: string; time_slot: string; room: string }[];
};

export default function SelectSubjects() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('classes')
      .select('*, class_meetings(day, time_slot, room)')
      .order('id')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setClasses(data as ClassRow[]);
      });
  }, []);

  function toggle(id: number) {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  const totalUnits = classes
    .filter((c) => selected.includes(c.id))
    .reduce((sum, c) => sum + Number(c.units), 0);

  async function handleSubmit() {
    setError('');
    if (selected.length === 0) return setError('Select at least one subject.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/');

    const { data: enrollment, error: e1 } = await supabase
      .from('enrollments')
      .insert({ student_id: user.id, sy_term: '2627-1T', status: 'confirmed', total_units: totalUnits })
      .select()
      .single();
    if (e1) return setError(e1.message);

    const { error: e2 } = await supabase
      .from('enrollment_items')
      .insert(selected.map((class_id) => ({ enrollment_id: enrollment.id, class_id })));
    if (e2) return setError(e2.message);

    navigate(`/registration/${enrollment.id}`);
  }

  return (
    <div className="sj-page">
      <div className="sj-blob-top" />
      <div className="sj-blob-bottom" />

      <div className="sj-card">
        <p className="sj-meta">BSIT • 3RD YEAR • FIRST TERM</p>
        <h1 className="sj-title">Select Your Subjects</h1>
        <p className="sj-sub">Choose the courses you want to enroll in this term</p>

        <div className="sj-wrap">
          <table className="sj-table">
            <thead>
              <tr>
                <th></th>
                <th>Course Description</th>
                <th>Units</th>
                <th>Class No / Sec</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className={selected.includes(c.id) ? 'sj-selected' : ''}>
                  <td>
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                  </td>
                  <td>
                    <span className="sj-code">{c.section}</span>
                    <span className="sj-name">{c.description}</span>
                  </td>
                  <td className="sj-muted">{Number(c.units).toFixed(2)}</td>
                  <td className="sj-muted">{c.class_no} / {c.section}</td>
                  <td>
                    {c.class_meetings.map((m, i) => (
                      <div key={i}>
                        <span className="sj-day">{m.day}</span>{' '}
                        <span className="sj-detail">{m.time_slot} • Rm {m.room}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <div className="sj-error">{error}</div>}

        <div className="sj-footer">
          <div>
            <span className="sj-total-label">TOTAL UNITS</span>
            <span className="sj-total-num">{totalUnits.toFixed(2)}</span>
          </div>
          <button className="sj-btn" onClick={handleSubmit}>Submit Enrollment</button>
        </div>
      </div>
    </div>
  );
}