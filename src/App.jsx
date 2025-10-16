import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import Unauthorized from './components/Unauthorized';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Only allow access to /botbuilder/auth with token parameter */}
        <Route path="/botbuilder/auth" element={<AuthWrapper />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* All other routes redirect to unauthorized */}
        <Route path="/" element={<Navigate to="/unauthorized" replace />} />
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
