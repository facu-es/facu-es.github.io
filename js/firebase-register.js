// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "./firebase-9.9.2/firebase-auth.js";
import { getDatabase, set, ref, child, get } from "./firebase-9.9.2/firebase-database.js";

// Nueva implementacion del registro mediante Firebase
// https://firebase.google.com/docs/auth/web/password-auth

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

// Inicializa acceso a base de datos en tiempo real
const db = getDatabase();

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
    alert('El nombre completo solo puede contener caracteres alfabeticos y espacios');
    return false;
  }
  // Si el correo electronico no cumple con la expresion regular, muestra un mensaje de error
  if (!correoRegEx.test(correoRegistro)) {
    alert('El correo electronico debe ser válido');
    return false;
  }
  // Verifica que las contraseñas coincidan y tengan la longitud minima exigida por Firebase
  if (contraRegistroPrimera !== contraRegistroSegunda) {
    alert('Las contraseñas no coinciden');
    return false
  } else {
    if(contraRegistroPrimera.length < 6) {
      alert('La contraseña deben tener por lo menos 6 caracteres');
      return false
    }
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
    // Signed in
    const user = userCredential.user;
    return user
  })
  // Inicia sesion con el usuario registrado
  .then((usuario) => {
    console.log(usuario);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

            // Imprime errores en la consola
            // Aunque no hacemos nada con esta info por ahora
            console.log(errorCode);
            console.log(errorMessage);
  });
}

// TODO: Pendiente complementar la informacion del usuario
// Mediante el guardado de datos en la la Base de Datos en Tiempo Real
//
//  // Busca un elemento con el nombre de usuario ingresado, si existe alerta al usuario y no registra
//  get(child(referenciaBD, "ListadoUsuarios/" + nombreUsuarioRegistro)).then((intento) => {
//    if (intento.exists()) {
//      alert('El nombre de usuario ya existe intente con otro');
//    }
//    // Crea el usuario en la base de datos
//    else {
//      set(ref(db, "ListadoUsuarios/" + nombreUsuarioRegistro),
//        {
//          nombre_completo: nombreRegistro,
//          correo: correoRegistro,
//          nombre_usuario: nombreUsuarioRegistro,
//          contra: cifrarContra()
//        })
//        // Inicia sesion con el usuario registrado
//        .then(() => {
//          alert('Usuario registrado correctamente');
//          iniciarSesion({
//            nombre_completo: nombreRegistro,
//            correo: correoRegistro,
//            nombre_usuario: nombreUsuarioRegistro,
//            contra: cifrarContra()
//          });
//        })
//        // En caso de error alerta al usuario con el codigo de error
//        .catch((error) => {
//          alert(error.message);
//        })
//    }
//  });

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('registrarse').addEventListener('click', registrarUsuario);
});