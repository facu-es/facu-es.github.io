const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

// Variable global que contendrá al objeto del usuario iniciado
let usuarioActual = undefined;

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};

// Alertas al usuario
function alertaUsuario(titulo, mensaje, tipo) {
  const alertaAnclaDOM = document.getElementById('alertaAnclaDOM')

  const alertaHTML = document.createElement('div')
  alertaHTML.innerHTML = [
    `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">`,
    `   <h4 class="alert-heading">${titulo}</h4>`,
    `   <hr>`,
    `   <div>${mensaje}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>',
    '</div>'
  ].join('')

  alertaAnclaDOM.append(alertaHTML)
}

// Gestión de menus de usuario
document.addEventListener("DOMContentLoaded", function (e) {
  const inicioRegistroCuenta = document.getElementById("inicio-registro-cuenta");
  const mantenerSesionIniciada = localStorage.getItem("mantenersesioniniciada");

  if (mantenerSesionIniciada) {
    usuarioActual = JSON.parse(localStorage.getItem("usuario"));
  } else {
    usuarioActual = JSON.parse(sessionStorage.getItem("usuario"));
  }

  // Si existe el ancla en el DOM modifica la página
  if (inicioRegistroCuenta) {
    if (usuarioActual === undefined || usuarioActual === null) {
      // Cuando no hay usuario iniciado se crea el botón de crear cuenta y el de iniciar sesión
      inicioRegistroCuenta.innerHTML += `
          <a class="btn btn-danger" href="register.html" id="crear-cuenta">Crear cuenta</a>
          <a class="btn btn-success" href="login.html" id="cuenta-usuario">Iniciar sesión</a>
        `
    } else {
      // Cuando hay un usuario iniciado se crea el menu desplegable con el nombre de usuario o su correo
      inicioRegistroCuenta.innerHTML += `
          <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">${usuarioActual.displayName}</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
              <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="javascript:cerrarSesion()">Cerrar sesión</a></li>
            </ul>
        `
    };
  }
});