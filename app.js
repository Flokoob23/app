// app.js con historial de carreras y sonido integrado
const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const historialPostUrl = 'https://script.google.com/macros/s/AKfycbzN5m29Vy5yFYEe_HjWcJlLq-xY0Vh8jMyuq7T4xMUFX75ejNPe13V6olm0hXoCh9Wi/exec';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

// Elementos del DOM
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

const btnHistorial = document.getElementById('btnHistorial');
const pantallaHistorial = document.getElementById('pantallaHistorial');
const btnVolverPerfil2 = document.getElementById('btnVolverPerfil2');
const formCarrera = document.getElementById('formCarrera');
const tablaCarreras = document.getElementById('tablaCarreras');

document.addEventListener('DOMContentLoaded', () => {
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

    perfil.setAttribute('data-dni', atleta.DNI);
  }

  // Mostrar modal entrenamientos
  btnEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    perfil.classList.add('hidden');
    modalEntrenamientos.classList.remove('hidden');
    modalEntrenamientos.style.opacity = 0;
    setTimeout(() => modalEntrenamientos.style.opacity = 1, 50);

    listaEntrenamientos.innerHTML = 'Cargando entrenamientos...';

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: function(results) {
        const data = results.data;
        const fila = data.find(row => row[0] === dni);

        if (!fila) {
          listaEntrenamientos.innerHTML = '<p>No se encontraron entrenamientos.</p>';
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
              <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">🔍</a>
              <button onclick="marcarCompletado('${ejercicio}')">✅</button>
            </li>
          `;
        });

        html += '</ul>';
        listaEntrenamientos.innerHTML = html;
      },
      error: function() {
        listaEntrenamientos.innerHTML = '<p>Error al cargar entrenamientos.</p>';
      }
    });
  });

  btnCerrarModal.addEventListener('click', () => {
    modalEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Función completar entrenamiento
  window.marcarCompletado = function(ejercicio) {
    alert(`✔ Entrenamiento marcado como completado: ${ejercicio}`);
    sonidoConfirmacion.play();
  };

  // HISTORIAL EN CARRERAS
  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
    pantallaHistorial.style.opacity = 0;
    setTimeout(() => pantallaHistorial.style.opacity = 1, 50);
    cargarHistorial();
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  formCarrera.addEventListener('submit', async (e) => {
    e.preventDefault();
    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempo = parseFloat(document.getElementById('tiempoInput').value);
    const dni = perfil.getAttribute('data-dni');

    if (!evento || isNaN(distancia) || isNaN(tiempo)) {
      alert('Completá todos los campos correctamente.');
      return;
    }

    const ritmo = (tiempo / distancia).toFixed(2);

    try {
      const response = await fetch(historialPostUrl, {
        method: 'POST',
        body: JSON.stringify({ dni, evento, distancia, tiempo }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        sonidoConfirmacion.play();
        alert(`✅ Carrera guardada: ${evento}\n🏃‍♂️ Distancia: ${distancia} km\n⏱️ Tiempo: ${tiempo} min\n⚡ Ritmo: ${ritmo} min/km`);
        formCarrera.reset();
        cargarHistorial();
      } else {
        alert('❌ Error al guardar. Intentalo de nuevo.');
      }
    } catch (error) {
      alert('❌ Error de conexión.');
    }
  });

  function cargarHistorial() {
    const dni = perfil.getAttribute('data-dni');
    tablaCarreras.innerHTML = '📊 Cargando historial...';

    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=987654321&single=true&output=csv', {
      download: true,
      header: true,
      complete: function(results) {
        const data = results.data.filter(row => row.DNI === dni);
        if (data.length === 0) {
          tablaCarreras.innerHTML = '<p>🕳️ No hay carreras registradas aún.</p>';
          return;
        }
        let html = '<table><thead><tr><th>🏟️ Evento</th><th>📏 Distancia</th><th>⏱️ Tiempo</th><th>⚡ Ritmo</th></tr></thead><tbody>';
        data.forEach(c => {
          html += `<tr><td>${c['Evento']}</td><td>${c['Distancia (km)']} km</td><td>${c['Tiempo (min)']} min</td><td>${c['Ritmo (min/km)']} min/km</td></tr>`;
        });
        html += '</tbody></table>';
        tablaCarreras.innerHTML = html;
      },
      error: function() {
        tablaCarreras.innerHTML = '<p>❌ Error al cargar historial.</p>';
      }
    });
  }
});
