// Variables de ordenamiento
const ORDER_ASC_BY_DATE = "Fecha_Ascendente";
const ORDER_DESC_BY_DATE = "Fecha_Descendente";
const ORDER_ASC_BY_SCORE = "Calificacion_Ascendente";
const ORDER_DESC_BY_SCORE = "Calificacion_Descendente";

let minCount = undefined;
let maxCount = undefined;
let textoParaBuscar = undefined;

let currentProductInfo = [];
let currentCommentsArray = [];
let firebaseCommentsArray = [];
let currentProdID = "";

let textoComentario = "";
let puntosComentario = "";

// Ordena los elementos del array recibido
// Cuando se define criterio la funcion de comparacion adecuada es utilizada
function sortComments(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_DATE) {
        result = array.sort(function (a, b) {
            let aDate = parseInt(moment.duration(moment(a.dateTime, moment.ISO_8601)).asSeconds());
            let bDate = parseInt(moment.duration(moment(b.dateTime, moment.ISO_8601)).asSeconds());

            if (aDate < bDate) { return -1; }
            if (aDate > bDate) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_DATE) {
        result = array.sort(function (a, b) {
            let aDate = parseInt(moment.duration(moment(a.dateTime, moment.ISO_8601)).asSeconds());
            let bDate = parseInt(moment.duration(moment(b.dateTime, moment.ISO_8601)).asSeconds());

            if (aDate > bDate) { return -1; }
            if (aDate < bDate) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_ASC_BY_SCORE) {
        result = array.sort(function (a, b) {
            let aScore = parseInt(a.score);
            let bScore = parseInt(b.score);

            if (aScore < bScore) { return -1; }
            if (aScore > bScore) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_SCORE) {
        result = array.sort(function (a, b) {
            let aScore = parseInt(a.score);
            let bScore = parseInt(b.score);

            if (aScore > bScore) { return -1; }
            if (aScore < bScore) { return 1; }
            return 0;
        });
    }

    return result;
}

function setPrincipalImage(imagen) {
    document.getElementById("imagen-principal").src = imagen;
}

// Crea el contenido HTML que muestra el currentProductInfoo
function showProductInfo() {
    let carrouselElementosHTML = "";
    let carrouselIdicadoresHTML = "";
    let relacionadosProductoHTML = "";
    let detallesProductoHTML = "";

    // Construye html con las imagenes del producto
    // NOTA: Podria haber utilizado la notacion hardcodeada de no ser porque un solo producto contiene 5 imagenes
    // aunque no están representadas en el JSON entregado por el servidor.

    for (let i = 0; i < currentProductInfo.images.length; i++) {
        if (i === 0) {
            carrouselElementosHTML += `<div class="carousel-item active"><img src="${currentProductInfo.images[i]}" class="d-block w-100" alt="Imagen ${i + 1} de ${currentProductInfo.name}"></div>`;
            carrouselIdicadoresHTML += `<button type="button" data-bs-target="#indicadorImagen" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Imagen ${i + 1} de ${currentProductInfo.name}"></button>`;
        } else {
            carrouselElementosHTML += `<div class="carousel-item"><img src="${currentProductInfo.images[i]}" class="d-block w-100" alt="Imagen ${i + 1} de ${currentProductInfo.name}"></div>`;
            carrouselIdicadoresHTML += `<button type="button" data-bs-target="#indicadorImagen" data-bs-slide-to="${i}" aria-label="Imagen ${i + 1} de ${currentProductInfo.name}"></button>`;
        }
    };

    // Construye html con los productos relacionados del producto
    // NOTA: Podria haber utilizado la notacion hardcodeada de no ser porque la API no define explicitamente
    // que solo se presenten dos relacionados, aunque ese ha sido el caso
    for (let i = 0; i < currentProductInfo.relatedProducts.length; i++) {
        relacionadosProductoHTML += `
        <div onclick="adquiereProductoComentarios(${currentProductInfo.relatedProducts[i].id})" class="col-md-6">
            <div class="card mb-4 shadow-sm custom-card cursor-active w-100">
                <img class="card-img-top"
                    src="${currentProductInfo.relatedProducts[i].image}"
                    alt="Imagen de ${currentProductInfo.relatedProducts[i].name}">
                <h3 class="m-3">${currentProductInfo.relatedProducts[i].name}</h3>
            </div>
        </div>
        `
    }

    detallesProductoHTML = `
    <div><span class="fw-bold">Cantidades vendidas:</span> <span>${currentProductInfo.soldCount}</span></div>
    <div><span class="fw-bold">Precio: </span><span>${currentProductInfo.currency} ${currentProductInfo.cost}</span></div>
    <hr class="singleline">
    <span>${currentProductInfo.description}</span>
    `
    // Inserta HTML en los identificadores del producto
    document.getElementById("nombreProducto").innerHTML = currentProductInfo.name;
    document.getElementById("carrouselIdicadores").innerHTML = carrouselIdicadoresHTML;
    document.getElementById("carrouselElementos").innerHTML = carrouselElementosHTML;
    document.getElementById("relacionadosProducto").innerHTML = relacionadosProductoHTML;
    document.getElementById("categoriaActual").innerHTML = currentProductInfo.category;
    document.getElementById("productoActual").innerHTML = currentProductInfo.name;
    document.getElementById("detallesProducto").innerHTML = detallesProductoHTML;
}

// Crea el contenido HTML que muestra el currentProductInfoo
function showCommentsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCommentsArray.length; i++) {
        let comment = currentCommentsArray[i];
        let htmlPuntuacionEstrellas = "";

        // Construye html con las estrellas correspondientes a la puntuacion
        // NOTA para mi: En el for se usa menor que y no se incluye el valor de la variable, ya que el conteo inicia en 0.
        for (let i = 0; i < 5; i++) {
            if (i < comment.score) {
                // Mientras no se alcance el puntaje agregar en orden estrellas marcadas
                htmlPuntuacionEstrellas += `<i class="fas fa-star estrella-marcada"></i>`
            } else {
                // Completa con estrellas apagadas lo restante necesario para llegar a 5
                htmlPuntuacionEstrellas += `<i class="fas fa-star estrella-sin-marcar"></i>`
            }
        }

        // Establece idioma para los textos de Fecha
        moment.locale('es');

        // Funciones de filtrado a los comentarios
        if (((minCount == undefined) || (minCount != undefined && parseInt(comment.score) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(comment.score) <= maxCount)) &&
            ((textoParaBuscar == undefined || textoParaBuscar == '') || (comment.user.toLowerCase().includes(textoParaBuscar) || comment.description.toLowerCase().includes(textoParaBuscar)))) {

            htmlContentToAppend += `
        <div class="card-body p-4">
            <div class="d-flex flex-start">
              <img class="rounded-circle shadow-1-strong me-3"
                src="img/img_perfil.png" alt="avatar" width="60"
                height="60" />
              <div>
                <h6 class="fw-bold mb-1">${comment.user}</h6>
                <div class="d-flex align-items-center mb-1">
                  <p class="mb-0">
                  <span>Fecha: </span>${moment(comment.dateTime, moment.ISO_8601).format('LLLL')}
                  </p>
                </div>
                <div class="d-flex align-items-center mb-3">
                <span>Calificación: </span>${htmlPuntuacionEstrellas}
                </div>
                <p class="mb-0">
                ${comment.description}
                </p>
              </div>
            </div>
          </div>

          <hr class="my-0" />
            `
        }
    }
    document.getElementById("comentarios").innerHTML = htmlContentToAppend;
}

function adquiereProductoComentarios(prodID) {
    // Verifica que se haya elegido un producto
    let currentProdID = prodID;
        
    // Si no fue elegido ninguno redirige a products
    if (prodID === null || prodID === "" | prodID === undefined) {
        if (localStorage.getItem("prodID") === null) {
            alert("Debe elegir un producto");
            window.location.href = "products.html";
            return
        } else {
            currentProdID = localStorage.getItem("prodID");
        }
    }
    // Adquiere el JSON del producto elegido
    getJSONData(PRODUCT_INFO_URL + currentProdID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductInfo = resultObj.data
            // Muestra el producto y los productos relacionados
            showProductInfo()
        }
    });
    // Adquiere el JSON de los comentarios de JaP
    getJSONData(PRODUCT_INFO_COMMENTS_URL + currentProdID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCommentsArray = resultObj.data
        }
    }).then(function () {
        // Adquiere el Array de commentarios en Firebase
        return adquiereComentariosFirebase(currentProdID)
    }).then(function (firebaseArrayComments) {
        // Combina los comentarios
        firebaseArrayComments.forEach(elemento => currentCommentsArray.push(elemento));
    }).then(function () {
        // Muestra los comentarios
        sortAndShowComments(ORDER_ASC_BY_DATE)
    });
};

