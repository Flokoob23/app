const accesoUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const entrenamientosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

const urlWebAppHistorial = 'https://script.google.com/macros/s/AKfycbwB58xj2evrz8VI4II9Q-SI64mexit0iFqjQhmzvUTbwfKHLbzt1ZwcGmJ7YdONja-W/exec';
const csvHistorialPublico = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1367748190&single=true&output=csv';

const pagosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=1567006283&single=true&output=csv';

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
  const estadoPago = document.getElementById('estadoPago');

  // Modal pago cuota
  const btnPagoCuota = document.getElementById('btnPagoCuota');
  const modalPago = document.getElementById('modalPago');
  const btnConfirmarPago = document.getElementById('btnConfirmarPago');
  const btnCancelarPago = document.getElementById('btnCancelarPago');
  const comprobanteInput = document.getElementById('comprobanteInput');
  const mensajeComprobante = document.getElementById('mensajeComprobante');
  const aliasPago = document.getElementById('aliasPago');

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
      body.classList.remove('modo-claro');
      toggleModo.textContent = '🌞 Claro';
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('modo-claro');
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
          chequearPago(atleta.DNI);
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

  // Chequear pago confirmado en la hoja de pagos
  async function chequearPago(dni) {
    estadoPago.textContent = 'Cargando estado de pago...';
    estadoPago.classList.remove('confirmado', 'no-confirmado');
    try {
      const res = await fetch(pagosUrl);
      const csvText = await res.text();
      const resultados = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const filas = resultados.data;

      const filaPago = filas.find(f => f.DNI === dni);
      if (filaPago) {
        const confirmado = filaPago['D'] === 'TRUE' || filaPago['D'] === 'true' || filaPago['D'] === 'VERDADERO' || filaPago['D'] === 'verdadero';
        if (confirmado) {
          estadoPago.textContent = '✅ Pago confirmado por el administrador.';
          estadoPago.classList.add('confirmado');
        } else {
          estadoPago.textContent = '❌ Pago pendiente de confirmación.';
          estadoPago.classList.add('no-confirmado');
        }
      } else {
        estadoPago.textContent = '❌ No se encontró registro de pago.';
        estadoPago.classList.add('no-confirmado');
      }
    } catch (error) {
      estadoPago.textContent = '❌ Error al cargar estado de pago.';
      estadoPago.classList.add('no-confirmado');
      console.error(error);
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
                <button style="background: #FFA500; color: black; border: none; border-radius: 20px; padding: 0.5rem 1rem; cursor: pointer;" 
                  onclick="window.open('https://www.google.com/search?q=${encoded}', '_blank')">${ejercicio}</button>
              </li>`;
          });

          html += '</ul><hr style="border: 1px solid #FFA500; margin-bottom: 1rem;">';
        });

        contenedorEntrenamientos.innerHTML = html;
      },
      error: function() {
        contenedorEntrenamientos.innerHTML = '<p>Error al cargar entrenamientos.</p>';
      }
    });
  });

  btnVolverPerfil.addEventListener('click', () => {
    pantallaEntrenamientos.style.opacity = 0;
    setTimeout(() => {
      pantallaEntrenamientos.classList.add('hidden');
      perfil.classList.remove('hidden');
      perfil.style.opacity = 1;
    }, 500);
  });

  // Historial carreras
  btnHistorial.addEventListener('click', () => {
    perfil.classList.add('hidden');
    pantallaHistorial.classList.remove('hidden');
    pantallaHistorial.style.opacity = 0;
    setTimeout(() => pantallaHistorial.style.opacity = 1, 50);
    cargarHistorial();
  });

  btnVolverPerfil2.addEventListener('click', () => {
    pantallaHistorial.style.opacity = 0;
    setTimeout(() => {
      pantallaHistorial.classList.add('hidden');
      perfil.classList.remove('hidden');
      perfil.style.opacity = 1;
    }, 500);
  });

  formCarrera.addEventListener('submit', async () => {
    const dni = perfil.getAttribute('data-dni');
    const evento = document.getElementById('eventoInput').value.trim();
    const distancia = parseFloat(document.getElementById('distanciaInput').value);
    const tiempo = document.getElementById('tiempoInput').value.trim();

    if (!evento || !distancia || !tiempo) {
      alert('Por favor, completá todos los campos.');
      return;
    }

    if (!validarTiempo(tiempo)) {
      alert('El tiempo debe tener formato 00:00:00');
      return;
    }

    const ritmo = calcularRitmo(distancia, tiempo);

    // Guardar por WebApp Apps Script
    const url = urlWebAppHistorial + `?dni=${dni}&evento=${encodeURIComponent(evento)}&distancia=${distancia}&tiempo=${tiempo}&ritmo=${ritmo}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        alert('Carrera registrada correctamente');
        cargarHistorial();
        formCarrera.reset();
      } else {
        alert('Error al registrar carrera');
      }
    } catch {
      alert('Error al registrar carrera');
    }
  });

  function validarTiempo(t) {
    return /^\d{2}:\d{2}:\d{2}$/.test(t);
  }

  function calcularRitmo(dist, tiempo) {
    const partes = tiempo.split(':').map(Number);
    const totalSeg = partes[0] * 3600 + partes[1] * 60 + partes[2];
    const ritmoSeg = totalSeg / dist;
    const min = Math.floor(ritmoSeg / 60);
    const seg = Math.round(ritmoSeg % 60);
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }

  async function cargarHistorial() {
    const dni = perfil.getAttribute('data-dni');
    tablaCarreras.innerHTML = 'Cargando historial...';
    try {
      const res = await fetch(csvHistorialPublico);
      const csvText = await res.text();
      const datos = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const filas = datos.data.filter(fila => fila.DNI === dni);

      if (filas.length === 0) {
        tablaCarreras.innerHTML = '<p>No hay carreras registradas.</p>';
        return;
      }

      let tablaHTML = `<table class="tabla-historial"><thead><tr><th>Evento</th><th>Distancia (km)</th><th>Tiempo</th><th>Ritmo (min/km)</th></tr></thead><tbody>`;
      filas.forEach(fila => {
        tablaHTML += `<tr>
          <td>${fila.Evento}</td>
          <td>${fila.Distancia}</td>
          <td>${fila.Tiempo}</td>
          <td>${fila.Ritmo}</td>
        </tr>`;
      });
      tablaHTML += '</tbody></table>';
      tablaCarreras.innerHTML = tablaHTML;
    } catch (error) {
      tablaCarreras.innerHTML = '<p>Error al cargar historial.</p>';
      console.error(error);
    }
  }

  // Modal Pago de Cuota
  btnPagoCuota.addEventListener('click', () => {
    modalPago.classList.remove('hidden');
    modalPago.style.opacity = 0;
    setTimeout(() => modalPago.style.opacity = 1, 50);
    mensajeComprobante.textContent = '';
    btnConfirmarPago.disabled = true;
    comprobanteInput.value = '';
  });

  btnCancelarPago.addEventListener('click', () => {
    modalPago.style.opacity = 0;
    setTimeout(() => modalPago.classList.add('hidden'), 300);
  });

  comprobanteInput.addEventListener('change', () => {
    if (comprobanteInput.files.length > 0) {
      mensajeComprobante.textContent = `Archivo listo: ${comprobanteInput.files[0].name}`;
      btnConfirmarPago.disabled = false;
    } else {
      mensajeComprobante.textContent = '';
      btnConfirmarPago.disabled = true;
    }
  });

  btnConfirmarPago.addEventListener('click', async () => {
    if (comprobanteInput.files.length === 0) {
      alert('Por favor, subí un comprobante.');
      return;
    }

    const dni = perfil.getAttribute('data-dni');
    const archivo = comprobanteInput.files[0];
    btnConfirmarPago.disabled = true;
    btnConfirmarPago.textContent = 'Enviando...';

    // Convertir archivo a base64 para enviar (simplificado)
    const base64File = await fileToBase64(archivo);

    // Aquí deberías implementar envío al backend o Google Apps Script para guardar el comprobante
    // Por ejemplo, un POST a un WebApp que guarde el archivo y registre el pago en la hoja

    // Simulamos delay y mensaje
    setTimeout(() => {
      alert('Recibimos tu comprobante, en menos de 24hs se verá reflejado en la app.');
      btnConfirmarPago.textContent = 'Enviar comprobante';
      modalPago.style.opacity = 0;
      setTimeout(() => modalPago.classList.add('hidden'), 300);
      estadoPago.textContent = '❌ Pago pendiente de confirmación.';
      estadoPago.classList.remove('confirmado');
      estadoPago.classList.add('no-confirmado');
      sonidoConfirmacion.play();
    }, 1500);
  });

  // Convertir archivo a base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
});

