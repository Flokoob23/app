// URL del Google Sheets CSV con los datos de atletas
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

let atletasData = []; // Aquí guardamos la data cargada

// Referencias a elementos del DOM
const pantallaBienvenida = document.getElementById('pantallaBienvenida');
const pantallaGimnasio = document.getElementById('pantallaGimnasio');
const pantallaPerfil = document.getElementById('pantallaPerfil');

const btnIniciarSesion = document.getElementById('btnIniciarSesion');
const formLogin = document.getElementById('formLogin');
const dniInput = document.getElementById('dniInput');
const claveInput = document.getElementById('claveInput');
const btnLogin = document.getElementById('btnLogin');

const fotoAtleta = document.getElementById('fotoAtleta');
const nombreAtleta = document.getElementById('nombreAtleta');

// Función para cargar datos del Google Sheets CSV usando PapaParse
function cargarDatos() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
      atletasData = results.data;
      // console.log('Datos cargados:', atletasData);
    },
    error: function(err) {
      alert('Error al cargar los datos de atletas');
      console.error(err);
    }
  });
}

// Ejecutamos la carga al iniciar
cargarDatos();

// Función para hacer un fade out suave y luego ejecutar callback
function fadeOut(element, callback) {
  element.style.transition = 'opacity 1.5s ease';
  element.style.opacity = 0;
  setTimeout(() => {
    element.classList.add('hidden');
    if (callback) callback();
  }, 1500);
}

// Función para hacer fade in suave
function fadeIn(element) {
  element.classList.remove('hidden');
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.transition = 'opacity 1.5s ease';
    element.style.opacity = 1;
  }, 50);
}

// Evento click en botón INICIAR SESIÓN
btnIniciarSesion.addEventListener('click', () => {
  btnIniciarSesion.style.display = 'none';  // Ocultar botón
  formLogin.classList.remove('hidden');     // Mostrar formulario
  dniInput.focus();                          // Poner foco en input DNI
});

// Evento click en botón Ingresar (login)
btnLogin.addEventListener('click', () => {
  const dni = dniInput.value.trim();
  const clave = claveInput.value.trim();

  if (!dni || !clave) {
    alert('Por favor completá DNI y clave');
    return;
  }

  // Buscar atleta con DNI y clave exactos (columnas: DNI y Clave)
  const atleta = atletasData.find(a => 
    a['DNI']?.trim() === dni && a['Clave']?.trim() === clave
  );

  if (atleta) {
    mostrarPerfil(atleta);
  } else {
    alert('DNI o clave incorrectos');
  }
});

// Función para mostrar pantalla de perfil y actualizar datos
function mostrarPerfil(atleta) {
  // Hacer fade out de pantallas iniciales y mostrar perfil con fade in
  fadeOut(pantallaBienvenida);
  fadeOut(pantallaGimnasio, () => {
    pantallaPerfil.classList.remove('hidden');
    pantallaPerfil.style.opacity = 0;
    setTimeout(() => {
      pantallaPerfil.style.transition = 'opacity 1s ease';
      pantallaPerfil.style.opacity = 1;
    }, 50);
  });

  // Actualizar foto y nombre en perfil
  fotoAtleta.src = atleta['Foto'] || 'https://i.imgur.com/FIFkYmg.png';
  fotoAtleta.alt = `Foto de ${atleta['Nombre'] || 'Atleta'}`;
  nombreAtleta.textContent = atleta['Nombre'] || 'Nombre Desconocido';
}
