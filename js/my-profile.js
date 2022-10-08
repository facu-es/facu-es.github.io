// Inicializa variable global con datos del usuario
let usuario = {};

// Prepara un objeto con los elementos del formulario
function cargaDatosUsuario() {
    // Validacion de campos del formulario
    // PENDIENTE

    // Carga de valores en Objeto de usuario
    cargaAtributosDOM = [ "fullname", "firstaddress", "secondaddress", "postalcode", "state", "city", "country" ];
    cargaAtributosDOM.forEach(elemento => { usuario[elemento] = document.getElementById("profile-" + elemento).value });    

    // Elimina elementos que pertenecen al objeto de sesion
    eliminarAtributos = [ "provider", "site", "displayName", "email", "photoURL", "emailVerified", "uid", "nid" ];
    eliminarAtributos.forEach(atributoSesion => delete usuario[atributoSesion]);

    // Actualiza objeto de Firebase
    actualizaPerfilUsuario(usuario)
}

// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Adquiere objeto de usuario desde Firebase
    adquierePerfilUsuario(usuarioActual).then((datosFirebase) => {

        // Asignacion de atributos a DOM y al objeto del usuario
        Object.keys(datosFirebase).forEach(elemento => {
            usuario[elemento] = datosFirebase[elemento];
            document.getElementById("profile-" + elemento).value = datosFirebase[elemento];
        });

        // Carga informacion disponible desde objeto de sesión del usuario
        document.getElementById("profile-fullname").innerHTML = usuarioActual.displayName;
        document.getElementById("profile-username").innerHTML = usuarioActual.uid;
        document.getElementById("profile-provider").innerHTML = usuarioActual.provider;
        document.getElementById("profile-email").innerHTML = usuarioActual.email;
        if (usuarioActual.photoURL !== null) {
            document.getElementById("profile-img").src = usuarioActual.photoURL.split("=")[0];
        }
    });

    // Agrega escucha de evento clic
    document.getElementById("profile-guardar").addEventListener("click", cargaDatosUsuario);
});