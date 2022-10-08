// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "./firebase-9.9.2/firebase-auth.js";

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

// Inicializa aplicacion Firebase
const app = initializeApp(firebaseConfig);

// Inicializa autenticacion mediante Firebase
const auth = getAuth();

// Inicializa variables para los elementos del formulario
let nombreRegistro = undefined;
let contraRegistroPrimera = undefined;
let contraRegistroSegunda = undefined;
let correoRegistro = undefined;

// Realiza validaciones del formulario de Registro
function validaCamposFormulario() {
  // Aquiere valores del formulario
  nombreRegistro = document.getElementById('nombre-registro').value;
  contraRegistroPrimera = document.getElementById('contra-registro-primera').value;
  contraRegistroSegunda = document.getElementById('contra-registro-segunda').value;
  correoRegistro = document.getElementById('correo-registro').value;

  // Definen las constantes de expresion regular que deben cumplir los datos ingresados
  const nombreRegEx = /^[a-zA-Z\s]+$/;
  const correoRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Si el nombre completo no cumple con la expresion regular, muestra un mensaje de error
  if (!nombreRegEx.test(nombreRegistro)) {
    alertaUsuario("Entrada incorrecta", "El nombre completo solo puede contener caracteres alfabeticos y espacios", "warning");
    return false;
  }
  // Si el correo electronico no cumple con la expresion regular, muestra un mensaje de error
  if (!correoRegEx.test(correoRegistro)) {
    alertaUsuario("Entrada incorrecta", "El correo electronico debe ser válido", "warning");
    return false;
  }
  // Verifica que las contraseñas coincidan y tengan la longitud minima exigida por Firebase
  if (contraRegistroPrimera !== contraRegistroSegunda || contraRegistroPrimera.length < 6) {
    alertaUsuario("Entrada incorrecta", "Las contraseñas no coinciden o tienen menos de 6 caracteres", "warning");
    return false
  }

  return true;
}

// Registra el usuario en la base de datos de Firebase
function registrarUsuario() {
  // Continua solo si los campos son validos
  if (!validaCamposFormulario()) {
    return;
  };
  
createUserWithEmailAndPassword(auth, correoRegistro, contraRegistroPrimera)
  .then((userCredential) => {
    // Automáticamente se inicia sesion con el usuario registrado
    const user = userCredential.user
    return user
  })
  .then((user) => {
    // Se agrega el nombre para mostrar elegido al perfil creado en Firebase
    updateProfile(user, {
      displayName: nombreRegistro,
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    // Imprime errores en la consola
    // Aunque no hacemos nada con esta info por ahora
    console.log(errorCode);
    console.log(errorMessage);

    // Informa al usuario del error
    // No se considera inseguro ya que la validacion misma ocurre en el cliente
    alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('registrarse').addEventListener('click', registrarUsuario);
});