const urlLogin = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';
const urlEntrenamientos = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=2117349227&single=true&output=csv';

let usuarioActual = null;

// Pantalla inicial
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('pantallaBienvenida').classList.add('hidden');
    document.getElementById('pantallaGimnasio').classList.remove('hidden');
  }, 2000);

  document.getElementById('btnIniciarSesion').addEventListener('click', () => {
    document.getElementById('btnIniciarSesion').classList.add('hidden');
    document.getElementById('formLogin').classList.remove('hidden');
  });

  document.getElementById('btnLogin').addEventListener('click', iniciarSesion);
});

function iniciarSesion() {
  const dni = document.getElementById('dniInput').value.trim();
  const clave = document.getElementById('claveInput').value.trim();

  Papa.parse(urlLogin, {
    download: true,
    header: true,
    complete: function (results) {
      const datos = results.data;
      const usuario = datos.find(row => row.DNI === dni && row.CLAVE === clave);
      if (usuario) {
        usuarioActual = usuario;
        mostrarPerfil(usuario);
      } else {
        alert('❌ DNI o clave incorrectos');
      }
    }
  });
}

function mostrarPerfil(usuario) {
  document.getElementById('pantallaGimnasio').classList.add('hidden');
  document.getElementById('pantallaPerfil').classList.remove('hidden');
  document.getElementById('nombreAtleta').textContent = usuario.NOMBRE;
  document.getElementById('fotoAtleta').src = usuario.FOTO || 'https://via.placeholder.com/100';

  const btnEntrenamientos = document.querySelector('.botones-perfil button:nth-child(1)');
  btnEntrenamientos.addEventListener('click', mostrarEntrenamientos);
}

function mostrarEntrenamientos() {
  if (!usuarioActual?.DNI) return alert("No se encontró DNI del atleta.");

  Papa.parse(urlEntrenamientos, {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;
      const registros = data.filter(row => row.DNI === usuarioActual.DNI);

      if (registros.length === 0) {
        alert("No hay entrenamientos registrados para este atleta.");
        return;
      }

      let contenido = '';
      registros.forEach(reg => {
        contenido += `<h3>📅 ${reg.FECHA}</h3><ul>`;
        Object.keys(reg).forEach(k => {
          if (k.startsWith("EJERCICIO") && reg[k]) {
            const ejercicio = reg[k];
            contenido += `<li><a href="https://www.google.com/search?q=ejercicio+${encodeURIComponent(ejercicio)}" target="_blank">${ejercicio}</a></li>`;
          }
        });
        contenido += '</ul>';
      });

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-entrenamientos">
          <h2>Entrenamientos de ${usuarioActual.NOMBRE}</h2>
          ${contenido}
          <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
      `;
      document.body.appendChild(modal);
    }
  });
}
