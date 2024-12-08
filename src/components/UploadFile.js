import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'; // Importar react-dropzone
import Swal from 'sweetalert2';
import LogoutButton from './LogoutButton';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // Obtener el usuario desde localStorage
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;

  // Validar permisos
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      // Si no hay token, redirigir al login
      Swal.fire({
        icon: 'error',
        title: 'No autorizado',
        text: 'No tienes sesión activa. Por favor, inicia sesión.',
      }).then(() => {
        navigate('/login');  // Redirigir al login
      });
      return;
    }
    if (!user || user.role !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para acceder a esta página',
        confirmButtonText: 'Ir al Dashboard',
      }).then(() => {
        navigate('/dashboard');
      });
    }
  }, [user, navigate]);

  // Función para manejar la subida del archivo
  const uploadFile = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo no seleccionado',
        text: 'Por favor, selecciona un archivo para subir.',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Archivo cargado exitosamente',
      });
      setFile(null); // Limpiar el archivo después de subirlo
      setIsUploading(false);
    } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
            // Token inválido o expirado
            localStorage.removeItem('access_token'); // Eliminar el token
            localStorage.removeItem('user');
            Swal.fire({
              icon: 'error',
              title: 'Sesión expirada',
              text: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
            }).then(() => {
              // Redirigir al login después de cerrar la alerta
              window.location.href = '/login';
            });
          } else {
            // Otros errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al cargar el archivo',
            });
          }
        
          setIsUploading(false);
    }
  };

  // Configuración de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (
        acceptedFiles[0]?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFile(acceptedFiles[0]);
        setError('');
      } else {
        setError('Por favor, seleccione un archivo Excel válido');
      }
    },
    multiple: false, // Solo un archivo a la vez
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Solo Excel
  });

  // Función para borrar el archivo seleccionado
  const removeFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="container mt-4">
        <LogoutButton />
      <div className="text-center">
        <h3>Subir archivo Excel</h3>
      </div>

      <div
        {...getRootProps()}
        className={`dropzone border rounded p-5 mt-4 text-center ${
          isDragActive ? 'border-primary' : 'border-secondary'
        }`}
        style={{ cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary">Suelta el archivo aquí...</p>
        ) : (
          <p>
            Arrastra y suelta un archivo aquí, o haz clic para seleccionar un
            archivo.
          </p>
        )}
      </div>

      {file && (
        <div className="alert alert-success mt-3 d-flex justify-content-between align-items-center">
          <span>Archivo seleccionado: {file.name}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={removeFile}
            style={{ marginLeft: '10px' }}
          >
            Eliminar
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <button
        onClick={uploadFile}
        disabled={isUploading || !file}
        className="btn btn-primary w-100 mt-3"
      >
        {isUploading ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Subiendo...</span>
          </div>
        ) : (
          'Subir archivo'
        )}
      </button>

      <button
        onClick={() => navigate('/dashboard')}
        className="btn btn-secondary w-100 mt-3"
      >
        Ir al Dashboard
      </button>
    </div>
  );
};

export default UploadFile;