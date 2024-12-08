import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
  const [personas, setPersonas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1); // Total de páginas
  const [resultadosPorPagina, setResultadosPorPagina] = useState(10); // Número de resultados por página
  const navigate = useNavigate();
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
    // Hacer la solicitud GET al backend
    axios.get(`http://127.0.0.1:8000/api/persona/${pagina}`, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el token al encabezado
            },
        })
      .then(response => {
        setPersonas(response.data.data);
        setPagina(response.data.current_page);
      setTotalPaginas(response.data.last_page);
      })
      .catch(error => {
        console.error("Hubo un error al obtener las personas:", error);

        if (error.response && error.response.status === 401) {
            // Token inválido o expirado
            localStorage.removeItem('access_token'); // Eliminar el token

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
            text: 'Hubo un problema al obtener las personas',
        });
        }
      });
  }, [pagina]);

  const handlePaginaAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };
  const handlePaginaSiguiente = () => {
    if (pagina < totalPaginas) {
      setPagina(pagina + 1);
    }
  };
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    
    <div className="container mt-4">
        <LogoutButton />
        {user && user.role === 'admin' && (
            <div className="text-center">
                <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => navigate('/upload')}
                >
                    Agregar Persona
                </button>
            </div>
        )}
        <h2 className="text-center mb-4">Listado de Personas</h2>
  <table className="table table-sm table-bordered table-striped table-hover">
    <thead className="thead-dark">
      <tr>
        <th>Nombre</th>
        <th>Paterno</th>
        <th>Materno</th>
        <th>Teléfono</th>
        <th>Calle</th>
        <th>Número Ext</th>
        <th>Número Int</th>
        <th>Colonia</th>
        <th>CP</th>
      </tr>
    </thead>
    <tbody>
      {personas.map((persona) => (
        <tr key={persona.id}>
          <td>{persona.nombre}</td>
          <td>{persona.paterno}</td>
          <td>{persona.materno}</td>
          <td>
            <div>{persona.telefono}</div>
          </td>
          <td>
            <div>{persona.calle}</div>
          </td>
          <td>
            <div>{persona.numero_exterior}</div>
          </td>
          <td>
            <div>{persona.numero_interior}</div>
          </td>
          <td>
            <div>{persona.colonia}</div>
          </td>
          <td>
            <div>{persona.cp}</div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Paginación */}
  <div className="d-flex justify-content-between align-items-center mt-3">
    <button
      className="btn btn-primary"
      onClick={handlePaginaAnterior}
      disabled={pagina === 1}
    >
      Anterior
    </button>
    <span>Página {pagina} de {totalPaginas}</span>
    <button 
          onClick={handlePaginaSiguiente} 
          disabled={pagina === totalPaginas} // Deshabilitar si estamos en la última página
          className="btn btn-primary"
        >
          Siguiente
        </button>
  </div>
</div>
  );
};

export default Dashboard;