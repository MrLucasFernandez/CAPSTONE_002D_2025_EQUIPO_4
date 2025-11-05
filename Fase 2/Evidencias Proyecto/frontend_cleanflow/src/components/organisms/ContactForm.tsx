import React, { useState } from 'react';
import InputField from '../molecules/InputField'; 
import TextareaField from '../molecules/TextareaField'; 
import {Button} from '../atoms/Button';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contacto enviado:', { name, email, message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Envíanos un Mensaje</h2>
      
      <InputField
        label="Nombre Completo"
        id="name"
        type="text"
        required
        {...({ value: name, onChange: (e: any) => setName(e.target.value) } as any)}
      />
      
      <InputField
        label="Correo Electrónico"
        id="email"
        type="email"
        required
        {...({ value: email, onChange: (e: any) => setEmail(e.target.value) } as any)}
      />
      <TextareaField
        label="Mensaje"
        id="message"
        required
        {...({ value: message, onChange: (e: any) => setMessage(e.target.value) } as any)}
      />
      
      <Button type="submit" variant='primary'>Enviar Mensaje</Button>
    </form>
  );
};

export default ContactForm;