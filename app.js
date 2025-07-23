const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

const urlWebAppHistorial = 'https://script.google.com/macros/s/AKfycbwB58xj2evrz8VI4II9Q-SI64mexit0iFqjQhmzvUTbwfKHLbzt1ZwcGmJ7YdONja-W/exec';
const csvHistorialPublico = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1367748190&single=true&output=csv';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const body = document.body;
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
  const toggleModo = document.getElementById('toggleModo');

  // Modal pago cuota
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnEnviarComprobante = document.getElementById('btnEnviarComprobante');
  const btnCerrarPago = document.getElementById('btnCerrarPago');
  const inputComprobante = document.getElementById('inputComprobante');
  const mensajeComprobante = document.getElementById('mensajeComprobante');
  const estadoPago = document.getElementById('estadoPago');

  // Carga modo oscuro/claro guardado en localStorage
  const modoGuardado = localStorage.getItem('modo') || 'claro';
  setModo(modoGuardado);

  toggleModo.addEventListener('click', () => {
    const nuevoModo = body.classList.contains('dark-mode') ? 'claro' : 'oscuro';
    setModo(nuevoModo);
  });

  function setModo(modo) {
    if (modo === 'oscuro') {
      body.classList.add('dark-mode');
      toggleModo.textContent = '🌞 Claro';
    } else {
      body.classList.remove('dark-mode');
      toggleModo.textContent = '🌙 Oscuro';
    }
    localStorage.setItem('modo', modo);
  }

  // Degradado inicial - bienvenida a gimnasio
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

    // Simular estado de pago pendiente (debería venir de backend)
    estadoPago.textContent = 'Estado de pago: Pendiente de confirmación';
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
        const filas = data.filter(row => row[0] === dni);

        if (!filas.length) {
          contenedorEntrenamientos.innerHTML = '<p>No se encontraron entrenamientos.</p>';
          return;
        }

        let html = '';
        filas.forEach(fila => {
          const fecha = fila[1];
          const ejercicios = fila.slice(2).filter(e => e && e.trim() !== '');

          html += `<p><strong>Fecha:</strong> ${fecha}</p>`;
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

          html += '</ul><hr/>';
        });

        contenedorEntrenamientos.innerHTML = html;
      },
      error: () => {
        contenedorEntrenamientos.innerHTML = '<p>Error al cargar entrenamientos.</p>';
      }
    });
  });

  btnVolverPerfil.addEventListener('click', () => {
    pantallaEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Mostrar historial
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

  // Cargar historial de carreras
  function cargarHistorial() {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    Papa.parse(csvHistorialPublico, {
      download: true,
      header: true,
      complete: function(results) {
        const data = results.data.filter(item => item.DNI === dni);

        if (!data.length) {
          tablaCarreras.innerHTML = '<tr><td>No hay registros de carreras.</td></tr>';
          return;
        }

        // Crear tabla
        let tablaHTML = `
          <thead>
            <tr>
              <th>Evento</th>
              <th>Distancia (km)</th>
              <th>Tiempo</th>
              <th>Ritmo (min/km)</th>
            </tr>
          </thead>
          <tbody>
        `;

        data.forEach(row => {
          const ritmo = calcularRitmo(row.Tiempo, parseFloat(row.Distancia));
          tablaHTML += `
            <tr>
              <td>${row.Evento}</td>
              <td>${row.Distancia}</td>
              <td>${row.Tiempo}</td>
              <td>${ritmo}</td>
            </tr>
          `;
        });

        tablaHTML += '</tbody>';
        tablaCarreras.innerHTML = tablaHTML;
      },
      error: () => {
        tablaCarreras.innerHTML = '<tr><td>Error al cargar historial.</td></tr>';
      }
    });
  }

  // Calcular ritmo min/km
  function calcularRitmo(tiempoStr, distancia) {
    // tiempoStr formato HH:MM:SS o MM:SS
    const parts = tiempoStr.split(':').map(Number);
    let segundosTotales = 0;
    if (parts.length === 3) {
      segundosTotales = parts[0]*3600 + parts[1]*60 + parts[2];
    } else if (parts.length === 2) {
      segundosTotales = parts[0]*60 + parts[1];
    } else {
      return '0:00';
    }
    const ritmoSeg = segundosTotales / distancia;
    const min = Math.floor(ritmoSeg / 60);
    const seg = Math.round(ritmoSeg % 60);
    return `${min}:${seg.toString().padStart(2,'0')}`;
  }

  // Agregar carrera
  formCarrera.addEventListener('submit', e => {
    e.preventDefault();

    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value.trim());
    const tiempo = document.getElementById('tiempoInput').value.trim();
    const dni = perfil.getAttribute('data-dni');

    if (!evento || isNaN(distancia) || !tiempo || !dni) {
      alert('Por favor, completá todos los campos correctamente.');
      return;
    }

    // Enviar datos a Google Apps Script para guardar (requiere configuración backend)
    fetch(urlWebAppHistorial, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({dni, evento, distancia, tiempo})
    }).then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          alert('Carrera agregada correctamente.');
          formCarrera.reset();
          cargarHistorial();
        } else {
          alert('Error al guardar carrera. Intentá de nuevo.');
        }
      }).catch(() => alert('Error de conexión al guardar carrera.'));
  });

  // --- Modal pago cuota ---
  btnPagoCuota.addEventListener('click', () => {
    modalPago.classList.remove('hidden');
    modalPago.style.opacity = 0;
    setTimeout(() => modalPago.style.opacity = 1, 50);
    mensajeComprobante.style.display = 'none';
    btnEnviarComprobante.disabled = true;
    inputComprobante.value = '';
  });

  btnCerrarPago.addEventListener('click', () => {
    modalPago.style.opacity = 0;
    setTimeout(() => modalPago.classList.add('hidden'), 300);
  });

  // Validar subida de comprobante
  inputComprobante.addEventListener('change', () => {
    if (inputComprobante.files.length > 0) {
      btnEnviarComprobante.disabled = false;
      mensajeComprobante.style.display = 'none';
    } else {
      btnEnviarComprobante.disabled = true;
    }
  });

  // Enviar comprobante (simulación)
  btnEnviarComprobante.addEventListener('click', () => {
    if (inputComprobante.files.length === 0) {
      alert('Por favor, subí el comprobante de pago.');
      return;
    }

    // Aquí podrías implementar subida real a servidor o Google Drive con Apps Script

    // Desactivar botón mientras "envía"
    btnEnviarComprobante.disabled = true;
    mensajeComprobante.style.color = 'black';
    mensajeComprobante.textContent = 'Enviando comprobante...';
    mensajeComprobante.style.display = 'block';

    setTimeout(() => {
      mensajeComprobante.style.color = 'green';
      mensajeComprobante.textContent = 'Recibimos tu comprobante, en menos de 24hs se verá reflejado en la app.';
      sonidoConfirmacion.play();

      // Cambiar estado de pago a "Pendiente de revisión"
      estadoPago.textContent = 'Estado de pago: Comprobante recibido. Pendiente de confirmación administrativa.';

      // Cerrar modal automático en 4 segundos
      setTimeout(() => {
        modalPago.style.opacity = 0;
        setTimeout(() => modalPago.classList.add('hidden'), 300);
      }, 4000);
    }, 2000);
  });
});
// ... Tu código existente ...

// 👇 PEGÁ ESTO AL FINAL DEL ARCHIVO
document.addEventListener('DOMContentLoaded', () => {
  // MAPA
  const btnMapa = document.getElementById('btnMapa');
  const modalMapa = document.getElementById('modalMapa');
  const btnCerrarMapa = document.getElementById('btnCerrarMapa');
  let mapa;
  let marcador;
  let recorrido = [];

  btnMapa.addEventListener('click', () => {
    modalMapa.classList.remove('hidden');
    modalMapa.style.opacity = 1;

    if (!mapa) {
      mapa = L.map('mapa').setView([-34.6, -58.4], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapa);
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        recorrido.push([lat, lng]);

        if (!marcador) {
          marcador = L.marker([lat, lng]).addTo(mapa);
          mapa.setView([lat, lng], 17);
        } else {
          marcador.setLatLng([lat, lng]);
        }

        L.polyline(recorrido, { color: '#FFD600', weight: 5 }).addTo(mapa);
      }, err => {
        alert('No se pudo acceder a tu ubicación.');
      });
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  });

  btnCerrarMapa.addEventListener('click', () => {
    modalMapa.style.opacity = 0;
    setTimeout(() => modalMapa.classList.add('hidden'), 500);
  });
});


