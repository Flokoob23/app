const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const historialPostUrl = 'https://script.google.com/macros/s/AKfycbyYWNG8i6GRDm4q0ycLyM2fqv-teSlcXHMPWvL-xsB-A-sh-I0vGbDDEmlodKMmYAV4/exec';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

const bienvenida = document.getElementById('pantallaBienvenida');
const gimnasio = document.getElementById('pantallaGimnasio');
const perfil = document.getElementById('pantallaPerfil');
const btnIniciarSesion = document.getElementById('btnIniciarSesion');
const formLogin = document.getElementById('formLogin');
const btnLogin = document.getElementById('btnLogin');
const btnEntrenamientos = document.getElementById('btnEntrenamientos');
const pantallaEntrenamientos = document.getElementById('modalEntrenamientos');
const contenedorEntrenamientos = document.getElementById('listaEntrenamientos');
const btnCerrarModal = document.getElementById('btnCerrarModal');

const btnHistorial = document.getElementById('btnHistorial');
const pantallaHistorial = document.getElementById('pantallaHistorial');
const btnVolverPerfil2 = document.getElementById('btnVolverPerfil2');
const formCarrera = document.getElementById('formCarrera');
const tablaCarreras = document.getElementById('tablaCarreras');

function convertirTiempoAMinutos(tiempoStr) {
  const partes = tiempoStr.trim().split(':').map(p => parseInt(p, 10));
  while (partes.length < 3) partes.unshift(0);
  const [horas, minutos, segundos] = partes;
  return horas * 60 + minutos + segundos / 60;
}

function normalizarTiempo(tiempoStr) {
  const partes = tiempoStr.trim().split(':');
  while (partes.length < 3) partes.unshift('00');
  return partes.map(p => p.padStart(2, '0')).join(':');
}

// Formato de input tiempo: muestra 00:00:00 y permite escribir sin borrar ":"
function formatearInputTiempo(e) {
  const input = e.target;
  let val = input.value;

  // Quitar todo lo que no sea número o ":"
  val = val.replace(/[^\d:]/g, '');

  // Limitar longitud a 8 caracteres (hh:mm:ss)
  if (val.length > 8) val = val.slice(0, 8);

  // Agregar ":" en las posiciones correctas si el usuario no los escribió
  if (val.length > 2 && val[2] !== ':') {
    val = val.slice(0, 2) + ':' + val.slice(2);
  }
  if (val.length > 5 && val[5] !== ':') {
    val = val.slice(0, 5) + ':' + val.slice(5);
  }

  // Completar con 00 si es más corto
  const partes = val.split(':');
  while (partes.length < 3) partes.push('00');

  input.value = partes.map(p => p.padStart(2, '0')).join(':').slice(0, 8);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    bienvenida.style.transition = 'opacity 1.2s ease';
    bienvenida.style.opacity = 0;

    // Cambiamos fondo body a naranja en el mismo momento que se desvanece bienvenida
    document.body.style.backgroundColor = '#FFA500';

    setTimeout(() => {
      bienvenida.classList.add('hidden');
      gimnasio.classList.remove('hidden');
      gimnasio.style.opacity = 0;
      gimnasio.style.transition = 'opacity 1.2s ease';
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
    perfil.style.transition = 'opacity 1.2s ease';
    setTimeout(() => {
      perfil.style.opacity = 1;
    }, 50);

    document.getElementById('nombreAtleta').textContent = atleta.Nombre;
    document.getElementById('fotoAtleta').src = atleta.Foto;
    perfil.setAttribute('data-dni', atleta.DNI);
  }

  btnEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    perfil.classList.add('hidden');
    pantallaEntrenamientos.classList.remove('hidden');
    pantallaEntrenamientos.style.opacity = 0;
    pantallaEntrenamientos.style.transition = 'opacity 1.2s ease';
    setTimeout(() => pantallaEntrenamientos.style.opacity = 1, 50);

    contenedorEntrenamientos.innerHTML = 'Cargando entrenamientos...';

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: function(results) {
        const data = results.data;
        const fila = data.find(row => row[0] === dni);

        if (!fila) {
          contenedorEntrenamientos.innerHTML = '<p>No se encontraron entrenamientos.</p>';
          return;
        }

        const fecha = fila[1];
        const ejercicios = fila.slice(2).filter(e => e && e.trim() !== '');

        let html = `<p><strong>Fecha:</strong> ${fecha}</p>`;
        html += '<ul style="list-style: none; padding: 0;">';

        ejercicios.forEach(ejercicio => {
          const encoded = encodeURIComponent(ejercicio);
          html += `
            <li style="margin-bottom: 1rem;">
              <span>${ejercicio}</span>
              <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px; cursor: pointer;">
                🔍
              </a>
            </li>
          `;
        });

        html += '</ul>';
        contenedorEntrenamientos.innerHTML = html;
      },
      error: function() {
        contenedorEntrenamientos.innerHTML = '<p>Error al cargar entrenamientos.</p>';
      }
    });
  });

  btnCerrarModal.addEventListener('click', () => {
    pantallaEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // HISTORIAL DE CARRERAS Y FORMULARIO

  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
    pantallaHistorial.style.opacity = 0;
    pantallaHistorial.style.transition = 'opacity 1.2s ease';
    setTimeout(() => pantallaHistorial.style.opacity = 1, 50);
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Input para tiempo: formatear al escribir
  const tiempoInput = document.getElementById('tiempoInput');
  tiempoInput.addEventListener('input', formatearInputTiempo);
  tiempoInput.value = '00:00:00';

  formCarrera.addEventListener('submit', (e) => {
    e.preventDefault();

    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempoInputVal = document.getElementById('tiempoInput').value.trim();
    const tiempoNormalizado = normalizarTiempo(tiempoInputVal);
    const tiempo = convertirTiempoAMinutos(tiempoNormalizado);
    const ritmo = (tiempo / distancia).toFixed(2);
    const dni = perfil.getAttribute('data-dni');

    if (!evento || !distancia || !tiempoInputVal) {
      alert('Por favor completá todos los campos');
      return;
    }

    fetch(historialPostUrl, {
      method: 'POST',
      body: JSON.stringify({
        dni,
        evento,
        distancia,
        tiempo: tiempoNormalizado,
        ritmo
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        sonidoConfirmacion.play();
        tablaCarreras.innerHTML += `
          <p>✅ ${evento} - ${distancia}km - ${tiempoNormalizado} - Ritmo: ${ritmo} min/km</p>
        `;
        formCarrera.reset();
        tiempoInput.value = '00:00:00';
      } else {
        alert('❌ ' + data.message);
      }
    })
    .catch(() => alert('❌ Error de conexión'));
  });
});
