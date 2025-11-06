import React, { useState } from 'react';
import InputField from '../molecules/InputField';
import { Button } from '../atoms/Button';
import { rutValidator } from '../../utils/rutValidator'; 

interface RegistrationData {
  rut: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  email: string;
  telefono: string;
  password: string;
}

const initialFormData: RegistrationData = {
  rut: '',
  nombreUsuario: '', 
  apellidoUsuario: '',
  email: '',
  telefono: '',
  password: '',
};

const API_URL = 'http://localhost:3001/api/register';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [rutError, setRutError] = useState<string | null>(null);
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [apellidoError, setApellidoError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'rut') {
        const isValid = rutValidator(value);
        setRutError((!isValid && value.length > 0) ? 'El RUT ingresado no es válido.' : null);
    } else if (id === 'password') {
        setPasswordError(value.length > 0 && value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : null);
    } else if (id === 'nombreUsuario') {
        setNombreError(value.trim().length === 0 ? 'El nombre es obligatorio.' : null);
    } else if (id === 'apellidoUsuario') {
        setApellidoError(value.trim().length === 0 ? 'El apellido es obligatorio.' : null);
    }


    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setSuccessMessage(null);
    
    let hasError = false;

    const isValidRut = rutValidator(formData.rut);
    if (!isValidRut || formData.rut.trim() === '') {
        setRutError('Por favor, ingresa un RUT válido (Ej: 12345678-K).');
        hasError = true;
    } else {
        setRutError(null);
    }
    
    if (formData.nombreUsuario.trim() === '') {
        setNombreError('El nombre es obligatorio.');
        hasError = true;
    } else {
        setNombreError(null);
    }

    if (formData.apellidoUsuario.trim() === '') {
        setApellidoError('El apellido es obligatorio.');
        hasError = true;
    } else {
        setApellidoError(null);
    }

    if (formData.password.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres.');
        hasError = true;
    } else {
        setPasswordError(null);
    }

    // Validación de campos de texto restantes (email, telefono)
    if (formData.email.trim() === '' || formData.telefono.trim() === '') {
        setGlobalError('Por favor, completa todos los campos obligatorios.');
        hasError = true;
    }
   
    if (hasError) {
        setGlobalError(globalError || (rutError || nombreError || apellidoError || passwordError ? 'Existen errores en el formulario. Por favor, revísalos.' : null));
        return; 
    }
    
    // Limpieza de datos antes de enviar: elimina cualquier caracter no numérico del teléfono
    // Esto es crucial para el backend que espera un INTEGER.
    const telefonoSoloDigitos = formData.telefono.replace(/[^\d]/g, '');

    const dataToSend = {
        rut: formData.rut,
        nombreUsuario: formData.nombreUsuario,
        apellidoUsuario: formData.apellidoUsuario,
        email: formData.email,
        telefono: telefonoSoloDigitos, // El backend debe hacer parseInt(this)
        password: formData.password,
    };

    setLoading(true);

    try {
      console.log('Intentando registrar usuario...');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Registro exitoso:', result);
        setSuccessMessage(result.message || '¡Registro completado! Ya puedes iniciar sesión.');
        setFormData(initialFormData);
        setGlobalError(null);
      } else {
        console.error('❌ Error de registro:', result);
        setGlobalError(result.message || 'Error desconocido al procesar el registro.');
      }
    } catch (err) {
      console.error('Error de red/servidor:', err);
      setGlobalError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 w-full max-w-lg bg-white rounded-xl shadow-2xl space-y-5"
    >
      <h2 className="text-3xl font-bold text-center text-gray-900">Crear Cuenta</h2>

      {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
              {successMessage}
          </div>
      )}
      {globalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              {globalError}
          </div>
      )}

      <InputField
        label="Nombre(s)"
        id="nombreUsuario"
        type="text"
        value={formData.nombreUsuario}
        onChange={handleChange}
        required
        error={nombreError}
      />

      <InputField
        label="Apellido(s)"
        id="apellidoUsuario"
        type="text"
        value={formData.apellidoUsuario}
        onChange={handleChange}
        required
        error={apellidoError}
      />

      <InputField
        label="RUT (Ej: 12345678-K)"
        id="rut"
        type="text"
        value={formData.rut}
        onChange={handleChange}
        placeholder="Sin puntos, con guion"
        required
        error={rutError} 
      />

      <InputField
        label="Correo Electrónico"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <InputField
        label="Número Telefónico"
        id="telefono"
        type="tel"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="+56 9 XXXX XXXX"
        required
      />
      
      <InputField
        label="Contraseña"
        id="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8}
        error={passwordError}
      />
      
      <Button 
        type="submit" 
        variant='primary' 
        className="w-full mt-6"
        disabled={loading || !!successMessage || !!rutError || !!nombreError || !!apellidoError || !!passwordError} 
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>

      <p className="text-center text-sm pt-2">
        ¿Ya tienes cuenta? 
        <a 
          href="/login"
          className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition duration-150 ease-in-out"
        >
          Inicia Sesión
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;