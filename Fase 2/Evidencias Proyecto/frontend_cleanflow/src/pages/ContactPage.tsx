// src/pages/ContactPage.tsx
import React from 'react';
import ContactForm from '../components/organisms/ContactForm';
import DefaultTemplate from '../components/templates/DefaultTemplate'; 

const ContactPage: React.FC = () => {
  return (
    <DefaultTemplate>
      <ContactForm />
    </DefaultTemplate>
  );
};

export default ContactPage;