// Ordena y muestra los comentarios
function sortAndShowComments(sortCriteria, commentsArray) {
    currentSortCriteria = sortCriteria;

    if (commentsArray != undefined) {
        currentCommentsArray = commentsArray;
    }

    currentCommentsArray = sortComments(currentSortCriteria, currentCommentsArray);

    // Muestro los comentarios ordenadas
    showCommentsList();
}

// Limpia campos de filtros de los comentarios
function limpiarFiltrosComentarios() {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    document.getElementById("buscarTexto").value = "";

    minCount = undefined;
    maxCount = undefined;
    textoParaBuscar = undefined;

    showCommentsList();
}

// Espera a que se encuentran todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Descarga la informacion de los Productos y Comentarios y llama a las funciones que los muestran
    adquiereProductoComentarios();

    // Eventos de escucha de clic en los botones para filtrar comentarios
    document.getElementById("sortAscByDate").addEventListener("click", function () {
        sortAndShowComments(ORDER_ASC_BY_DATE);
    });
    document.getElementById("sortDescByDate").addEventListener("click", function () {
        sortAndShowComments(ORDER_DESC_BY_DATE);
    });
    document.getElementById("sortAscByScore").addEventListener("click", function () {
        sortAndShowComments(ORDER_ASC_BY_SCORE);
    });
    document.getElementById("sortDescByScore").addEventListener("click", function () {
        sortAndShowComments(ORDER_DESC_BY_SCORE);
    });

    // Vacía los valores establecidos en el filtro de rango de calificaciones
    document.getElementById("clearRangeFilter").addEventListener("click", limpiarFiltrosComentarios);
    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        // Obtengo el mínimo y máximo de los intervalos para filtrar por puntaje en los cometarios del producto
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }
        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }
        showCommentsList();
    });

    document.getElementById("enviarComentario").addEventListener("click", enviaComentarioFirebase);

    // Escucha la entrada de texto en el campo buscar de los comentarios
    document.getElementById("buscarTexto").addEventListener("input", function () {
        textoParaBuscar = document.getElementById("buscarTexto").value;
        if ((textoParaBuscar != undefined) && (textoParaBuscar != "")) {
            textoParaBuscar = textoParaBuscar.toLowerCase();
        }
        else {
            textoParaBuscar = undefined;
        }
        showCommentsList();
    });

});