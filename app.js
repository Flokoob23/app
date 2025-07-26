// Inicialización Firebase (debe estar en firebase-config.js y cargado antes)

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos
  const body = document.body;
  const bienvenida = document.getElementById('pantallaBienvenida');
  const gimnasio = document.getElementById('pantallaGimnasio');
  const perfil = document.getElementById('pantallaPerfil');
  const entrenador = document.getElementById('pantallaEntrenador');
  const btnIniciarSesion = document.getElementById('btnIniciarSesion');
  const formLogin = document.getElementById('formLogin');
  const btnLogin = document.getElementById('btnLogin');
  const btnEntrenamientos = document.getElementById('btnEntrenamientos');
  const pantallaEntrenamientos = document.getElementById('modalEntrenamientos');
  const listaEntrenamientos = document.getElementById('listaEntrenamientos');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const btnHistorial = document.getElementById('btnHistorial');
  const pantallaHistorial = document.getElementById('pantallaHistorial');
  const btnVolverPerfil2 = document.getElementById('btnVolverPerfil2');
  const formCarrera = document.getElementById('formCarrera');
  const tablaCarreras = document.getElementById('tablaCarreras');
  const estadoPago = document.getElementById('estadoPago');
  const toggleModo = document.getElementById('toggleModo');
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnEnviarComprobante = document.getElementById('btnEnviarComprobante');
  const btnCerrarPago = document.getElementById('btnCerrarPago');
  const inputComprobante = document.getElementById('inputComprobante');
  const mensajeComprobante = document.getElementById('mensajeComprobante');
  const btnGPS = document.getElementById('btnGPS');
  const pantallaGPS = document.getElementById('pantallaGPS');
  const btnVolverPerfilGPS = document.getElementById('btnVolverPerfilGPS');

  // Zona entrenador elementos
  const pantallaEntrenador = document.getElementById('pantallaEntrenador');
  const btnVolverInicio = document.getElementById('btnVolverInicio');

  // Botón entrenador creado si no existe (para acceder al panel)
  let btnEntrenador = document.getElementById('btnEntrenador');
  if (!btnEntrenador) {
    const botonesPerfil = document.querySelector('.botones-perfil');
    btnEntrenador = document.createElement('button');
    btnEntrenador.id = 'btnEntrenador';
    btnEntrenador.textContent = '👨‍🏫 Entrenador';
    btnEntrenador.style.backgroundColor = '#4CAF50';
    btnEntrenador.style.color = 'white';
    btnEntrenador.style.fontWeight = '700';
    btnEntrenador.style.border = 'none';
    btnEntrenador.style.borderRadius = '25px';
    btnEntrenador.style.padding = '0.9rem 0';
    btnEntrenador.style.cursor = 'pointer';
    btnEntrenador.style.flex = '1 1 150px';
    btnEntrenador.style.marginTop = '0.5rem';
    botonesPerfil.appendChild(btnEntrenador);
  }

  // Función para cambiar modo oscuro/claro
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

  // Cargar modo guardado
  const modoGuardado = localStorage.getItem('modo') || 'claro';
  setModo(modoGuardado);

  toggleModo.addEventListener('click', () => {
    const nuevoModo = body.classList.contains('dark-mode') ? 'claro' : 'oscuro';
    setModo(nuevoModo);
  });

  // Degradado inicial bienvenida -> gimnasio
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

  // Login con PapaParse (ejemplo con CSV remoto)
  const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

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

  // Mostrar perfil atleta
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

    estadoPago.textContent = 'Estado de pago: Pendiente de confirmación';
  }

  // Mostrar entrenamientos (simplificado)
  const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

  btnEntrenamientos.addEventListener('click', () => {
    const dni = perfil.getAttribute('data-dni');
    if (!dni) {
      alert('No se encontró DNI del atleta.');
      return;
    }

    perfil.classList.add('hidden');
    pantallaEntrenamientos.classList.remove('hidden');
    pantallaEntrenamientos.style.opacity = 0;
    setTimeout(() => pantallaEntrenamientos.style.opacity = 1, 50);

    listaEntrenamientos.innerHTML = 'Cargando entrenamientos...';

    Papa.parse(entrenamientosUrl, {
      download: true,
      header: false,
      complete: function(results) {
        const data = results.data;
        const filas = data.filter(row => row[0] === dni);

        if (!filas.length) {
          listaEntrenamientos.innerHTML = '<p>No se encontraron entrenamientos.</p>';
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
            html += `<li style="margin-bottom: 1rem;">
                      <span>${ejercicio}</span>
                      <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">
                        🔍
                      </a>
                    </li>`;
          });

          html += '</ul><hr/>';
        });

        listaEntrenamientos.innerHTML = html;
      },
      error: () => {
        listaEntrenamientos.innerHTML = '<p>Error al cargar entrenamientos.</p>';
      }
    });
  });

  btnCerrarModal.addEventListener('click', () => {
    pantallaEntrenamientos.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  // Mostrar historial carreras
  const csvHistorialPublico = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1367748190&single=true&output=csv';

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

        let tablaHTML = `<thead>
          <tr>
            <th>Evento</th>
            <th>Distancia (km)</th>
            <th>Tiempo</th>
            <th>Ritmo (min/km)</th>
          </tr>
        </thead><tbody>`;

        data.forEach(row => {
          const ritmo = calcularRitmo(row.Tiempo, parseFloat(row.Distancia));
          tablaHTML += `<tr>
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

    // Aquí enviaría a backend (Firebase o Apps Script)
    alert('Funcionalidad para guardar carrera no implementada en este código.');

    formCarrera.reset();
    cargarHistorial();
  });

  // Modal pago cuota
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

  inputComprobante.addEventListener('change', () => {
    btnEnviarComprobante.disabled = !(inputComprobante.files.length > 0);
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

    setTimeout(() => {
      mensajeComprobante.style.color = 'green';
      mensajeComprobante.textContent = 'Recibimos tu comprobante, en menos de 24hs se verá reflejado en la app.';

      estadoPago.textContent = 'Estado de pago: Comprobante recibido. Pendiente de confirmación administrativa.';

      setTimeout(() => {
        modalPago.style.opacity = 0;
        setTimeout(() => modalPago.classList.add('hidden'), 300);
      }, 4000);
    }, 2000);
  });

  // Zona GPS
  btnGPS.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaGPS.classList.remove('hidden');
    iniciarGPS();
  });

  btnVolverPerfilGPS.addEventListener('click', () => {
    pantallaGPS.classList.add('hidden');
    perfil.classList.remove('hidden');
    detenerGPS();
  });

  let mapa, marcador, polyline, recorrido = [];

  function iniciarGPS() {
    if (!mapa) {
      mapa = L.map('mapa').setView([0, 0], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapa);

      polyline = L.polyline([], {color: '#FFD600'}).addTo(mapa);
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        recorrido.push(latlng);
        polyline.setLatLngs(recorrido);
        if (!marcador) {
          marcador = L.marker(latlng).addTo(mapa);
          mapa.setView(latlng, 15);
        } else {
          marcador.setLatLng(latlng);
        }
      }, err => {
        alert('Error al obtener ubicación: ' + err.message);
      }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      });
    } else {
      alert('Geolocalización no soportada en tu navegador.');
    }
  }

  function detenerGPS() {
    // No se guarda la referencia del watchPosition, para limpiar usar:
    // navigator.geolocation.clearWatch(id); si se guarda el id
    // Por simplicidad, no se implementa ahora.
    recorrido = [];
    if (polyline) polyline.setLatLngs([]);
    if (marcador) mapa.removeLayer(marcador);
    marcador = null;
  }

  // Zona entrenador
  btnEntrenador.addEventListener('click', () => {
    perfil.classList.add('hidden');
    entrenador.classList.remove('hidden');
    cargarAlumnosEntrenador();
  });

  btnVolverInicio.addEventListener('click', () => {
    entrenador.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

  function cargarAlumnosEntrenador() {
    // Creamos contenedor para alumnos si no existe
    let listaAlumnosDiv = document.getElementById('listaAlumnos');
    if (!listaAlumnosDiv) {
      listaAlumnosDiv = document.createElement('div');
      listaAlumnosDiv.id = 'listaAlumnos';
      listaAlumnosDiv.style.padding = '1rem';
      listaAlumnosDiv.style.maxHeight = '60vh';
      listaAlumnosDiv.style.overflowY = 'auto';
      pantallaEntrenador.appendChild(listaAlumnosDiv);
    }
    listaAlumnosDiv.innerHTML = 'Cargando alumnos...';

    const db = firebase.firestore();

    db.collection('alumnos').get()
      .then(snapshot => {
        if (snapshot.empty) {
          listaAlumnosDiv.innerHTML = '<p>No hay alumnos registrados.</p>';
          return;
        }

        let html = '<ul style="list-style:none; padding:0;">';

        snapshot.forEach(doc => {
          const alumno = doc.data();
          html += `
            <li style="margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem;">
              <strong>Nombre:</strong> ${alumno.nombre || 'Sin nombre'}<br/>
              <strong>DNI:</strong> ${alumno.dni || 'No disponible'}<br/>
              <button class="btnVerDetalles" data-id="${doc.id}" style="
                margin-top: 0.3rem;
                background-color: #FFA500;
                border: none;
                color: black;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                cursor: pointer;
              ">Ver Detalles</button>
            </li>
          `;
        });

        html += '</ul>';
        listaAlumnosDiv.innerHTML = html;

        // Eventos botones detalles
        document.querySelectorAll('.btnVerDetalles').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idAlumno = e.target.dataset.id;
            mostrarDetallesAlumno(idAlumno);
          });
        });
      })
      .catch(err => {
        listaAlumnosDiv.innerHTML = `<p>Error al cargar alumnos: ${err.message}</p>`;
      });
  }

  function mostrarDetallesAlumno(id) {
    const db = firebase.firestore();
    db.collection('alumnos').doc(id).get()
      .then(doc => {
        if (!doc.exists) {
          alert('Alumno no encontrado');
          return;
        }
        const alumno = doc.data();
        alert(
          `Detalles de ${alumno.nombre || 'Sin nombre'}\n` +
          `DNI: ${alumno.dni || 'No disponible'}\n` +
          `Email: ${alumno.email || 'No disponible'}\n` +
          `Estado de pago: ${alumno.estadoPago || 'Desconocido'}`
        );
      })
      .catch(err => {
        alert('Error al obtener detalles: ' + err.message);
      });
  }
});

