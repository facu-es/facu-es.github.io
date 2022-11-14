// Inicializa constantes de atributos de usuario
const atributosDefinibles = ["firstname", "secondname", "lastname", "secondlastname", "alternativeemail", "firstaddress", "secondaddress", "postalcode", "state", "city", "country"];
const attributosFirebase = ["provider", "site", "displayName", "email", "photoURL", "emailVerified", "uid", "nid"];

// Inicializa variable global con datos del usuario
let usuario = {};

// Prepara un objeto con los elementos del formulario
function cargaDatosUsuario() {
    // Copia valores a los atributos del objeto de usuario desde el DOM
    atributosDefinibles.forEach(elemento => { usuario[elemento] = document.getElementById("profile-" + elemento).value });

    // Elimina elementos del objeto editable de usuario que pertenecen al objeto de sesion
    attributosFirebase.forEach(atributoSesion => delete usuario[atributoSesion]);

    // Actualiza objeto en Firebase
    actualizaPerfilUsuario(usuario)
}

// Convierte el archivo cargado a Base64
// Entrega una Promesa mientras realiza el trabajo asíncrono
const convertirBase64 = (file) => {
    return new Promise((resolve, reject) => {
        
        // Inicializa la lectura de un archivo
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        // Lee el archivo
        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        // En caso de error reporta eso en la Promesa
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

// Convierte imagen cargada desde la interfaz para poder almacenarla en FIrebase
// Gestiona la carga del archivo
// Espera a que sea convertido a Base64 por la funcion convertirBase64
// Guarda la informacion en el atributo correspondiente del objeto de usuario
// Aplica los cambios en la página para mostrar la imagen cargada
async function cargarImagen(evento) {
    const archivoCargado = evento.target.files[0];
    const imagenBase64 = await convertirBase64(archivoCargado);
    
    if(imagenBase64) {
        usuario.photoIMG = imagenBase64;
        document.getElementById("profile-img").src = imagenBase64;
    }
};


// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Adquiere referencias al DOM para los campos obligatorios del formulario
    const primerNombre = document.getElementById("profile-firstname");
    const primerApellido = document.getElementById("profile-lastname");
    const correoAlternativo = document.getElementById("profile-alternativeemail");
    const identificadorIdentidad = document.getElementById("profile-uid");
    const provedorIdentidad = document.getElementById("profile-provider");
    const correoInicioSesion = document.getElementById("profile-email");
    
    // Agrega escucha para evento de carga de imagen
    document.getElementById("profile-uploadIMG").addEventListener("change", function(e) { cargarImagen(e) });

    // Adquiere objeto de usuario desde Firebase
    adquierePerfilUsuario(usuarioActual).then((datosFirebase) => {

        // Copia de valores de atributos al DOM y al objeto editable de usuario
        // Siempre que los atributos recuperados desde Firebase sean atributos válidos
        Object.keys(datosFirebase).forEach(elemento => {
            // Copia al objeto editable del usuario los datos recibidos
            usuario[elemento] = datosFirebase[elemento];
            
            // Copia al DOM los datos recibidos
            if (atributosDefinibles.includes(elemento)) {
                document.getElementById("profile-" + elemento).value = datosFirebase[elemento];
            }
        });

        // Carga informacion disponible desde objeto de sesión del usuario
        // Si el objeto en Firebase no contiene los datos requeridos por el formulario
        // estos son cargados desde el objeto de sesión
        // Primer nombre
        if (usuario["firstname"]) {
            primerNombre.value = usuario.firstname
        } else {
            if (usuarioActual.displayName.split(" ")[0]) {
                primerNombre.value = usuarioActual.displayName.split(" ")[0];
            } else {
                primerNombre.value = ""
            }
        };

        // Primer apellido
        if (usuario["lastname"]) {
            primerApellido.value = usuario.lastname
        } else {
            if (usuarioActual.displayName.split(" ")[1]) {
                primerApellido.value = usuarioActual.displayName.split(" ")[1];
            } else {
                primerApellido.value = ""
            }
        };
        // Correo personalizable
        if (usuario["alternativeemail"]) {
            correoAlternativo.value = usuario.alternativeemail
        } else {
            correoAlternativo.value = usuarioActual.email
        };

        // Muestra datos fijos de Firebase desde Objeto de Sesión
        identificadorIdentidad.innerHTML = usuarioActual.uid;
        provedorIdentidad.innerHTML = usuarioActual.provider;
        correoInicioSesion.innerHTML = usuarioActual.email;
        // Si el usuario definió una imagen personalizada aplica esa
        // Si no utiliza la imagen de la cuenta en el provedor de inicio de sesión
        // En caso de que no haya ninguna imagen disponible deja la imagen predeterminada
        if (usuario.photoIMG) {
            console.log("elegida IMG")
            document.getElementById("profile-img").src = usuario.photoIMG;
        } else {
            if (usuarioActual.photoURL) {
                console.log("elegida URL")
                document.getElementById("profile-img").src = usuarioActual.photoURL.split("=")[0];
            } else {
                console.log("Ninguna elegida")
            }
        } 
    });

    // Gestiona formulario de perfil
    const form = document.getElementById('profile-form')

    // Detiene evento por defecto de formulario
    form.addEventListener('submit', function (event) {
        // Si se valida el formulario lo envía y avisa al usuario
        // de lo contrario detiene el envío y muestra los campos a corregir
        if (!form.checkValidity()) {
            // Detiene comportamiento por defecto
            event.preventDefault();
            event.stopPropagation();
        } else {
            cargaDatosUsuario();
        }

        form.classList.add('was-validated')
    }, false)
});