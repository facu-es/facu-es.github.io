// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, signOut } from "./firebase-9.9.2/firebase-auth.js";

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

// Destruye el estado de autenticacion en Firebase
function cerrarSesion() {
    signOut(auth).then(() => {
        // Si se completa el cierre de sesion de Firebase se eliminan las claves en el almacenamiento local
        sessionStorage.removeItem('usuario');
        localStorage.removeItem('usuario');
        localStorage.removeItem('mantenersesioniniciada');

        // Se eliminan las selecciones de elementos
        // localStorage.removeItem('catID');
        // localStorage.removeItem('prodID');
    }).catch((error) => {
        // Manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;

        // Informa al usuario del error
        // No se considera inseguro ya que la validacion misma ocurre en el cliente
        alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
    });

    // Recarga la página actual
    location.reload();
}

// Exporta funciones para su uso desde otros script
window.cerrarSesion = cerrarSesion;