const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Gestion de menus de usuario
let botonCuentaUsuario = document.getElementById("cuenta-usuario");
  let botonCrearUsuario = document.getElementById("crear-cuenta");
  let menuOpcionesUsuario = document.getElementById("menu-usuario");
  var usuarioActual = null;

  function adquiereNombreUsuario() {
    let mantenerSesionIniciada = localStorage.getItem("mantenersesioniniciada");

    if (mantenerSesionIniciada) {
      usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    } else {
      usuarioActual = JSON.parse(sessionStorage.getItem("usuario"));
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    localStorage.removeItem('usuario');
    localStorage.removeItem('mantenersesioniniciada');
    window.location.href = "index.html";
  }

  window.onload = function () {
    adquiereNombreUsuario()
    if (usuarioActual == null) {
      // Cuando no hay usuario logeado se oculta el menu de usuario y se muestra el boton de crear cuenta y el de iniciar sesión
      botonCuentaUsuario.innerText = "Iniciar sesión";
      botonCuentaUsuario.classList.replace("nav-link", "btn", "active");
      botonCuentaUsuario.classList.add("btn-success");
      botonCuentaUsuario.href = "login.html";

      menuOpcionesUsuario.style = "display: none";

      // Por requisito de la letra se fuerza el inicio de sesion
      window.location = "login.html"
    } else {
      botonCrearUsuario.style = "display: none";
      
      botonCuentaUsuario.innerText = usuarioActual.nombre_completo;
      botonCuentaUsuario.classList.replace("nav-link", "btn", "active");
      botonCuentaUsuario.classList.add("btn-primary");
      botonCuentaUsuario.href = "#";

      menuOpcionesUsuario.style = "display: block";
    }
  }
