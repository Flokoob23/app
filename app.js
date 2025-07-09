const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

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
      header: false,  // <---- Aquí ponemos false para NO usar encabezados
      complete: function(results) {
        const data = results.data;

        // Encontrar fila donde dni (col 0) y clave (col 1) coinciden
        const atletaFila = data.find(row => row[0] === dni && row[1] === clave);

        if (atletaFila) {
          // Datos asumidos:
          // dni = row[0], clave = row[1], nombre = row[2], foto = row[3]
          const atleta = {
            DNI: atletaFila[0],
            Clave: atletaFila[1],
            Nombre: atletaFila[2] || 'Atleta',
            Foto: atletaFila[3] || 'https://via.placeholder.com/150?text=Sin+Foto'
          };
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

    document.getElementById('nombreAtleta').textContent = atleta.Nombre;
    document.getElementById('fotoAtleta').src = atleta.Foto;
  }

  window.mostrarPerfil = mostrarPerfil;
});
