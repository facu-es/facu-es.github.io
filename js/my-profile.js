// Inicializa variables globales
let usuario = {};

// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Adquiere elementos de DOM
    const username = document.getElementById("profile-username");
    const provider = document.getElementById("profile-provider");
    const email = document.getElementById("profile-email");
    const fullname = document.getElementById("profile-fullname");
    const firstaddress = document.getElementById("profile-firstaddress");
    const secondaddress = document.getElementById("profile-secondaddress");
    const postalcode = document.getElementById("profile-postalcode");
    const state = document.getElementById("profile-state");
    const city = document.getElementById("profile-city");
    const country = document.getElementById("profile-country");

    // Llama funcion de Firebase
    adquierePerfilUsuario(usuarioActual).then((e) => {
        city.value = e.city;
        country.value = e.country;
    });

    // Carga informacion disponible
    username.innerHTML = usuarioActual.uid;
    provider.innerHTML = usuarioActual.provider;
    email.innerHTML = usuarioActual.email;

    if(usuarioActual.photoURL !== null) {
        document.getElementById("profile-img").src = usuarioActual.photoURL.split("=")[0];
    }

    
    fullname.value = usuarioActual.displayName;
    firstaddress.value = usuarioActual.firstaddress
    secondaddress.value = usuarioActual.secondaddress
    postalcode.value = usuarioActual.postalcode;
    state.value = usuarioActual.state;
    /*
    city.value = usuarioActual.city;
    country.value = usuarioActual.country;
    */

    // Agrega escucha de evento clic
    document.getElementById("profile-guardar").addEventListener("clic", function () {
        actualizaPerfilUsuario(usuario);
    });
});