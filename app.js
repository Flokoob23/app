const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

let atletas = [];

document.addEventListener('DOMContentLoaded', () => {
  // Pantalla inicial (FLOKOOB)
  const bienvenida = document.getElementById('pantallaBienvenida');
  const gimnasio = document.getElementById('pantallaGimnasio');

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

    Papa.parse(accesoUrl, {
      download: true,
      header: true,
      complete: function(results) {
        atletas = results.data;

        const atleta = atletas.find(a => a.DNI === dni && a.Clave === clave);

        if (atleta) {
          mostrarPerfil(atleta);
        } else {
          alert('❌ DNI o clave incorrectos');
        }
      }
    });
  });
});

function mostrarPerfil(atleta) {
  document.getElementById('pantallaGimnasio').classList.add('hidden');
  const perfil = document.getElementById('pantallaPerfil');
  perfil.classList.remove('hidden');

  document.getElementById('nombreAtleta').textContent = atleta.Nombre || 'Atleta';
  document.getElementById('fotoAtleta').src = atleta.Foto || 'https://via.placeholder.com/150';
}
