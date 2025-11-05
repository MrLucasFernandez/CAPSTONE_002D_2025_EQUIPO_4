// src/App.tsx o src/main.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de ejemplo
import Navbar from './components/organisms/Navbar'; 
import LoginForm from './components/organisms/LoginForm'; 
import HomePage from './pages/HomePage';
import AdminDashboard from './modules/admin/pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
    return (
            <Router>
                <Navbar /> {/* El Navbar debe estar dentro del Router Y del AuthProvider */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        
                        {/* Rutas Protegidas para Admin */}
                        <Route path="/admin" element={<AdminDashboard />} /> 
                        {/* Agrega más rutas de admin aquí */}
                        
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </Router>
    );
};

export default App;