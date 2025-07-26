// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyB59Tq2XFfyg-CbfBNbMqqxpFuBZslmiwI",
  authDomain: "sample-firebase-ai-app-d8fa8.firebaseapp.com",
  projectId: "sample-firebase-ai-app-d8fa8",
  storageBucket: "sample-firebase-ai-app-d8fa8.firebasestorage.app",
  messagingSenderId: "350154894182",
  appId: "1:350154894182:web:6a8782c44c7fa391c5f6a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// URLs CSV públicos
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';
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
  const btnGPS = document.getElementById('btnGPS');
  const pantallaGPS = document.getElementById('pantallaGPS');
  const mapaContenedor = document.getElementById('mapa');
  const btnVolverPerfilGPS = document.getElementById('btnVolverPerfilGPS');
  const toggleModo = document.getElementById('toggleModo');

  // Modal pago cuota
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnEnviarComprobante = document.getElementById('btnEnviarComprobante');
  const btnCerrarPago = document.getElementById('btnCerrarPago');
  const inputComprobante = document.getElementById('inputComprobante');
  const mensajeComprobante = document.getElementById('mensajeComprobante');
  const estadoPago = document.getElementById('estadoPago');

  // Zona entrenador
  const pantallaEntrenador = document.getElementById('pantallaEntrenador');
  const btnVolverInicio = document.getElementById('btnVolverInicio');

  // ---------------- MODO OSCURO ----------------
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

  // ---------------- BIENVENIDA -> GIMNASIO ----------------
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

  // ---------------- LOGIN ----------------
  btnIniciarSesion.addEventListener('click', () => {
    btnIniciarSesion.style.display = 'none';
    formLogin.classList.remove('hidden');
  });

  btnLogin.addEventListener('click', () => {
    const dni = document.getElementById('dniInput').value.trim();
    const clave = document.getElementById('claveInput').value.trim();

    if (dni === 'admin' && clave === 'admin123') {
      mostrarEntrenador();
      return;
    }

    db.collection('usuarios').where('DNI', '==', dni).where('Clave', '==', clave)
      .get().then(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const atleta = doc.data();
          atleta.id = doc.id;
          mostrarPerfil(atleta);
        } else {
          alert('DNI o clave incorrectos');
        }
      }).catch(error => {
        console.error(error);
        alert('Error al verificar credenciales');
      });
  });

  function mostrarPerfil(atleta) {
    gimnasio.classList.add('hidden');
    perfil.classList.remove('hidden');
    document.getElementById('nombreAtleta').textContent = atleta.Nombre;
    document.getElementById('fotoAtleta').src = atleta.Foto || 'https://via.placeholder.com/150?text=Sin+Foto';
    perfil.setAttribute('data-dni', atleta.DNI);
    estadoPago.textContent = 'Estado de pago: Pendiente de confirmación';
  }

  function mostrarEntrenador() {
    gimnasio.classList.add('hidden');
    pantallaEntrenador.classList.remove('hidden');
  }

  btnVolverInicio.addEventListener('click', () => {
    pantallaEntrenador.classList.add('hidden');
    gimnasio.classList.remove('hidden');
  });

  // ---------------- ENTRENAMIENTOS ----------------
  btnIrEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) return;

    perfil.classList.add('hidden');
    pantallaEntrenamientos.classList.remove('hidden');
    contenedorEntrenamientos.innerHTML = 'Cargando entrenamientos...';

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: function (results) {
        const data = results.data.filter(row => row[0] === dni);
        let html = '';

        data.forEach(row => {
          const fecha = row[1];
          const ejercicios = row.slice(2).filter(Boolean);
          html += `<p><strong>Fecha:</strong> ${fecha}</p><ul>`;
          ejercicios.forEach(ej => {
            const query = encodeURIComponent(ej);
            html += `<li>${ej} <a href="https://www.google.com/search?q=${query}" target="_blank">🔍</a></li>`;
          });
          html += '</ul><hr>';
        });

        contenedorEntrenamientos.innerHTML = html || '<p>No se encontraron entrenamientos.</p>';
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

  // ---------------- HISTORIAL ----------------
  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
    cargarHistorial();
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  formCarrera.addEventListener('submit', e => {
    e.preventDefault();
    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value.trim());
    const tiempo = document.getElementById('tiempoInput').value.trim();
    const dni = perfil.getAttribute('data-dni');
    if (!evento || !distancia || !tiempo || !dni) return alert('Completá todos los campos.');

    db.collection('historial').add({ dni, evento, distancia, tiempo })
      .then(() => {
        alert('Carrera agregada');
        formCarrera.reset();
        cargarHistorial();
      }).catch(() => alert('Error al guardar carrera.'));
  });

  function cargarHistorial() {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) return;

    db.collection('historial').where('dni', '==', dni)
      .get().then(snapshot => {
        if (snapshot.empty) {
          tablaCarreras.innerHTML = '<tr><td>No hay datos</td></tr>';
          return;
        }

        let html = `
          <thead>
            <tr><th>Evento</th><th>Distancia</th><th>Tiempo</th><th>Ritmo</th></tr>
          </thead><tbody>`;

        snapshot.forEach(doc => {
          const { evento, distancia, tiempo } = doc.data();
          const ritmo = calcularRitmo(tiempo, distancia);
          html += `<tr><td>${evento}</td><td>${distancia}</td><td>${tiempo}</td><td>${ritmo}</td></tr>`;
        });

        html += '</tbody>';
        tablaCarreras.innerHTML = html;
      });
  }

  function calcularRitmo(tiempoStr, distancia) {
    const [h, m, s] = tiempoStr.split(':').map(Number);
    const segundosTotales = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
    const ritmo = segundosTotales / distancia;
    return `${Math.floor(ritmo / 60)}:${Math.round(ritmo % 60).toString().padStart(2, '0')}`;
  }

  // ---------------- GPS MAPA ----------------
  let map, recorrido = [];

  btnGPS.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaGPS.classList.remove('hidden');

    if (!map) {
      map = L.map('mapa').setView([-34.6, -58.4], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        const { latitude, longitude } = pos.coords;
        const nueva = [latitude, longitude];
        recorrido.push(nueva);
        L.marker(nueva).addTo(map);
        if (recorrido.length > 1) {
          L.polyline(recorrido, { color: 'blue' }).addTo(map);
        }
        map.setView(nueva, 15);
      });
    } else {
      alert('GPS no soportado');
    }
  });

  btnVolverPerfilGPS.addEventListener('click', () => {
    pantallaGPS.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // ---------------- PAGO CUOTA ----------------
  btnPagoCuota.addEventListener('click', () => {
    modalPago.classList.remove('hidden');
    mensajeComprobante.style.display = 'none';
    btnEnviarComprobante.disabled = true;
    inputComprobante.value = '';
  });

  btnCerrarPago.addEventListener('click', () => {
    modalPago.classList.add('hidden');
  });

  inputComprobante.addEventListener('change', () => {
    btnEnviarComprobante.disabled = !inputComprobante.files.length;
  });

  btnEnviarComprobante.addEventListener('click', () => {
    mensajeComprobante.textContent = 'Enviando...';
    mensajeComprobante.style.display = 'block';
    sonidoConfirmacion.play();

    setTimeout(() => {
      mensajeComprobante.textContent = '¡Comprobante enviado!';
      estadoPago.textContent = 'Comprobante enviado. Pendiente de confirmación.';
      setTimeout(() => modalPago.classList.add('hidden'), 3000);
    }, 2000);
  });
});
