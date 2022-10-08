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

// Busca comentarios en Firebase
function adquiereComentariosFirebase(prodID) {
    return get(child(ref(db), "ListadoComentarios/" + prodID)).then(function (comentariosFirebase) {
        if (comentariosFirebase.exists()) {
            // Aquí se convierte el Objeto de Objetos en un Array de Objetos y se devuelve eso
            return Object.keys(comentariosFirebase.val()).map(function(key) {
                let item = comentariosFirebase.val()[key];
                item.fid = key;
                return item
            });
        } else {
            // Si no hay comentarios en Firebase devuelve un Array vacío
            return [];
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
function enviaComentarioFirebase() {
    let comentario = {};

    if (usuarioActual === null || usuarioActual === "" || usuarioActual === undefined) {
        alert("Debe iniciar sesión para poder comentar")
        return
    }

    textoComentario = document.getElementById("textoComentario");
    puntosComentario = document.getElementById("puntosComentario");

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
    // Agrega comentario al array actual
    currentCommentsArray.push(comentario);

    // Limpia los campos
    textoComentario.value = "";
    puntosComentario.value = 3;

    limpiarFiltrosComentarios();
    sortAndShowComments(ORDER_ASC_BY_DATE);

}

function eliminaComentarioFirebase(firebaseID) {

}

function actualizaComentarioFirebase(firebaseID) {

}


// Permite que las funciones necesarias sean accesibles desde otros script
window.adquiereComentariosFirebase = adquiereComentariosFirebase;
window.enviaComentarioFirebase = enviaComentarioFirebase;
window.eliminaComentarioFirebase = eliminaComentarioFirebase;
window.actualizaComentarioFirebase = actualizaComentarioFirebase;