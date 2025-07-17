const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const historialPostUrl = 'https://script.google.com/macros/s/AKfycbzw9pLSFJg-uGUUNGYKRZWfURRhQqU-KjwzpDIyzy69kkyqDhpPBzKnM3nip96oIQhR/exec';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

document.addEventListener('DOMContentLoaded', () => {
  const bienvenida = document.getElementById('pantallaBienvenida');
  const gimnasio = document.getElementById('pantallaGimnasio');
  const perfil = document.getElementById('pantallaPerfil');
  const btnIniciarSesion = document.getElementById('btnIniciarSesion');
  const formLogin = document.getElementById('formLogin');
  const btnLogin = document.getElementById('btnLogin');
  const btnIrEntrenamientos = document.getElementById('btnEntrenamientos');
  const pantallaEntrenamientos = document.getElementById('modalEntrenamientos');
  const contenedorEntrenamientos = document.getElementById('listaEntrenamientos');
  const btnVolverPerfil = document.getElementById('btnCerrarModal');

  const btnHistorial = document.getElementById('btnHistorial');
  const pantallaHistorial = document.getElementById('pantallaHistorial');
  const btnVolverPerfil2 = document.getElementById('btnVolverPerfil2');
  const formCarrera = document.getElementById('formCarrera');
  const tablaCarreras = document.getElementById('tablaCarreras');
  const tiempoInput = document.getElementById('tiempoInput');

  // Degradado inicial
  setTimeout(() => {
    bienvenida.style.transition = 'opacity 1.2s ease';
    bienvenida.style.opacity = 0;
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

  // Mostrar formulario login
  btnIniciarSesion.addEventListener('click', () => {
    btnIniciarSesion.style.display = 'none';
    formLogin.classList.remove('hidden');
  });

  // Login y mostrar perfil
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

  // Función mostrar perfil
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

  // Mostrar entrenamientos
  btnIrEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    perfil.classList.add('hidden');
    pantallaEntrenamientos.classList.remove('hidden');
    pantallaEntrenamientos.style.opacity = 0;
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
              <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">
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

  btnVolverPerfil.addEventListener('click', () => {
    pantallaEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Mostrar historial en carreras
  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Funciones para manejar tiempo
  function normalizarTiempo(tiempoStr) {
    const partes = tiempoStr.split(':');
    while (partes.length < 3) partes.unshift('00');
    return partes.map(p => p.padStart(2, '0')).join(':');
  }

  function convertirTiempoAMinutos(tiempoStr) {
    const partes = tiempoStr.split(':').map(p => parseInt(p, 10));
    while (partes.length < 3) partes.unshift(0);
    const [horas, minutos, segundos] = partes;
    return horas * 60 + minutos + segundos / 60;
  }

  // Formateo del input tiempo mientras se escribe
  tiempoInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 6) val = val.slice(0, 6);

    if (val.length <= 2) {
      val = val;
    } else if (val.length <= 4) {
      val = val.slice(0, val.length - 2) + ':' + val.slice(val.length - 2);
    } else {
      val = val.slice(0, 2) + ':' + val.slice(2, 4) + ':' + val.slice(4);
    }

    e.target.value = val;
  });

  // Manejar envío de nueva carrera
  formCarrera.addEventListener('submit', (e) => {
    e.preventDefault();

    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempoInputVal = document.getElementById('tiempoInput').value.trim();
    const tiempoNormalizado = normalizarTiempo(tiempoInputVal);
    const tiempoEnMinutos = convertirTiempoAMinutos(tiempoNormalizado);
    const ritmo = (tiempoEnMinutos / distancia).toFixed(2);
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
        tiempo: tiempoNormalizado,  // enviamos texto hh:mm:ss
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
      } else {
        alert('❌ ' + data.message);
      }
    })
    .catch(() => alert('❌ Error de conexión'));
  });

});
