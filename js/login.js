// Inicializa variables para los elementos del formulario
let correoUsuario = undefined;
let contraUsuario = undefined;
let botonSesionInciada = undefined;

// Funcion para inicio de sesion por correo de Firebase
function autenticarUsuario() {
  // Aquiere valores del formulario
  correoUsuario = document.getElementById('correo-usuario').value;
  contraUsuario = document.getElementById('contra-usuario').value;

  // Expresion regular para validar el campo correo electronico
  const correoRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Si el nombre de usuario no cumple con la expresion regular
  // muestra un mensaje de error y termina la funcion
  if (!correoRegEx.test(correoUsuario)) {
    alertaUsuario("Entrada incorrecta", "El nombre de usuario debe ser un correo electrónico", "warning");
    return;
  }

  // Llama a funcion de Firebase para autenticar usuario
  iniciarSesionCorreo(correoUsuario, contraUsuario);
}

// Evalua redirecciones hacia el Login y notifica al usuario
function verificaRedirecionHaciaLogin() {
  // Adquiere la clave desde el Almacenamiento de Sesion
  let paginaAnterior = sessionStorage.getItem("paganterior");

  // Evalúa razon de redireccion y notifica al usuario
  if(paginaAnterior) {
    if(paginaAnterior.includes("my-profile")) {
      alertaUsuario("Debe iniciar sesión", "Debe iniciar sesión para acceder al Perfil de Usuario", "warning", 10000);
    }
    if(paginaAnterior.includes("cart")) {
      alertaUsuario("Debe iniciar sesión", "Debe iniciar sesión para acceder al Carrito", "warning", 10000);
    }
  }
}

// Espera la carga completa del sitio y la disponibilidad de DOM
document.addEventListener("DOMContentLoaded", function () {

  // Alerta al usuario si fue redireccionado por requerir Login
  verificaRedirecionHaciaLogin();

  // Inicio de sesion por Correo
  document.getElementById('iniciar-sesion').addEventListener('click', autenticarUsuario);

  // Inicio de sesion por Google
  document.getElementById('inicia-con-google').addEventListener('click', iniciarSesionGoogle);

  // Inicio de sesion por Github
  document.getElementById('inicia-con-github').addEventListener('click', iniciarSesionGithub);
});