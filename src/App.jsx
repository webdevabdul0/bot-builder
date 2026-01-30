import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import BotBuilder from './BotBuilder';
import Unauthorized from './components/Unauthorized';
import './App.css';

function App() {
  // TEMPORARY: Bypass authentication for development
  const mockUserProfile = {
    id: 'dev-user',
    email: 'dev@flossly.ai',
    name: 'Development User',
    currentLoggedInOrgId: 'dev-org-123',
    userOrganisations: [
      {
        organisationId: 'dev-org-123',
        organisation: {
          id: 'dev-org-123',
          name: 'Development Organization'
        }
      }
    ]
  };

  return (
    <Router>
      <Routes>
        {/* Bot Builder routes - BYPASSING AUTHENTICATION */}
        <Route path="/botbuilder/auth" element={<BotBuilder userProfile={mockUserProfile} />} />
        <Route path="/botbuilder" element={<BotBuilder userProfile={mockUserProfile} />} />
        <Route path="/" element={<BotBuilder userProfile={mockUserProfile} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* All other routes redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
