// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
// import { getAnalytics } from "./firebase-9.9.2/firebase-analytics.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase-9.9.2/firebase-auth.js";
import { getDatabase, ref, child, get } from "./firebase-9.9.2/firebase-database.js";

// Inicializa configuracion de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQGRFacISlyqP8jORHOMbNZnbP_w_5FqE",
  authDomain: "ecommerce-jap-2022.firebaseapp.com",
  databaseURL: "https://ecommerce-jap-2022-default-rtdb.firebaseio.com",
  projectId: "ecommerce-jap-2022",
  storageBucket: "ecommerce-jap-2022.appspot.com",
  messagingSenderId: "896723081658",
  appId: "1:896723081658:web:1f50791b2b4a7a7ac12583",
  measurementId: "G-ZZS723TP0W"
};

// Inicializa Firebase (aplicacion y acceso a base de datos en tiempo real y login con Google)
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();

// Inicializa variables para los elementos del formulario
let nombreUsuario = undefined;
let contraUsuario = undefined;
let botonSesionInciada = undefined;

function validaCamposFormulario() {
  // Aquiere valores del formulario
  nombreUsuario = document.getElementById('nombre-usuario').value;
  contraUsuario = document.getElementById('contra-usuario').value;
  
  // Definen las constantes de expresion regular que deben cumplir los datos ingresados
  const usuarioRegEx = /^[a-zA-Z0-9]{5,}$/;

  // Si el nombre de usuario no cumple con la expresion regular, muestra un mensaje de error
  if (!usuarioRegEx.test(nombreUsuario)) {
    alert('El nombre de usuario debe ser de al menos 5 caracteres y solo puede contener caracteres alfanumericos');
    return false;
  }
  // Si la contraseña no cumple con la expresion regular, muestra un mensaje de error
  if (!contraUsuario) {
    alert('La contraseña no puede estar vacía');
    return false;
  }

  return true;
}

// Funcion para inicio de sesion desde base de datos de Firebase
function autenticarUsuario() {
  // Continua solo si los campos son validos
  if (!validaCamposFormulario()) {
    return;
  };

  const referenciaBD = ref(db);

  get(child(referenciaBD, "ListadoUsuarios/" + nombreUsuario)).then((intento) => {
    if (intento.exists()) {
      let contraEnBD = decifrarContra(intento.val().contra);
      if (contraEnBD == contraUsuario) {
        iniciarSesion(intento.val());
        window.location.href = "index.html";
      }
      else {
        alert("Contraseña incorrecta");
      }
    }
    else {
      alert("Usuario no registrado");
    }
  });
}

// Funcion para descifrar una contraseña utilizando AES
function decifrarContra(contraEnBD) {
  var contraDescifrada = CryptoJS.AES.decrypt(contraEnBD, contraUsuario);
  return contraDescifrada.toString(CryptoJS.enc.Utf8);
}

// Funcion para guardar en almacenamiento local o en almacenamiento de sesion el usuario logueado
function iniciarSesion(usuarioIniciado) {
  botonSesionInciada = document.getElementById('recuerdame');
  
  if (botonSesionInciada.checked) {
    localStorage.setItem('mantenersesioniniciada', true);
    localStorage.setItem('usuario', JSON.stringify(usuarioIniciado));
  }
  else {
    sessionStorage.setItem('usuario', JSON.stringify(usuarioIniciado));
  }
}

// Escucha de evento de click sobre el boton de login
document.addEventListener("DOMContentLoaded", function () {
  let usuarioActual = undefined;

  if (localStorage.getItem("mantenersesioniniciada")) {
      usuarioActual = JSON.parse(localStorage.getItem("usuario"));
  } else {
      usuarioActual = JSON.parse(sessionStorage.getItem("usuario"));
  }

  if (usuarioActual != undefined) {
    alert("Ya tiene una sesion iniciada de: " + usuarioActual.nombre_usuario);
    window.location.href = "index.html";
  }

  document.getElementById('iniciar-sesion').addEventListener('click', autenticarUsuario);
  
  // Inicio de sesion con Google
  document.getElementById('inicia-con-google').addEventListener('click', iniciarSesionGoogle);
  
  // Inicio de sesion con Github
  document.getElementById('inicia-con-github').addEventListener('click', iniciarSesionGithub);
});