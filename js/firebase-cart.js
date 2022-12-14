// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getDatabase, ref, child, get, push, update, remove } from "./firebase-9.9.2/firebase-database.js";

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

// Busca lista de productos del carrito en Firebase
function adquiereCarritoFirebase(userID) {
    return get(child(ref(db), "ListadoUsuarios/" + userID + "/cart/")).then(function (carritoFirebase) {
        if (carritoFirebase.exists()) {
            // Aquí se convierte el Objeto de Objetos en un Array de Objetos,
            // se añade un atributo llamado fid con el identificador del objeto en Firebase como valor
            // luego se devuelve eso
            return Object.keys(carritoFirebase.val()).map(function (key) {
                let item = carritoFirebase.val()[key];
                item.fid = key;
                return item
            });
        } else {
            // Si no hay un carrito en Firebase devuelve un Array vacío
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

// Formulario de envío de comentarios nuevos
function enviaCarritoFirebase(prodID, prodName, prodImg, prodCost, prodCurrency, prodCount) {
    // Inicializa variable para el artículo
    let articulo = {};

    if (usuarioActual === null || usuarioActual === "" || usuarioActual === undefined) {
        alertaUsuario("Acceso denegado", "Debe iniciar sesión para poder comprar", "warning");
        return
    }

    // Agrega el producto en la base de datos de Firebase
    articulo = {
        id: parseInt(prodID),
        name: prodName,
        count: parseInt(prodCount),
        unitCost: parseInt(prodCost),
        currency: prodCurrency,
        image: prodImg,
    };

    push(ref(db, "ListadoUsuarios/" + usuarioActual.uid + "/cart/"), articulo)
        .catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;

            // Imprime errores en la consola
            // Aunque no hacemos nada con esta info por ahora
            console.log(errorCode);
            console.log(errorMessage);
        });

    alertaUsuario("Correcto", "¡El producto fue agregado!", "success");
}

// Elimina el objeto del producto en el carrito del usuario en Firebase
function eliminarElementoCarrito(firebaseItemID) {
    remove(ref(db, "ListadoUsuarios/" + usuarioActual.uid + "/cart/" + firebaseItemID))
        .catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
}

// Actualiza la cantidad de un producto en el objeto en Firebase
function actualizaElementoCarrito(firebaseItemID, cantidad) {
    update(ref(db, "ListadoUsuarios/" + usuarioActual.uid + "/cart/" + firebaseItemID), { count: Math.max(Math.round(parseInt(cantidad)), 0) })
        .catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
}

// Permite que las funciones necesarias sean accesibles desde otros script
window.adquiereCarritoFirebase = adquiereCarritoFirebase;
window.enviaCarritoFirebase = enviaCarritoFirebase;
window.eliminarElementoCarrito = eliminarElementoCarrito;
window.actualizaElementoCarrito = actualizaElementoCarrito;