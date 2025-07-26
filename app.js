// Firebase Initialization - configura firebase-config.js con tus datos
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Elementos DOM
const body = document.body;
const bienvenida = document.getElementById('pantallaBienvenida');
const gimnasio = document.getElementById('pantallaGimnasio');
const perfil = document.getElementById('pantallaPerfil');
const btnMostrarLogin = document.getElementById('btnMostrarLogin');
const formLogin = document.getElementById('formLogin');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const toggleModo = document.getElementById('toggleModo');

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const roleSelect = document.getElementById('roleSelect');

const nombreAtleta = document.getElementById('nombreAtleta');
const rolUsuario = document.getElementById('rolUsuario');
const fotoAtleta = document.getElementById('fotoAtleta');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

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

// Degradado inicial bienvenida a gimnasio
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
btnMostrarLogin.addEventListener('click', () => {
  btnMostrarLogin.style.display = 'none';
  formLogin.classList.remove('hidden');
});

// Función para mostrar perfil con datos usuario
function mostrarPerfil(userData) {
  gimnasio.classList.add('hidden');
  bienvenida.classList.add('hidden');
  perfil.classList.remove('hidden');
  perfil.style.opacity = 0;
  perfil.style.transition = 'opacity 1.2s ease';
  setTimeout(() => {
    perfil.style.opacity = 1;
  }, 50);

  nombreAtleta.textContent = userData.email;
  rolUsuario.textContent = 'Rol: ' + userData.role;
  fotoAtleta.src = userData.photoURL || 'https://via.placeholder.com/150?text=Sin+Foto';
}

// Login
btnLogin.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleSelect.value;

  if (!email || !password || !role) {
    alert('Por favor, completá todos los campos y seleccioná un rol.');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // Obtener rol desde Firestore
      return db.collection('users').doc(user.uid).get();
    })
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        mostrarPerfil({ email: auth.currentUser.email, role: userData.role, photoURL: userData.photoURL });
      } else {
        alert('No se encontró información del usuario.');
      }
    })
    .catch(err => {
      alert('Error al iniciar sesión: ' + err.message);
    });
});

// Registro
btnRegister.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleSelect.value;

  if (!email || !password || !role) {
    alert('Por favor, completá todos los campos y seleccioná un rol.');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // Guardar rol en Firestore
      return db.collection('users').doc(user.uid).set({
        email,
        role,
        photoURL: ''
      });
    })
    .then(() => {
      alert('Usuario registrado correctamente. Ahora podés iniciar sesión.');
      formLogin.reset();
      formLogin.classList.add('hidden');
      btnMostrarLogin.style.display = 'block';
    })
    .catch(err => {
      alert('Error al registrar usuario: ' + err.message);
    });
});

// Cerrar sesión
btnCerrarSesion.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      perfil.classList.add('hidden');
      gimnasio.classList.remove('hidden');
      formLogin.classList.add('hidden');
      btnMostrarLogin.style.display = 'block';
    })
    .catch(err => {
      alert('Error al cerrar sesión: ' + err.message);
    });
});

// Detectar estado de autenticación (mantener sesión abierta)
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          mostrarPerfil({ email: user.email, role: userData.role, photoURL: userData.photoURL });
        } else {
          alert('No se encontró información del usuario.');
          auth.signOut();
        }
      });
  } else {
    perfil.classList.add('hidden');
    gimnasio.classList.remove('hidden');
  }
});
