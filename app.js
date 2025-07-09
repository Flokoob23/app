const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

let atletas = [];

document.addEventListener('DOMContentLoaded', () => {
  const bienvenida = document.getElementById('pantallaBienvenida');
  const gimnasio = document.getElementById('pantallaGimnasio');
  const perfil = document.getElementById('pantallaPerfil');

  setTimeout(() => {
    bienvenida.classList.add('hidden');
    gimnasio.classList.remove('hidden');
  }, 2500);

  document.getElementById('btnIniciarSesion').addEventListener('click', () => {
    document.getElementById('formLogin').classList.remove('hidden');
  });

  document.getElementById('btnLogin').addEventListener('click', () => {
    const dni = document.getElementById('dniInput').value.trim();
    const clave = document.getElementById('claveInput').value.trim();

    if (!dni || !clave) {
      alert('Por favor, completá DNI y clave.');
      return;
    }

    Papa.parse(accesoUrl, {
      download: true,
      header: true,
      complete: function(results) {
        atletas = results.data;

        // Buscar atleta coincidente
        const atleta = atletas.find(a => a.DNI === dni && a.Clave === clave);

        if (atleta) {
          // Mostrar perfil
          mostrarPerfil(atleta);
        } else {
          alert('❌ DNI o clave incorrectos');
        }
      },
      error: function() {
        alert('Error al cargar los datos, intentá de nuevo.');
      }
    });
  });

  function mostrarPerfil(atleta) {
    gimnasio.classList.add('hidden');
    perfil.classList.remove('hidden');

    document.getElementById('nombreAtleta').textContent = atleta.Nombre || 'Atleta';
    document.getElementById('fotoAtleta').src = atleta.Foto || 'https://via.placeholder.com/150?text=Sin+Foto';
  }

  // Hacemos visible la función mostrarPerfil fuera
  window.mostrarPerfil = mostrarPerfil;
});
