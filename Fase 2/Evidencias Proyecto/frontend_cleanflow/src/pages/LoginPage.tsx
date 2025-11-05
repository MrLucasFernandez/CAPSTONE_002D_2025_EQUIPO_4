import React from 'react';
import LoginForm from '../components/organisms/LoginForm';
import AuthTemplate from '../components/templates/AuthTemplate';

const LoginPage: React.FC = () => {
  return (
    <AuthTemplate title="Bienvenido">
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;