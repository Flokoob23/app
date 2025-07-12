// app.js funcional con historial y formato hh:mm:ss validado
const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const historialPostUrl = 'https://script.google.com/macros/s/AKfycbzu8LJzwCztbyxFqUkS3o8TVTYZr3WODU4ZLbMdt7rZcXqJUC2421z1u6NmMR8OYkEv/exec';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

document.addEventListener('DOMContentLoaded', () => {
  const perfil = document.getElementById('pantallaPerfil');
  const btnEntrenamientos = document.getElementById('btnEntrenamientos');
  const modalEntrenamientos = document.getElementById('modalEntrenamientos');
  const listaEntrenamientos = document.getElementById('listaEntrenamientos');
  const btnCerrarModal = document.getElementById('btnCerrarModal');

  const btnHistorial = document.getElementById('btnHistorial');
  const pantallaHistorial = document.getElementById('pantallaHistorial');
  const formCarrera = document.getElementById('formCarrera');
  const tablaCarreras = document.getElementById('tablaCarreras');
  const btnVolverPerfil2 = document.getElementById('btnVolverPerfil2');

  btnEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    listaEntrenamientos.innerHTML = 'Cargando...';
    perfil.classList.add('hidden');
    modalEntrenamientos.classList.remove('hidden');

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: (results) => {
        const fila = results.data.find(row => row[0] === dni);
        if (!fila) {
          listaEntrenamientos.innerHTML = '<li>No se encontraron entrenamientos.</li>';
          return;
        }
        const ejercicios = fila.slice(2).filter(e => e.trim());
        listaEntrenamientos.innerHTML = ejercicios.map(e => `
          <li>
            ${e} 
            <a href="https://www.google.com/search?q=${encodeURIComponent(e)}" target="_blank">🔍</a> 
            <button onclick="alert('✅ Marcado como completado: ${e}'); sonidoConfirmacion.play();">✅</button>
          </li>
        `).join('');
      }
    });
  });

  btnCerrarModal.addEventListener('click', () => {
    modalEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
    cargarHistorial();
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  formCarrera.addEventListener('submit', async () => {
    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempoRaw = document.getElementById('tiempoInput').value.trim();
    const dni = perfil.getAttribute('data-dni');

    const minutosDecimales = convertirTiempoAMinutos(tiempoRaw);
    if (!evento || isNaN(distancia) || isNaN(minutosDecimales)) {
      alert('⚠️ Completá todos los campos correctamente.');
      return;
    }

    const ritmo = (minutosDecimales / distancia).toFixed(2);

    const data = { dni, evento, distancia, tiempo: tiempoRaw, ritmo };

    try {
      const response = await fetch(historialPostUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const res = await response.json();
      if (res.status === 'ok') {
        sonidoConfirmacion.play();
        alert(`✅ Carrera registrada correctamente\n🏁 ${evento} - ${distancia}km\n⏱ ${tiempoRaw} (${minutosDecimales} min)\n⚡ Ritmo: ${ritmo} min/km`);
        formCarrera.reset();
        cargarHistorial();
      } else {
        alert('❌ Error al registrar: ' + res.message);
      }
    } catch (err) {
      alert('❌ Error de conexión.');
    }
  });

  function cargarHistorial() {
    const dni = perfil.getAttribute('data-dni');
    tablaCarreras.innerHTML = '⏳ Cargando historial...';

    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=987654321&single=true&output=csv', {
      download: true,
      header: true,
      complete: function(results) {
        const datos = results.data.filter(row => row.DNI === dni);
        if (datos.length === 0) {
          tablaCarreras.innerHTML = '🙁 No hay carreras registradas aún.';
          return;
        }
        let tabla = '<table><thead><tr><th>🏟 Evento</th><th>📏 Distancia</th><th>⏱ Tiempo</th><th>⚡ Ritmo</th></tr></thead><tbody>';
        datos.forEach(r => {
          tabla += `<tr><td>${r['Evento']}</td><td>${r['Distancia']} km</td><td>${r['Tiempo']}</td><td>${r['Ritmo']} min/km</td></tr>`;
        });
        tabla += '</tbody></table>';
        tablaCarreras.innerHTML = tabla;
      }
    });
  }

  function convertirTiempoAMinutos(tiempo) {
    const partes = tiempo.split(':').map(p => parseInt(p, 10));
    if (partes.length === 1 && !isNaN(partes[0])) return partes[0];
    if (partes.length === 2) return partes[0] + partes[1] / 60;
    if (partes.length === 3) return partes[0] * 60 + partes[1] + partes[2] / 60;
    return NaN;
  }
});
