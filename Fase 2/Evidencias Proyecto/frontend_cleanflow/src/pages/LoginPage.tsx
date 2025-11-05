import React from 'react';
import LoginForm from '../components/organisms/LoginForm';
import AuthTemplate from '../components/templates/AuthTemplate'; // Importa la plantilla

const LoginPage: React.FC = () => {
  return (
    // La página solo se encarga de componer la plantilla y el organismo.
    <AuthTemplate title="Bienvenido">
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;