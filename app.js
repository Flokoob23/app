// app.js con historial de carreras, tiempo hh:mm:ss, y sonido integrado
const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const historialPostUrl = 'https://script.google.com/macros/s/AKfycbyYWNG8i6GRDm4q0ycLyM2fqv-teSlcXhMPWvL-xsB-A-sh-I0vGbDDEmlodKMmYAV4/exec';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

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

function convertirTiempoAMinutos(tiempoStr) {
  const partes = tiempoStr.trim().split(':').map(p => parseInt(p, 10));
  while (partes.length < 3) partes.unshift(0); // Agrega ceros al principio
  const [horas, minutos, segundos] = partes;
  return horas * 60 + minutos + segundos / 60;
}

document.addEventListener('DOMContentLoaded', () => {
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
              <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">🔍</a>
              <button onclick="marcarCompletado('${ejercicio}')">✅</button>
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

  window.marcarCompletado = function(ejercicio) {
    alert(`✔ Entrenamiento marcado como completado: ${ejercicio}`);
    sonidoConfirmacion.play();
  };

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
    const tiempoTexto = document.getElementById('tiempoInput').value.trim();
    const tiempoMinutos = convertirTiempoAMinutos(tiempoTexto);
    const dni = perfil.getAttribute('data-dni');

    if (!evento || isNaN(distancia) || isNaN(tiempoMinutos)) {
      alert('Completá todos los campos correctamente.');
      return;
    }

    const ritmo = (tiempoMinutos / distancia).toFixed(2);

    try {
      const response = await fetch(historialPostUrl, {
        method: 'POST',
        body: JSON.stringify({ dni, evento, distancia, tiempo: tiempoMinutos, ritmo }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.status === 'ok') {
        sonidoConfirmacion.play();
        alert(`✅ Carrera guardada: ${evento}\n🏃‍♂️ Distancia: ${distancia} km\n⏱️ Tiempo: ${tiempoTexto}\n⚡ Ritmo: ${ritmo} min/km`);
        formCarrera.reset();
        cargarHistorial();
      } else {
        alert('❌ Error: ' + result.message);
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

