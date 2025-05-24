import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QrAdmin from './components/QrAdmin';
import Pointage from './components/Pointage';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/qr-admin" element={<QrAdmin />} />
        <Route path="/pointage" element={<Pointage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <img 
                src="/images/logo-mairie.png" 
                alt="Logo Mairie de Noisy-le-Sec" 
                className="h-24"
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Application de Pointage - Ville de Noisy-le-Sec
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/qr-admin" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center transition-colors">
                QR Admin
              </a>
              <a href="/admin" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center transition-colors">
                Administration
              </a>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} - Ville de Noisy-le-Sec - Tous droits réservés
          </div>
        </div>} />
      </Routes>
    </Router>
  );
}

export default App;
