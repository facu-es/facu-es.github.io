// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getDatabase, ref, child, get, push, update } from "./firebase-9.9.2/firebase-database.js";

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
            // Se convierte el Objeto de Objetos en un Array de Objetos, se realizan validaciones y se devuelve el resultado
            return Object.keys(comentariosFirebase.val()).map(function (key) {
                // Inicializa objeto nuevo para el comentario
                let item = comentariosFirebase.val()[key]
                
                // Añade la referencia al comentario en Firebase como un conjunto atributo/valor
                item.fid = key;
                
                // Devuelve el listado de objetos
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

        // Informa al usuario del error
        // No se considera inseguro ya que la validacion misma ocurre en el cliente
        alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
    });
};

// Envío de comentarios nuevos
function enviaComentarioFirebase() {
    // Inicializa objeto de trabajo
    let comentario = {};

    // Verifica si hay un usuario con sesion iniciada
    if (usuarioActual === null || usuarioActual === "" || usuarioActual === undefined) {
        alertaUsuario("Acceso denegado", "Debe iniciar sesión para poder comentar", "warning");
        return
    }

    // Guarda en constantes las referencias al DOM a campos en el formulario
    const textoComentario = document.getElementById("textoComentario");
    const puntosComentario = document.getElementById("puntosComentario");

    // Si el campo de texto para el comentario está vacío notifica al usuario para que lo complete
    if (textoComentario.value === "") {
        alertaUsuario("Formulario incompleto", "El comentario no puede estar vacío", "warning");
    } else {
        // Completa objeto de Comentario
        comentario = {
            product: parseInt(currentProdID),
            score: parseInt(puntosComentario.value),
            description: textoComentario.value,
            user: usuarioActual.nid,
            dateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        // Agrega el comentario en la base de datos de Firebase
        push(ref(db, "ListadoComentarios/" + currentProdID), comentario)
            .catch((error) => {
                // Manejo de errores
                const errorCode = error.code;
                const errorMessage = error.message;

                // Informa al usuario del error
                // No se considera inseguro ya que la validacion misma ocurre en el cliente
                alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
            });
    }
    // Agrega comentario al array actual de comentarios
    currentCommentsArray.push(comentario);

    // Limpia los campos
    textoComentario.value = "";
    puntosComentario.value = 3;
    limpiarFiltrosComentarios();

    // Actualiza el listado de comentarios
    sortAndShowComments(ORDER_ASC_BY_DATE);
}

// Funcionalidad para eliminar comentarios
function eliminaComentarioFirebase(prodID, arrID, firebaseID) {
    // Verifica que se definió firebaseID y si no termina la función
    if(!firebaseID) {
        return
    }

    // Construye constante con la fecha y hora actual
    const fechaeliminado = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    // Agrega atributo de eliminado con la fecha en que se realiza
    update(ref(db, "ListadoComentarios/" + prodID + "/" + firebaseID), {
        eliminado: fechaeliminado,
    })
    .catch((error) => {
        // Manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;

        // Informa al usuario del error
        // No se considera inseguro ya que la validacion misma ocurre en el cliente
        alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
    });

    // Añade atributo de eliminado en el Array actual
    currentCommentsArray[arrID].eliminado = fechaeliminado;

    // Actualiza la vista actual
    sortAndShowComments(ORDER_ASC_BY_DATE);
}

// Funcionalidad para modificar comentarios
function actualizaComentarioFirebase(prodID, arrID, firebaseID) {
    // Verifica que se definió firebaseID y si no termina la función
    if(!firebaseID) {
        return
    }

    // Inicializa variables
    let fecha = undefined;

    // Guarda en constantes las referencias al DOM a campos en el formulario
    const textoComentario = document.getElementById("textoComentario");
    const puntosComentario = document.getElementById("puntosComentario");

    // Si el campo de texto para el comentario está vacío notifica al usuario para que lo complete
    if (textoComentario.value === "") {
        alertaUsuario("Formulario incompleto", "El comentario no puede estar vacío", "warning");
    } else {
        // Fecha del cambio
        fecha = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        // Actualiza comentario
        update(ref(db, "ListadoComentarios/" + prodID + "/" + firebaseID), {
            score: parseInt(puntosComentario.value),
            description: textoComentario.value,
            actualizado: fecha
        })
        .catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
    };

    // Actualiza el array actual de comentarios
    currentCommentsArray[arrID].actualizado = fecha;
    currentCommentsArray[arrID].description = textoComentario.value;
    currentCommentsArray[arrID].score = puntosComentario.value;

    // Limpia los campos
    textoComentario.value = "";
    puntosComentario.value = 3;
    limpiarFiltrosComentarios();

    // Actualiza el listado de comentarios
    sortAndShowComments(ORDER_ASC_BY_DATE);
}


// Permite que las funciones necesarias sean accesibles desde otros script
window.adquiereComentariosFirebase = adquiereComentariosFirebase;
window.enviaComentarioFirebase = enviaComentarioFirebase;
window.eliminaComentarioFirebase = eliminaComentarioFirebase;
window.actualizaComentarioFirebase = actualizaComentarioFirebase;