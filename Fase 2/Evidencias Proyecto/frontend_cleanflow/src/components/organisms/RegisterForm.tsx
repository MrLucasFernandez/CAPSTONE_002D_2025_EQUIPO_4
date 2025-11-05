import React, { useState } from 'react';
// Asegúrate de que las rutas a tus componentes InputField y Button sean correctas
import InputField from '../molecules/InputField'; 
import {Button} from '../atoms/Button';          

// 📐 Definición del tipo de datos para el formulario
interface RegistrationData {
  rut: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

const initialFormData: RegistrationData = {
  rut: '',
  nombre: '',
  email: '',
  telefono: '',
  password: '',
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de registro enviados:', formData);
    
    // Aquí iría la lógica de API para registrar al usuario
    alert('Formulario enviado. Revisa la consola para ver los datos.');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 w-full max-w-lg bg-white rounded-xl shadow-2xl space-y-5"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900">Crear Cuenta</h2>

      {/* Campo: Nombre Completo */}
      <InputField
        label="Nombre Completo"
        id="nombre"
        type="text"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      {/* Campo: RUT (Rol Único Tributario/Nacional) */}
      <InputField
        label="RUT (Ej: 12345678-K)"
        id="rut"
        type="text"
        value={formData.rut}
        onChange={handleChange}
        placeholder="Sin puntos, con guion"
        required
      />

      {/* Campo: Correo Electrónico */}
      <InputField
        label="Correo Electrónico"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      {/* Campo: Número Telefónico */}
      <InputField
        label="Número Telefónico"
        id="telefono"
        type="tel"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="+56 9 XXXX XXXX"
        required
      />
      
      {/* Campo: Contraseña */}
      <InputField
        label="Contraseña"
        id="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8} // Mínimo de seguridad
      />
      
      <Button type="submit" variant='primary' className="w-full mt-6">
        Registrarse
      </Button>

      {/* Link a Login */}
      <p className="text-center text-sm pt-2">
        ¿Ya tienes cuenta? 
        <a 
          href="/login" // Asegúrate de que esta sea tu ruta de login
          className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition duration-150 ease-in-out"
        >
          Inicia Sesión
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;