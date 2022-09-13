// Importa scripts de Firebase
import { initializeApp } from "./js/firebase-9.9.2/firebase-app.js";
// import { getAnalytics } from "./js/firebase-9.9.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./js/firebase-9.9.2/firebase-auth.js";
import { getDatabase, set, ref, child, get, update, remove } from "./js/firebase-9.9.2/firebase-database.js";

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

// Guarda los elementos del formulario
const nombreUsuario = document.getElementById('nombre-usuario');
const contraUsuario = document.getElementById('contra-usuario');
const botonSesionInciada = document.getElementById('flexSwitchCheckDefault');
const botonIniciarSesion = document.getElementById('iniciar-sesion');
const botonIniciaConGoogle = document.getElementById('inicia-con-google');

function validaCamposFormulario() {
  // Definen las constantes de expresion regular que deben cumplir los datos ingresados
  const usuarioRegEx = /^[a-zA-Z0-9]{5,}$/;

  // Si el nombre de usuario no cumple con la expresion regular, muestra un mensaje de error
  if (!usuarioRegEx.test(nombreUsuario.value)) {
    alert('El nombre de usuario debe ser de al menos 5 caracteres y solo puede contener caracteres alfanumericos');
    return false;
  }
  // Si la contraseña no cumple con la expresion regular, muestra un mensaje de error
  if (!contraUsuario.value) {
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

  get(child(referenciaBD, "ListadoUsuarios/" + nombreUsuario.value)).then((intento) => {
    if (intento.exists()) {
      let contraEnBD = decifrarContra(intento.val().contra);
      if (contraEnBD == contraUsuario.value) {
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
  var contraDescifrada = CryptoJS.AES.decrypt(contraEnBD, contraUsuario.value);
  return contraDescifrada.toString(CryptoJS.enc.Utf8);
}

// Funcion para guardar en almacenamiento local o en almacenamiento de sesion el usuario logueado
function iniciarSesion(usuarioIniciado) {
  if (!botonSesionInciada.checked) {
    sessionStorage.setItem('usuario', JSON.stringify(usuarioIniciado));
  }
  else {
    localStorage.setItem('mantenersesioniniciada', true);
    localStorage.setItem('usuario', JSON.stringify(usuarioIniciado));
  }
}

// Escucha de evento de click sobre el boton de login
document.addEventListener("DOMContentLoaded", function () {
  botonIniciarSesion.addEventListener('click', autenticarUsuario);
});