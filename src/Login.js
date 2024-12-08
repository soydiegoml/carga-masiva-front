import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si ya hay un token de sesión en el localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // Si ya existe el token, redirigir al dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Por favor, completa todos los campos antes de continuar.',
      });
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón mientras se realiza la solicitud

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        grant_type: 'password',
        client_id: '3', // Reemplaza con el ID de tu cliente OAuth
        client_secret: 'Tp3BHNcwdPS5HZGoOqRKcVBlZhPW86Bk7zyu6zYc', // Reemplaza con el secret de tu cliente OAuth
        email: email,
        password: password,
        scope: '',
      });

      // Guarda el token y el usuario en localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Mostrar un mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.',
      });
      console.error(err);
    } finally {
      setIsSubmitting(false); // Rehabilitar el botón
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-center mb-4">Iniciar sesión</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Ingrese su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="text-center mt-3">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;