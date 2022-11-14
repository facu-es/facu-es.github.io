// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from "./firebase-9.9.2/firebase-auth.js";

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

// Define idioma de autenticación
auth.languageCode = 'es';

// Agrega autenticacion con Google
const google = new GoogleAuthProvider();

// Agrega autenticacion con Github
const github = new GithubAuthProvider();

// Configura menu de login (deshabilita el registro en Github)
github.setCustomParameters({
    'allow_signup': 'false'
});

// Inicia sesion con Google
function iniciarSesionGoogle() {
    signInWithPopup(auth, google)
        .then((result) => {
            // Se adquiere un Token de Acceso
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;

            // Aqui se obtine la informacion del usuario que inició sesión
            const user = result.user;

        }).catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);

            // Imprime errores en la consola
            // Aunque no hacemos nada con esta info por ahora
            console.log(errorCode);
            console.log(errorMessage);

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
}

// Inicia sesion con Github
function iniciarSesionGithub() {
    signInWithPopup(auth, github)
        .then((result) => {
            // Se adquiere un Token de Acceso
            const credential = GithubAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;

            // Aqui se obtine la informacion del usuario que inició sesión
            const user = result.user;

        }).catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GithubAuthProvider.credentialFromError(error);

            // Imprime errores en la consola
            // Aunque no hacemos nada con esta info por ahora
            console.log(errorCode);
            console.log(errorMessage);

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
}

// Inicia sesion con Email
function iniciarSesionCorreo(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Aqui se obtine la informacion del usuario que inició sesión
            const user = userCredential.user;
        })
        .catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;

            // Imprime errores en la consola
            // Aunque no hacemos nada con esta info por ahora
            console.log(errorCode);
            console.log(errorMessage);

            // Informa al usuario del error
            // No se considera inseguro ya que la validacion misma ocurre en el cliente
            alertaUsuario("Error de Firebase", errorCode.split("/")[1], "danger");
        });
}

// Escucha por un evento de inicio de sesion basado en Firebase
onAuthStateChanged(auth, (user) => {
    // Inicializa objeto para datos del usuario
    let usuario = undefined;

    if (user) {
        // Se crea el objeto que alberga la informacion del usuario
        // Se sanitizan los campos alterables por el usuario
        if (user.displayName !== null) {
            usuario = {
                provider: DOMPurify.sanitize(user.providerId, { USE_PROFILES: { html: true } }),
                site: DOMPurify.sanitize(user.providerData[0].providerId, { USE_PROFILES: { html: true } }),
                displayName: DOMPurify.sanitize(user.displayName, { USE_PROFILES: { html: true } }),
                email: DOMPurify.sanitize(user.email, { USE_PROFILES: { html: true } }),
                photoURL: DOMPurify.sanitize(user.photoURL, { USE_PROFILES: { html: true } }),
                emailVerified: DOMPurify.sanitize(user.emailVerified, { USE_PROFILES: { html: true } }),
                uid: DOMPurify.sanitize(user.uid, { USE_PROFILES: { html: true } }),
                nid: DOMPurify.sanitize(user.displayName.toLowerCase().replace(/[^a-zA-Z0-9]+/gmi, '_'), { USE_PROFILES: { html: true } }),
            };
        } else {
            usuario = {
                provider: DOMPurify.sanitize(user.providerId, { USE_PROFILES: { html: true } }),
                site: DOMPurify.sanitize(user.providerData[0].providerId, { USE_PROFILES: { html: true } }),
                displayName: DOMPurify.sanitize(user.email.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9]+/gmi, '_'), { USE_PROFILES: { html: true } }),
                email: DOMPurify.sanitize(user.email, { USE_PROFILES: { html: true } }),
                photoURL: DOMPurify.sanitize(user.photoURL, { USE_PROFILES: { html: true } }),
                emailVerified: DOMPurify.sanitize(user.emailVerified, { USE_PROFILES: { html: true } }),
                uid: DOMPurify.sanitize(user.uid, { USE_PROFILES: { html: true } }),
                nid: DOMPurify.sanitize("user_" + user.email.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9]+/gmi, '_'), { USE_PROFILES: { html: true } }),
            };
        }

        // Guarda la sesion en localStorage
        localStorage.setItem('mantenersesioniniciada', true);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirecciona a pagina principal o a la pagina anterior
        let paginaAnterior = sessionStorage.getItem("paganterior");
        if (paginaAnterior) {
            // Redirige a sitio anterior
            window.location.href = paginaAnterior;

            // Limpia el valor del Almacenamiento de Sesion
            sessionStorage.removeItem('paganterior');
        } else {
            // Redirige a pagina principal
            window.location.href = "index.html";
        }
    }
});

// Se hacen globales las funciones disponible en este script de tipo modulo
window.iniciarSesionGoogle = iniciarSesionGoogle;
window.iniciarSesionGithub = iniciarSesionGithub;
window.iniciarSesionCorreo = iniciarSesionCorreo;