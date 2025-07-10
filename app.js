const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGOmPSHY2_9u9bNQ3fO2n_wS5DHVDGo0T6Pkt1u15xUwwXLX5-Ukg3iTC7AWYHTiba0YiteOSJdKHZ/pub?gid=0&single=true&output=csv';

let atletasData = [];

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

// Cargar los datos desde Google Sheets
function cargarDatos() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
      atletasData = results.data;
    },
    error: function(err) {
      alert('Error al cargar datos');
      console.error(err);
    }
  });
}
cargarDatos();

// Transiciones suaves
function fadeIn(element) {
  element.classList.remove('hidden');
}

function fadeOut(element, callback) {
  element.classList.add('hidden');
  setTimeout(() => {
    if (callback) callback();
  }, 1500);
}

// Mostrar login
btnIniciarSesion.addEventListener('click', () => {
  btnIniciarSesion.style.display = 'none';
  formLogin.classList.remove('hidden');
  dniInput.focus();
});

// Validación de usuario
btnLogin.addEventListener('click', () => {
  const dni = dniInput.value.trim();
  const clave = claveInput.value.trim();

  if (!dni || !clave) {
    alert('Por favor completá DNI y clave');
    return;
  }

  const atleta = atletasData.find(a =>
    a['DNI']?.trim() === dni && a['Clave']?.trim() === clave
  );

  if (atleta) {
    mostrarPerfil(atleta);
  } else {
    alert('DNI o clave incorrectos');
  }
});

function mostrarPerfil(atleta) {
  fadeOut(pantallaBienvenida);
  fadeOut(pantallaGimnasio, () => {
    fadeIn(pantallaPerfil);
  });

  fotoAtleta.src = atleta['Foto'] || 'https://i.imgur.com/FIFkYmg.png';
  fotoAtleta.alt = `Foto de ${atleta['Nombre'] || 'Atleta'}`;
  nombreAtleta.textContent = atleta['Nombre'] || 'Nombre Desconocido';
}
