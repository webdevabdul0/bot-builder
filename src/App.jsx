import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import Unauthorized from './components/Unauthorized';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Bot Builder routes - check for authentication */}
        <Route path="/botbuilder/auth" element={<AuthWrapper />} />
        <Route path="/botbuilder" element={<AuthWrapper />} />
        <Route path="/" element={<AuthWrapper />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* All other routes redirect to unauthorized */}
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
