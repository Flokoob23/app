const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

document.addEventListener('DOMContentLoaded', () => {
  const bienvenida = document.getElementById('pantallaBienvenida');
  const gimnasio = document.getElementById('pantallaGimnasio');
  const perfil = document.getElementById('pantallaPerfil');
  const btnIniciarSesion = document.getElementById('btnIniciarSesion');
  const formLogin = document.getElementById('formLogin');
  const btnLogin = document.getElementById('btnLogin');
  const btnEntrenamientos = document.getElementById('btnEntrenamientos');
  const modalEntrenamientos = document.getElementById('modalEntrenamientos');
  const listaEntrenamientos = document.getElementById('listaEntrenamientos');
  const btnCerrarModal = document.getElementById('btnCerrarModal');

  // Transición con fade suave de bienvenida a gimnasio
  setTimeout(() => {
    bienvenida.style.opacity = 0;
    setTimeout(() => {
      bienvenida.classList.add('hidden');
      gimnasio.classList.remove('hidden');
      gimnasio.style.opacity = 0;
      setTimeout(() => {
        gimnasio.style.opacity = 1;
      }, 50);
    }, 1200);
  }, 2500);

  btnIniciarSesion.addEventListener('click', () => {
    btnIniciarSesion.style.display = 'none';
    formLogin.classList.remove('hidden');
  });

  btnLogin.addEventListener('click', () => {
    const dni = document.getElementById('dniInput').value.trim();
    const clave = document.getElementById('claveInput').value.trim();

    if (!dni || !clave) {
      alert('Por favor, completá DNI y clave.');
      return;
    }

    Papa.parse(accesoUrl, {
      download: true,
      header: false,
      complete: function(results) {
        const data = results.data;
        const atletaFila = data.find(row => row[0] === dni && row[1] === clave);

        if (atletaFila) {
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
    bienvenida.classList.add('hidden');
    perfil.classList.remove('hidden');
    perfil.style.opacity = 0;
    setTimeout(() => {
      perfil.style.opacity = 1;
    }, 50);

    document.getElementById('nombreAtleta').textContent = atleta.Nombre;
    document.getElementById('fotoAtleta').src = atleta.Foto;

    perfil.setAttribute('data-dni', atleta.DNI); // guardo DNI para buscar entrenamientos
  }

  btnEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    // Limpiar lista antes de cargar
    listaEntrenamientos.innerHTML = '<li>Cargando entrenamientos...</li>';
    modalEntrenamientos.classList.remove('hidden');

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: function(results) {
        const data = results.data;
        // Filtrar filas con DNI igual al del atleta
        const entrenosAtleta = data.filter(row => row[0] === dni);

        if (entrenosAtleta.length === 0) {
          listaEntrenamientos.innerHTML = '<li>No se encontraron entrenamientos.</li>';
          return;
        }

        // Vaciar lista para mostrar
        listaEntrenamientos.innerHTML = '';

        entrenosAtleta.forEach(fila => {
          // fila ejemplo: [DNI, FECHA, EJERCICIO1, EJERCICIO2, ...]
          const fecha = fila[1];
          const ejercicios = fila.slice(2).filter(e => e && e.trim() !== '');

          const liFecha = document.createElement('li');
          liFecha.style.fontWeight = '700';
          liFecha.textContent = `Fecha: ${fecha}`;
          listaEntrenamientos.appendChild(liFecha);

          ejercicios.forEach(ejercicio => {
            const liEj = document.createElement('li');
            const enlace = document.createElement('a');
            enlace.href = `https://www.google.com/search?q=${encodeURIComponent(ejercicio)}`;
            enlace.target = '_blank';
            enlace.rel = 'noopener noreferrer';
            enlace.textContent = ejercicio;
            liEj.appendChild(enlace);
            listaEntrenamientos.appendChild(liEj);
          });
        });
      },
      error: function() {
        listaEntrenamientos.innerHTML = '<li>Error al cargar los entrenamientos.</li>';
      }
    });
  });

  btnCerrarModal.addEventListener('click', () => {
    modalEntrenamientos.classList.add('hidden');
  });

});
