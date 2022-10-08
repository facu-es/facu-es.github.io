// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getDatabase, ref, child, get, update } from "./firebase-9.9.2/firebase-database.js";

// Inicializa configuración de Firebase
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

// Inicializa aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Base de Datos de Firebase
const db = getDatabase(app);

// Inicializa variables globales
let perfilUsuario = undefined;

// Adquiere informacion del usuario
function adquierePerfilUsuario() {
    return get(child(ref(db), "ListadoUsuarios/" + usuarioActual.uid + "/profile")).then(function (perfil) {
        if (perfil.exists()) {
            perfilUsuario = perfil.val();
            return perfilUsuario;
        }
    }).catch((error) => {
        // Manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;

        // Imprime errores en la consola
        // Aunque no hacemos nada con esta info por ahora
        console.log(errorCode);
        console.log(errorMessage);
    });
};

// Formulario de envío de comentarios nuevos
function actualizaPerfilUsuario(usuario) {
    // Actualiza los datos en Firebase
    update(ref(db, "ListadoUsuarios/" + usuarioActual.uid + "/profile"), usuario)
    .then(() => alert("Datos actualizados"))
    .catch((error) => {
        // Manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;

        // Imprime errores en la consola
        // Aunque no hacemos nada con esta info por ahora
        console.log(errorCode);
        console.log(errorMessage);
    });
}

// Permite que las funciones necesarias sean accesibles desde otros script
window.adquierePerfilUsuario = adquierePerfilUsuario;
window.actualizaPerfilUsuario = actualizaPerfilUsuario;