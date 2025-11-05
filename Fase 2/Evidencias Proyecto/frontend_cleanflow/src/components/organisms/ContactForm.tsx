// src/components/organisms/ContactForm.tsx
import React, { useState } from 'react';
import InputField from '../molecules/InputField'; // Reutilizamos InputField (Email, Nombre)
import TextareaField from '../molecules/TextareaField'; // Usamos el nuevo componente
import {Button} from '../atoms/Button'; // Reutilizamos Button

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contacto enviado:', { name, email, message });
    // Aquí iría la lógica de envío al backend (fetch, axios, etc.)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Envíanos un Mensaje</h2>
      
      {/* 1. Nombre - Reutiliza InputField */}
      <InputField
        label="Nombre Completo"
        id="name"
        type="text"
        required
        {...({ value: name, onChange: (e: any) => setName(e.target.value) } as any)}
      />
      
      {/* 2. Email - Reutiliza InputField */}
      {/* 2. Email - Reutiliza InputField */}
      <InputField
        label="Correo Electrónico"
        id="email"
        type="email"
        required
        {...({ value: email, onChange: (e: any) => setEmail(e.target.value) } as any)}
      />
      {/* 3. Mensaje - Usa TextareaField */}
      <TextareaField
        label="Mensaje"
        id="message"
        required
        {...({ value: message, onChange: (e: any) => setMessage(e.target.value) } as any)}
      />
      
      {/* 4. Botón - Reutiliza Button */}
      <Button type="submit" variant='primary'>Enviar Mensaje</Button>
    </form>
  );
};

export default ContactForm;