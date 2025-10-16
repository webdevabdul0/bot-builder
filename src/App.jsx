import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import Unauthorized from './components/Unauthorized';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/botbuilder/auth" element={<AuthWrapper />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/unauthorized" replace />} />
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
