const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

const urlWebAppHistorial = 'https://script.google.com/macros/s/AKfycbwB58xj2evrz8VI4II9Q-SI64mexit0iFqjQhmzvUTbwfKHLbzt1ZwcGmJ7YdONja-W/exec';
const csvHistorialPublico = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1367748190&single=true&output=csv';

const csvPagosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1567006283&single=true&output=csv';

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

  // Modal pago cuota
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnConfirmarPago = document.getElementById('btnConfirmarPago');
  const btnCancelarPago = document.getElementById('btnCancelarPago');
  const modalTitulo = document.getElementById('modalPagoTitulo');
  const modalMensaje = document.getElementById('modalPagoMensaje');
  const inputAlias = document.getElementById('inputAlias');
  const inputMonto = document.getElementById('inputMonto');
  const inputComprobante = document.getElementById('inputComprobante');
  const mensajeComprobante = document.getElementById('mensajeComprobante');

  // Modo oscuro/claro guardado
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
          cargarEstadoPago(atleta.DNI);
        } else {
          alert('❌ DNI o clave incorrectos');
        }
      },
      error: function() {
        alert('Error al cargar los datos, intentá de nuevo.');
      }
    });
  });

  // Mostrar perfil
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

    // Limpiar estado pago
    document.getElementById('estadoPago').textContent = '';
  }

  // Cargar estado pago (de la hoja de pagos)
  async function cargarEstadoPago(dni) {
    try {
      const res = await fetch(csvPagosUrl);
      const csvText = await res.text();

      const resultados = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const filas = resultados.data;

      // Buscar pago del DNI
      const pago = filas.find(f => f.DNI === dni);

      const estadoPagoEl = document.getElementById('estadoPago');

      if (!pago) {
        estadoPagoEl.innerHTML = `<strong>Estado pago:</strong> <span style="color: #d35400;">No se registró ningún pago pendiente.</span>`;
        return;
      }

      // Columna D es confirmación, el CSV parseado es un objeto, tomamos la clave que corresponda
      // La columna D según el CSV podría tener el nombre "Confirmado" o similar, lo chequeamos:
      // Para seguridad, buscamos la clave con columna index 3
      // Pero como PapaParse parsea con header:true, usamos la propiedad que corresponde (buscamos exacto)

      // Para revisar: mostramos keys:
      // console.log(Object.keys(pago));

      // Vamos a iterar keys para encontrar el booleano en la posición 3
      const keys = Object.keys(pago);
      let claveConfirmacion = null;
      if (keys.length >= 4) claveConfirmacion = keys[3];

      const confirmadoRaw = claveConfirmacion ? pago[claveConfirmacion] : 'FALSE';
      const confirmado = confirmadoRaw.toString().toLowerCase() === 'true';

      if (confirmado) {
        estadoPagoEl.innerHTML = `<strong>Estado pago:</strong> <span style="color: green;">✅ Pago confirmado por el administrador.</span>`;
      } else {
        estadoPagoEl.innerHTML = `<strong>Estado pago:</strong> <span style="color: #d35400;">⏳ Pago pendiente de confirmación. Recibimos tu comprobante, en menos de 24hs se verá reflejado en la app.</span>`;
      }
    } catch (error) {
      console.error('Error cargando estado de pago:', error);
      document.getElementById('estadoPago').innerHTML = `<strong>Estado pago:</strong> <span style="color: red;">No se pudo obtener el estado de pago.</span>`;
    }
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
            html += 
              `<li style="margin-bottom: 1rem;">
                <span>${ejercicio}</span>
                <a href="https://www.google.com/search?q=${encoded}" target="_blank" title="Buscar en Google" style="margin-left: 10px;">
                  🔍
                </a>
              </li>`;
          });

          html += '</ul><hr style="border-color: #ccc;">';
        });

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
    cargarHistorial();
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.classList.add('hidden');
    perfil.classList.remove('hidden');
  });

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

  // Enviar nuevo historial carrera al Web App y actualizar tabla
  formCarrera.addEventListener('submit', async (e) => {
    e.preventDefault();

    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempo = document.getElementById('tiempoInput').value.trim();
    const dni = perfil.getAttribute('data-dni');

    if (!dni) {
      alert('❌ Debes iniciar sesión primero.');
      return;
    }
    if (!evento || !distancia || !tiempo) {
      alert('❌ Completa todos los campos.');
      return;
    }

    try {
      const respuesta = await fetch(urlWebAppHistorial, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, evento, distancia, tiempo })
      });

      const data = await respuesta.json();

      if (data.status === 'ok') {
        sonidoConfirmacion.play();
        alert('✅ Carrera registrada correctamente.');
        formCarrera.reset();
        cargarHistorial();
        mostrarNotificacion(`Carrera registrada`, `Evento: ${evento} - ${distancia} km - ${tiempo}`);
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      alert('❌ Error de conexión, revisá la URL del Web App y permisos.');
      console.error(error);
    }
  });

  // Función para cargar historial desde CSV y mostrar en tabla
  async function cargarHistorial() {
    tablaCarreras.innerHTML = '<p>Cargando historial...</p>';
    try {
      const res = await fetch(csvHistorialPublico);
      const csvText = await res.text();

      const resultados = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const filas = resultados.data;

      if (!filas.length) {
        tablaCarreras.innerHTML = '<p>No hay registros de carreras.</p>';
        return;
      }

      // Filtrar por DNI actual para mostrar solo sus registros
      const dniActual = perfil.getAttribute('data-dni');
      const filasFiltradas = filas.filter(f => f.DNI === dniActual);

      if (!filasFiltradas.length) {
        tablaCarreras.innerHTML = '<p>No hay registros para este atleta.</p>';
        return;
      }

      // Construir tabla
      let html = 
        `<table class="tabla-historial" style="width:100%; border-collapse: collapse; text-align:left;">
          <thead>
            <tr style="background:#FFA500; color:black;">
              <th style="padding: 8px; border:1px solid #ddd;">Evento</th>
              <th style="padding: 8px; border:1px solid #ddd;">Distancia (km)</th>
              <th style="padding: 8px; border:1px solid #ddd;">Tiempo</th>
              <th style="padding: 8px; border:1px solid #ddd;">Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
      `;

      filasFiltradas.forEach(fila => {
        html += 
          `<tr>
            <td style="padding: 8px; border:1px solid #ddd;">${fila.Evento}</td>
            <td style="padding: 8px; border:1px solid #ddd;">${fila.Distancia}</td>
            <td style="padding: 8px; border:1px solid #ddd;">${fila.Tiempo}</td>
            <td style="padding: 8px; border:1px solid #ddd;">${fila.FechaRegistro}</td>
          </tr>`;
      });

      html += '</tbody></table>';

      tablaCarreras.innerHTML = html;
    } catch (error) {
      tablaCarreras.innerHTML = '<p>Error al cargar historial.</p>';
      console.error(error);
    }
  }

  // Modal pago de cuota: Abrir y cerrar
  btnPagoCuota.addEventListener('click', () => {
    modalPago.classList.remove('hidden');
    mensajeComprobante.textContent = '';
    inputComprobante.value = '';
  });

  btnCancelarPago.addEventListener('click', () => {
    modalPago.classList.add('hidden');
    mensajeComprobante.textContent = '';
    inputComprobante.value = '';
  });

  // Confirmar pago y cargar comprobante
  btnConfirmarPago.addEventListener('click', () => {
    const alias = inputAlias.value.trim();
    const monto = inputMonto.value.trim();
    const file = inputComprobante.files[0];
    const dni = perfil.getAttribute('data-dni');

    if (!file) {
      mensajeComprobante.textContent = '❌ Por favor, cargá una imagen como comprobante.';
      mensajeComprobante.style.color = 'red';
      return;
    }

    // Leer archivo imagen y enviar datos a servidor (simulación)
    const reader = new FileReader();
    reader.onload = function(e) {
      const imagenBase64 = e.target.result;

      // Aquí enviaríamos la info a un backend o Google Apps Script para guardar el pago y comprobante

      // Simulamos con alerta y cierre modal
      alert('✅ Comprobante recibido. En menos de 24hs se verá reflejado en la app.');

      // Guardamos localmente si querés (puedes cambiar por llamada fetch a backend real)
      console.log('Alias:', alias, 'Monto:', monto, 'Comprobante (base64):', imagenBase64.substring(0,50) + '...');

      modalPago.classList.add('hidden');
      mensajeComprobante.textContent = '';
      inputComprobante.value = '';

      // Recargar estado de pago
      cargarEstadoPago(dni);
    };

    reader.readAsDataURL(file);
  });

  // Notificación simple en pantalla
  function mostrarNotificacion(titulo, texto) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(titulo, { body: texto });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(titulo, { body: texto });
        }
      });
    }
  }
});

