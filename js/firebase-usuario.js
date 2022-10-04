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

// Inicializa Firebase (aplicacion y acceso a base de datos en tiempo real)
const app = initializeApp(firebaseConfig);

// Inicializa autenticacion mediante Firebase
const auth = getAuth();

// Adquiere usuario actualmente iniciado
const user = auth.currentUser;

if (user !== null) {
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    // Este identificador es único para el proyecto actual de Firebase
    const uid = user.uid;
}

function cerrarSesion() {
    signOut(auth).then(() => {
        // Si se detecta el cierre de sesion de Firebase se cierra la sesion local
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

        // Imprime errores en la consola
        // Aunque no hacemos nada con esta info por ahora
        console.log(errorCode);
        console.log(errorMessage);
    });
    
    // Recarga la página actual
    location.reload();
}

// Exporta funciones para su uso desde otros script
window.cerrarSesion = cerrarSesion;