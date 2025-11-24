import React from 'react';
import ContactForm from '@organisms/ContactForm';
import DefaultTemplate from '@components/templates/DefaultTemplate'; 

const ContactPage: React.FC = () => {
  return (
    <DefaultTemplate>
      <ContactForm />
    </DefaultTemplate>
  );
};

export default ContactPage;