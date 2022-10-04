// Importa scripts de Firebase
import { initializeApp } from "./firebase-9.9.2/firebase-app.js";
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "./firebase-9.9.2/firebase-auth.js";

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

// Define idioma de autenticación
auth.languageCode = 'es';

// Agrega autenticacion con Google
const google = new GoogleAuthProvider();

// Configura menu de login (agrega casilla de ejemplo)
google.setCustomParameters({
    'login_hint': 'user@example.com'
});

// Agrega autenticacion con Github
const github = new GithubAuthProvider();

// Configura menu de login (deshabilita el registro en Github)
github.setCustomParameters({
  'allow_signup': 'false'
});

function iniciarSesionGoogle() {
signInWithPopup(auth, google)
    .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        console.log("Google");
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // Aqui se obtine la informacion del usuario que inició sesión
        const user = result.user;

        // Guarda un elemento en el local storage con la informacion de usuario
        console.log(user);

        sessionStorage.setItem('usuario', JSON.stringify({
            "correo": user.email,
            "nombre_completo": user.displayName,
            "nombre_usuario": user.uid,
            "imagen": user.photoURL,
        }));

    }).catch((error) => {
        // Manejo de errores
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // No hacemos nada con esta info por ahora
    });
}

function iniciarSesionGithub() {
console.log("Github");
    signInWithPopup(auth, github)
        .then((result) => {
            // Se adquiere un Token de Acceso
            console.log("Github login");
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
    
            // Aqui se obtine la informacion del usuario que inició sesión
            const user = result.user;

            // Guarda un elemento en el local storage con la informacion de usuario
            console.log(user);
    
            sessionStorage.setItem('usuario', JSON.stringify({
                "correo": user.email,
                "nombre_completo": user.displayName,
                "nombre_usuario": user.uid,
                "imagen": user.photoURL,
            }));
    
        }).catch((error) => {
            // Manejo de errores
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // No hacemos nada con esta info por ahora
        });
}

function cerrarSesionFirebase() {
    signOut(auth).then(() => {
        // Cierre de sesión exitoso
        window.location = "index.html"
    }).catch((error) => {
        // No hacemos nada con esta info por ahora
    });
}

window.iniciarSesionGoogle = iniciarSesionGoogle;
window.iniciarSesionGithub = iniciarSesionGithub;
window.cerrarSesionFirebase = cerrarSesionFirebase;