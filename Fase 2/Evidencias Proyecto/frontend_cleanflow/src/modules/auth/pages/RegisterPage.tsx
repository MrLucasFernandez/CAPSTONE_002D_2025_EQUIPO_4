import React from 'react';
import RegisterForm from '../components/RegisterForm';
import AuthTemplate from '@components/templates/auth/AuthTemplate';

const RegisterPage: React.FC = () => {
  return (
    //  Envuelve el RegisterForm con el AuthTemplate
    <AuthTemplate title="Registro">
      <RegisterForm />
    </AuthTemplate>
  );
};

export default RegisterPage;