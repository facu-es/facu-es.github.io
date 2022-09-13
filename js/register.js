// Importa scripts de Firebase
import { initializeApp } from "./js/firebase-9.9.2/firebase-app.js";
// import { getAnalytics } from "./js/firebase-9.9.2/firebase-analytics.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./js/firebase-9.9.2/firebase-auth.js";
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

// Inicializa Firebase (aplicacion y acceso a base de datos en tiempo real)
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();

// Guarda los elementos del formulario
const nombreRegistro = document.getElementById('nombre-registro');
const contraRegistro = document.getElementById('contra-registro');
const nombreUsuarioRegistro = document.getElementById('usuario-registro');
const correoRegistro = document.getElementById('correo-registro');
const botonRegistrar = document.getElementById('registrarse');

// Realiza validaciones del formulario de Registro
function validaCamposFormulario() {
  // Definen las constantes de expresion regular que deben cumplir los datos ingresados
  const nombreRegEx = /^[a-zA-Z\s]+$/;
  const correoRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const usuarioRegEx = /^[a-zA-Z0-9]{5,}$/;

  // Si el nombre completo no cumple con la expresion regular, muestra un mensaje de error
  if (!nombreRegEx.test(nombreRegistro.value)) {
    alert('El nombre completo solo puede contener caracteres alfabeticos y espacios');
    return false;
  }
  // Si el correo electronico no cumple con la expresion regular, muestra un mensaje de error
  if (!correoRegEx.test(correoRegistro.value)) {
    alert('El correo electronico debe ser válido');
    return false;
  }
  // Si el nombre de usuario no cumple con la expresion regular, muestra un mensaje de error
  if (!usuarioRegEx.test(nombreUsuarioRegistro.value)) {
    alert('El nombre de usuario debe ser de al menos 5 caracteres y solo puede contener caracteres alfanumericos');
    return false;
  }
  return true;
}

// Funcion de inicio de sesion
function iniciarSesion(usuario) {
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
  window.location.href = 'index.html';
}

// Cifra la contraseña con el algoritmo de cifrado AES
function cifrarContra() {
  const cifrada = CryptoJS.AES.encrypt(contraRegistro.value, contraRegistro.value);
  return cifrada.toString();
}

// Registra el usuario en la base de datos de Firebase
function registrarUsuario() {
  // Continua solo si los campos son validos
  if (!validaCamposFormulario()) {
    return;
  };
  // 
  const referenciaBD = ref(db);

  // Busca un elemento con el nombre de usuario ingresado, si existe alerta al usuario y no registra
  get(child(referenciaBD, "ListadoUsuarios/" + nombreUsuarioRegistro.value)).then((intento) => {
    if (intento.exists()) {
      alert('El nombre de usuario ya existe intente con otro');
    }
    // Crea el usuario en la base de datos
    else {
      set(ref(db, "ListadoUsuarios/" + nombreUsuarioRegistro.value),
        {
          nombre_completo: nombreRegistro.value,
          correo: correoRegistro.value,
          nombre_usuario: nombreUsuarioRegistro.value,
          contra: cifrarContra()
        })
        // Inicia sesion con el usuario registrado
        .then(() => {
          alert('Usuario registrado correctamente');
          iniciarSesion({
            nombre_completo: nombreRegistro.value,
            correo: correoRegistro.value,
            nombre_usuario: nombreUsuarioRegistro.value,
            contra: cifrarContra()
          });
        })
        // En caso de error alerta al usuario con el codigo de error
        .catch((error) => {
          alert(error.message);
        })
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  botonRegistrar.addEventListener('click', registrarUsuario);
});