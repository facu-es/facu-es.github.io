// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from "./firebase-9.9.2/firebase-auth.js";
// import {  setPersistence, browserSessionPersistence } from "./firebase-9.9.2/firebase-auth.js";

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

// Configura menu de login (agrega casilla de ejemplo)
google.setCustomParameters({
    'login_hint': 'usuario@google.com'
});

// Agrega autenticacion con Github
const github = new GithubAuthProvider();

// Configura menu de login (deshabilita el registro en Github)
github.setCustomParameters({
    'allow_signup': 'false'
});

// Inicia sesion con Google
function iniciarSesionGoogle() {
//    setPersistence(auth, browserSessionPersistence)
//        .then(() => {
            signInWithPopup(auth, google)
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
                    const credential = GoogleAuthProvider.credentialFromError(error);

                    // Imprime errores en la consola
                    // Aunque no hacemos nada con esta info por ahora
                    console.log(errorCode);
                    console.log(errorMessage);
                });
//        });
}

// Inicia sesion con Github
function iniciarSesionGithub() {
//    setPersistence(auth, browserSessionPersistence)
//        .then(() => {
            signInWithPopup(auth, github)
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
                });
//        });
}

// Inicia sesion con Email
function iniciarSesionCorreo(email, password) {
//    setPersistence(auth, browserSessionPersistence)
//        .then(() => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Aqui se obtine la informacion del usuario que inició sesión
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    // Manejo de errores
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    if (errorCode === "auth/user-not-found") {
                        alert("El usuario no está registrado")
                    }

                    // Imprime errores en la consola
                    // Aunque no hacemos nada con esta info por ahora
                    console.log(errorCode);
                    console.log(errorMessage);
                });
//        });
}

// Escucha por un evento de inicio de sesion basado en Firebase
onAuthStateChanged(auth, (user) => {
    let usuario = undefined;
    if (user) {
        // Se crea el objeto que alberga la informacion del usuario
        if (user.displayName !== null) {
            usuario = {
                provider: user.providerId,
                site: user.providerData[0].providerId,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                uid: user.uid,
                nid: user.displayName.toLowerCase().replace(/[^a-zA-Z0-9]+/gmi, '_'),
            };
        } else {
            usuario = {
                provider: user.providerId,
                site: user.providerData[0].providerId,
                displayName: user.email.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9]+/gmi, '_'),
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                uid: user.uid,
                nid: "user_" + user.email.split("@")[0].toLowerCase().split("@")[0].replace(/[^a-zA-Z0-9]+/gmi, '_'),
            };
        }

        // Guarda la sesion en localStorage
        localStorage.setItem('mantenersesioniniciada', true);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirecciona a pagina principal
        window.location.href = "index.html";
    }
});

window.iniciarSesionGoogle = iniciarSesionGoogle;
window.iniciarSesionGithub = iniciarSesionGithub;
window.iniciarSesionCorreo = iniciarSesionCorreo;