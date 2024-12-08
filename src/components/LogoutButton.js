import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar solicitud al backend para revocar el token
        axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Pasar el token en los headers
          },
        })
        .then(() => {
          // Eliminar el token y el usuario del localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          
          // Redirigir al login
          navigate('/login');
          
          Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Tu sesión se ha cerrado exitosamente.',
          });
        })
        .catch((error) => {
          console.error('Error al cerrar sesión:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cerrar sesión correctamente.',
          });
        });
      }
    });
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;