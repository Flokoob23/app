// Inicialización Firebase
const firebaseConfig = {
  // Pega aquí tu config desde Firebase Console (firebase-config.js es recomendado)
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
const urlWebAppHistorial = 'https://script.google.com/macros/s/AKfycbwB58xj2evrz8VI4II9Q-SI64mexit0iFqjQhmzvUTbwfKHLbzt1ZwcGmJ7YdONja-W/exec';
const csvHistorialPublico = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1367748190&single=true&output=csv';

const sonidoConfirmacion = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_57497c6713.mp3');

document.addEventListener('DOMContentLoaded', () => {
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
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnEnviarComprobante = document.getElementById('btnEnviarComprobante');
  const btnCerrarPago = document.getElementById('btnCerrarPago');
  const inputComprobante = document.getElementById('inputComprobante');
  const mensajeComprobante = document.getElementById('mensajeComprobante');
  const estadoPago = document.getElementById('estadoPago');
  const btnGPS = document.getElementById('btnGPS');
  const pantallaGPS = document.getElementById('pantallaGPS');
  const btnVolverPerfilGPS = document.getElementById('btnVolverPerfilGPS');
  const pantallaEntrenador = document.getElementById('pantallaEntrenador');
  const btnVolverInicio = document.getElementById('btnVolverInicio');

  // Modo oscuro/claro desde localStorage
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

  // Degradado inicial: bienvenida -> gimnasio
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

  // Login Firebase con email y password (para demo, usamos DNI@trotadores.com y clave)
  btnLogin.addEventListener('click', () => {
    const dni = document.getElementById('dniInput').value.trim();
    const clave = document.getElementById('claveInput').value.trim();

    if (!dni || !clave) {
      alert('Por favor, completá DNI y clave.');
      return;
    }

    const emailFake = `${dni}@trotadores.com`; // email ficticio para Firebase auth

    auth.signInWithEmailAndPassword(emailFake, clave)
      .then(({ user }) => {
        cargarPerfilFirebase(user.uid);
      })
      .catch(() => alert('❌ DNI o clave incorrectos'));
  });

  // Cargar perfil desde Firestore usando uid
  function cargarPerfilFirebase(uid) {
    db.collection('atletas').doc(uid).get()
      .then(doc => {
        if (!doc.exists) {
          alert('Perfil no encontrado. Contactá con tu entrenador.');
          auth.signOut();
          return;
        }
        const atleta = doc.data();
        mostrarPerfil(atleta, uid);
      }).catch(() => alert('Error al cargar perfil.'));
  }

  // Mostrar perfil y actualizar UI
  function mostrarPerfil(atleta, uid) {
    gimnasio.classList.add('hidden');
    bienvenida.classList.add('hidden');
    perfil.classList.remove('hidden');
    perfil.style.opacity = 0;
    setTimeout(() => perfil.style.opacity = 1, 50);

    document.getElementById('nombreAtleta').textContent = atleta.nombre || 'Atleta';
    document.getElementById('fotoAtleta').src = atleta.fotoURL || 'https://via.placeholder.com/150?text=Sin+Foto';
    perfil.setAttribute('data-uid', uid);

    // Estado de pago (demo)
    estadoPago.textContent = atleta.pagoEstado || 'Pendiente de confirmación';

    // Guardar en localStorage sesión
    localStorage.setItem('sesionAtleta', uid);
  }

  // Cargar sesión activa
  const sesionActiva = localStorage.getItem('sesionAtleta');
  if (sesionActiva) {
    cargarPerfilFirebase(sesionActiva);
  }

  // Mostrar entrenamientos
  btnIrEntrenamientos.addEventListener('click', () => {
    const uid = perfil.getAttribute('data-uid');
    if (!uid) {
      alert('No hay sesión iniciada.');
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
        // Filtrar por uid (simulamos con dni parte antes @)
        const filas = data.filter(row => row[0] === uid);

        if (!filas.length) {
          contenedorEntrenamientos.innerHTML = '<p>No se encontraron entrenamientos.</p>';
          return;
        }

        let html = '';
        filas.forEach(fila => {
          const fecha = fila[1];
          const ejercicios = fila.slice(2).filter(e => e && e.trim() !== '');

          html += `<p><strong>Fecha:</strong> ${fecha}</p>`;
          html += '<ul style="list-style:none; padding-left:1rem;">';

          ejercicios.forEach(ejercicio => {
            const encoded = encodeURIComponent(ejercicio);
            html += 
              `<li style="margin-bottom:1rem;">
                <span>${ejercicio}</span>
                <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">🔍</a>
              </li>`;
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

  // Mostrar historial carreras
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

  function cargarHistorial() {
    const uid = perfil.getAttribute('data-uid');
    if (!uid) {
      alert('No hay sesión iniciada.');
      return;
    }

    Papa.parse(csvHistorialPublico, {
      download: true,
      header: true,
      complete: function(results) {
        const data = results.data.filter(item => item.DNI === uid);

        if (!data.length) {
          tablaCarreras.innerHTML = '<tr><td>No hay registros de carreras.</td></tr>';
          return;
        }

        let tablaHTML = `
          <thead>
            <tr>
              <th>Evento</th>
              <th>Distancia (km)</th>
              <th>Tiempo</th>
              <th>Ritmo (min/km)</th>
            </tr>
          </thead><tbody>`;

        data.forEach(row => {
          const ritmo = calcularRitmo(row.Tiempo, parseFloat(row.Distancia));
          tablaHTML += `
            <tr>
              <td>${row.Evento}</td>
              <td>${row.Distancia}</td>
              <td>${row.Tiempo}</td>
              <td>${ritmo}</td>
            </tr>`;
        });

        tablaHTML += '</tbody>';
        tablaCarreras.innerHTML = tablaHTML;
      },
      error: () => {
        tablaCarreras.innerHTML = '<tr><td>Error al cargar historial.</td></tr>';
      }
    });
  }

  function calcularRitmo(tiempoStr, distancia) {
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
    const uid = perfil.getAttribute('data-uid');

    if (!evento || isNaN(distancia) || !tiempo || !uid) {
      alert('Por favor, completá todos los campos correctamente.');
      return;
    }

    // Enviar datos a Google Apps Script para guardar (backend)
    fetch(urlWebAppHistorial, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({dni: uid, evento, distancia, tiempo})
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

  // Validar comprobante
  inputComprobante.addEventListener('change', () => {
    btnEnviarComprobante.disabled = inputComprobante.files.length === 0;
    mensajeComprobante.style.display = 'none';
  });

  btnEnviarComprobante.addEventListener('click', () => {
    if (inputComprobante.files.length === 0) {
      alert('Por favor, subí el comprobante de pago.');
      return;
    }

    btnEnviarComprobante.disabled = true;
    mensajeComprobante.style.color = 'black';
    mensajeComprobante.textContent = 'Enviando comprobante...';
    mensajeComprobante.style.display = 'block';

    // Simulación de subida
    setTimeout(() => {
      mensajeComprobante.style.color = 'green';
      mensajeComprobante.textContent = 'Recibimos tu comprobante, pronto se actualizará tu estado.';
      sonidoConfirmacion.play();
      estadoPago.textContent = 'Estado de pago: Comprobante recibido. Pendiente de revisión.';

      setTimeout(() => {
        modalPago.style.opacity = 0;
        setTimeout(() => modalPago.classList.add('hidden'), 300);
      }, 4000);
    }, 2000);
  });

  // --- GPS ---
  let map, marker, polyline, positions = [];

  btnGPS.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaGPS.classList.remove('hidden');
    pantallaGPS.style.opacity = 0;
    setTimeout(() => pantallaGPS.style.opacity = 1, 50);
    iniciarGPS();
  });

  btnVolverPerfilGPS.addEventListener('click', () => {
    if (map) {
      map.remove();
      map = null;
      positions = [];
    }
    pantallaGPS.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  function iniciarGPS() {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada en este navegador.');
      return;
    }

    positions = [];

    map = L.map('mapa').setView([0, 0], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);
    polyline = L.polyline([], {color: '#FFD600'}).addTo(map);

    navigator.geolocation.watchPosition(pos => {
      const latlng = [pos.coords.latitude, pos.coords.longitude];
      positions.push(latlng);
      marker.setLatLng(latlng);
      polyline.setLatLngs(positions);
      map.panTo(latlng);
    }, err => {
      alert('Error al obtener ubicación: ' + err.message);
    }, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    });
  }

  // --- Panel entrenador (UI básico) ---
  // Para demo simple: botón para mostrar pantalla entrenador
  // Luego se puede integrar login entrenador y lógica real

  // Botón hipotético para mostrar panel entrenador (no visible en index)
  // document.getElementById('btnEntrenador').addEventListener('click', () => {
  //   perfil.classList.add('hidden');
  //   pantallaEntrenador.classList.remove('hidden');
  // });

  btnVolverInicio.addEventListener('click', () => {
    pantallaEntrenador.classList.add('hidden');
    gimnasio.classList.remove('hidden');
  });

});


