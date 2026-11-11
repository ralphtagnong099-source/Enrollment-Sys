import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EnrollmentForm from './pages/EnrollmentForm';
import SelectSubjects from './pages/SelectSubjects';
import Registration from './pages/Registration';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/enroll" element={<EnrollmentForm />} />
        <Route path="/subjects" element={<SelectSubjects />} />
        <Route path="/registration/:id" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}