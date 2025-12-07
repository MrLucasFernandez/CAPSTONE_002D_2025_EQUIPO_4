import React, { useState } from 'react';
import InputField from '@/components/molecules/forms/InputField';
import { Button } from '@/components/atoms/forms/Button';
import { rutValidator } from '@utils/rutValidator'; 
import { useAuth } from '../hooks/useAuth';
import Toast from '@components/ui/Toast';
import type { AuthCredentials } from '@models/auth'; 

interface RegistrationData extends AuthCredentials {
  rut: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  correo: string;
  telefono: string;
  contrasena: string;
  direccionUsuario: string;
}

const initialFormData: RegistrationData = {
  rut: '',
  nombreUsuario: '', 
  apellidoUsuario: '',
  correo: '',
  telefono: '',
  contrasena: '',
  direccionUsuario: '',
};

const RegisterForm: React.FC = () => {
  const { register } = useAuth(); 

  const [formData, setFormData] = useState<RegistrationData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [rutError, setRutError] = useState<string | null>(null);
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [apellidoError, setApellidoError] = useState<string | null>(null);
  // 💡 CORRECCIÓN: Cambiado de passwordError a contrasenaError
  const [contrasenaError, setContrasenaError] = useState<string | null>(null); 
  const [direccionUsuarioError, setDireccionUsuarioError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'rut') {
        const isValid = rutValidator(value);
        setRutError((!isValid && value.length > 0) ? 'El RUT ingresado no es válido.' : null);
    } 
    // 💡 CORRECCIÓN: La validación debe ser con 'contrasena', no 'password'
    else if (id === 'contrasena') { 
        setContrasenaError(value.length > 0 && value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : null);
    } else if (id === 'nombreUsuario') {
        setNombreError(value.trim().length === 0 ? 'El nombre es obligatorio.' : null);
    } else if (id === 'apellidoUsuario') {
        setApellidoError(value.trim().length === 0 ? 'El apellido es obligatorio.' : null);
    }
    else if (id === 'direccionUsuario') {
        setDireccionUsuarioError(value.trim().length === 0 ? 'La dirección es obligatoria.' : null);
    }

    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    
    let hasError = false;

    const validateField = (value: string, setError: React.Dispatch<React.SetStateAction<string | null>>, errorMsg: string) => {
        if (value.trim() === '') {
            setError(errorMsg);
            hasError = true;
        } else {
            setError(null);
        }
    };
    
    const isValidRut = rutValidator(formData.rut);
    if (!isValidRut || formData.rut.trim() === '') {
        setRutError('Por favor, ingresa un RUT válido (Ej: 12345678-K).');
        hasError = true;
    } else {
        setRutError(null);
    }
    
    validateField(formData.nombreUsuario, setNombreError, 'El nombre es obligatorio.');
    validateField(formData.apellidoUsuario, setApellidoError, 'El apellido es obligatorio.');

    // 💡 CORRECCIÓN: Usar formData.contrasena y setContrasenaError
    if (formData.contrasena.length < 8) { 
        setContrasenaError('La contraseña debe tener al menos 8 caracteres.');
        hasError = true;
    } else {
        setContrasenaError(null);
    }
    
    // 💡 CORRECCIÓN: Usar formData.correo
    if (formData.correo.trim() === '' || formData.telefono.trim() === '') { 
        setGlobalError('Por favor, completa todos los campos obligatorios.');
        hasError = true;
    }

    validateField(formData.direccionUsuario, setDireccionUsuarioError, 'La dirección completa es obligatoria.');
    
    if (hasError) {
      setGlobalError(globalError || 'Existen errores en el formulario. Por favor, revísalos.');
      return; 
    }
    
    const telefonoSoloDigitos = formData.telefono.replace(/[^\d]/g, '');

    const dataToSend: AuthCredentials = {
      rut: formData.rut,
      nombreUsuario: formData.nombreUsuario,
      apellidoUsuario: formData.apellidoUsuario,
      correo: formData.correo,
      telefono: telefonoSoloDigitos,
      contrasena: formData.contrasena,
      direccionUsuario: formData.direccionUsuario,
    };

    setLoading(true);

    try {
      await register(dataToSend);

      setToastMessage({
        message: "¡Registro completado! Ya puedes iniciar sesión.",
        type: "success",
      });
      setShowToast(true);
      setFormData(initialFormData);
      setGlobalError(null);
      
    } catch (err) {
      const errorMessage = (err as Error).message || 'Error desconocido al procesar el registro.';
      setToastMessage({
        message: errorMessage,
        type: "error",
      });
      setShowToast(true);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 💡 CORRECCIÓN: Usar contrasenaError en el botón de deshabilitación
  const disableButton = loading || !!rutError || !!nombreError || !!apellidoError || !!contrasenaError || !!direccionUsuarioError;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 w-full max-w-lg bg-white rounded-xl shadow-2xl space-y-5"
    >
      {showToast && toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setShowToast(false)}
          duration={toastMessage.type === "success" ? 2000 : 4000}
        />
      )}

      <h2 className="text-3xl font-bold text-center text-gray-900">Crear Cuenta</h2>

      {globalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              {globalError}
          </div>
      )}

      <InputField label="Nombre(s)" id="nombreUsuario" type="text" value={formData.nombreUsuario} onChange={handleChange} required error={nombreError} />
      <InputField label="Apellido(s)" id="apellidoUsuario" type="text" value={formData.apellidoUsuario} onChange={handleChange} required error={apellidoError} />
      <InputField label="RUT (Ej: 12345678-K)" id="rut" type="text" value={formData.rut} onChange={handleChange} placeholder="Sin puntos, con guion" required error={rutError} />
      
      {/* 💡 CORRECCIÓN: ID y Value deben ser 'correo' */}
      <InputField 
          label="Correo Electrónico" 
          id="correo" // <-- CORREGIDO: Usar 'correo'
          type="email" 
          value={formData.correo} // <-- CORRECTO: Usa formData.correo
          onChange={handleChange} 
          required 
      />
      
      <InputField label="Número Telefónico" id="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="+56 9 XXXX XXXX" required />
      
      {/* 💡 CORRECCIÓN: ID debe ser 'contrasena' y error debe ser contrasenaError */}
      <InputField 
          label="Contraseña" 
          id="contrasena" // <-- CORREGIDO: Usar 'contrasena'
          type="password" 
          value={formData.contrasena} // <-- CORRECTO: Usa formData.contrasena
          onChange={handleChange} 
          required 
          minLength={8} 
          error={contrasenaError} // <-- CORREGIDO: Usar contrasenaError
      />
      
      <InputField 
        label="Dirección Completa" 
        id="direccionUsuario" 
        type="text" 
        value={formData.direccionUsuario} 
        onChange={handleChange} 
        placeholder="Ej: Av. Siempre Viva 742, Springfield, RM"
        required 
        error={direccionUsuarioError} 
      />
      
      <Button 
        type="submit" 
        variant='primary' 
        className="w-full mt-6"
        disabled={disableButton}
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