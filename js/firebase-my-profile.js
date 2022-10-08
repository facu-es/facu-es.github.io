// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getDatabase, set, ref, child, get, push, update, remove } from "./firebase-9.9.2/firebase-database.js";

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
function adquierePerfilUsuario(usuario) {
    return get(child(ref(db), "ListadoUsuarios/" + usuario.uid + "/profile")).then(function (perfil) {
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
function actualizaPerfilUsuario() {  

    if (textoComentario === "") {
        alert("Debe escribir un comentario")
    } else {

        // Agrega el comentario en la base de datos de Firebase
        comentario = {
            product: parseInt(currentProdID),
            score: parseInt(puntosComentario.value),
            description: textoComentario.value,
            user: usuarioActual.displayName,
            dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        push(ref(db, "ListadoComentarios/" + currentProdID), comentario)
            // En caso de error alerta al usuario con el codigo de error
            .catch((error) => {
                alert(error.message);
            })
    }


}

// Permite que las funciones necesarias sean accesibles desde otros script
window.adquierePerfilUsuario = adquierePerfilUsuario;
window.actualizaPerfilUsuario = actualizaPerfilUsuario;