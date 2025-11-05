import React from 'react';
import RegisterForm from '../components/organisms/RegisterForm';
import AuthTemplate from '../components/templates/AuthTemplate';

const RegisterPage: React.FC = () => {
  return (
    // 💡 Envuelve el RegisterForm con el AuthTemplate
    <AuthTemplate title="Registro">
      <RegisterForm />
    </AuthTemplate>
  );
};

export default RegisterPage;