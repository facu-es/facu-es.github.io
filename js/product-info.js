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

// Actualiza el valor del producto elegido en el Almacen Local del navegador
function setProdID(id) {
    localStorage.setItem("prodID", id);
    adquiereProductoComentarios();
}

function setPrincipalImage(imagen) {
    document.getElementById("imagen-principal").src = imagen;
}

// Crea el contenido HTML que muestra el currentProductInfoo
function showProductInfo() {
    let imagenesProducto = "";
    let relacionadosProducto = "";
    let htmlContentToAppend = "";



    // Construye html con las imagenes del producto
    // NOTA: Podria haber utilizado la notacion hardcodeada de no ser porque un solo producto contiene 5 imagenes
    // aunque no están representadas en el JSON entregado por el servidor.
    for (let i = 0; i < currentProductInfo.images.length; i++) {
        imagenesProducto += `
                        <div onmouseover="setPrincipalImage('${currentProductInfo.images[i]}')" class="col-3 mt-1">
                            <img src="${currentProductInfo.images[i]}" data-mdb-img="${currentProductInfo.images[i]}"
                                alt="Imagen ${i} de ${currentProductInfo.name}" class="img-thumbnail" />
                        </div>
        `;
    }

    // Construye html con los productos relacionados del producto
    // NOTA: Podria haber utilizado la notacion hardcodeada de no ser porque la API no define explicitamente
    // que solo se presenten dos relacionados, aunque ese ha sido el caso
    for (let i = 0; i < currentProductInfo.relatedProducts.length; i++) {
        relacionadosProducto += `
                            <div onclick="setProdID(${currentProductInfo.relatedProducts[i].id})" class="col-md-6">
                                <div class="card mb-4 shadow-sm custom-card cursor-active">
                                    <img class="card-img-top"
                                        src="${currentProductInfo.relatedProducts[i].image}"
                                        alt="Imagen de ${currentProductInfo.relatedProducts[i].name}">
                                    <h3 class="m-3">${currentProductInfo.relatedProducts[i].name}</h3>
                                </div>
                            </div>
                            `
    }

    htmlContentToAppend += `
    <div class="row mt-4">
        <div class="row row-underline">
            <div class="text-center p-4"> <h2>${currentProductInfo.name}</h2></div>
            </div>
        </div>
    <div class="container-fluid">
        <div class="row">
            <div class="row mt-2 mb-2">
                <div class="col-md-6">
                    <div class="card mb-4 shadow-sm custom-card cursor-active">
                        <img class="bd-placeholder-img card-img-top" src="${currentProductInfo.images[0]}" id="imagen-principal"
                            alt="Imagen principal de ${currentProductInfo.name}">
                    </div>
                    <div class="row">
                        ${imagenesProducto}
                    </div>
                </div>
                <div class="col-md-6">
                    <div>
                        <nav>
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="categories.html">Categorias</a></li>
                                <li class="breadcrumb-item"><a href="products.html#">${currentProductInfo.category}</a>
                                </li>
                                <li class="breadcrumb-item active">${currentProductInfo.name}</li>
                            </ol>
                        </nav>
                        <hr class="singleline">
                        <div><span class="fw-bold">Cantidades vendidas:</span> <span>${currentProductInfo.soldCount}</span></div>
                        <div> <span class="fw-bold">Precio: </span><span>${currentProductInfo.currency}
                                ${currentProductInfo.cost}</span> </div>
                        <hr class="singleline">
                        <div> <span>${currentProductInfo.description}<span><br>
                        </div>
                    </div>
                </div>

                    <!-- Productos relacionados -->
                    <div class="row mt-4">
                        <div class="row row-underline">
                            <div class="col-md-6"> <h3>Productos relacionados</h3></div>
                        </div>
                    </div>
                    <div class="row mt-2 mb-2">
                        ${relacionadosProducto}
                    </div>
                    <!-- Comentarios -->
                    <div class="row">
                        <div class="row row-underline">
                            <div class="col-md-6"> <h3>Comentarios</h3></div>
                        </div>
                    </div>
                </div>
            </div>
        `
    document.getElementById("producto-principal").innerHTML = htmlContentToAppend;
    setPrincipalImage(currentProductInfo.images[0]);
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
                  <span>Fecha: </span>${moment(comment.dateTime, moment.ISO_8601).format('LL [, ] LTS')}
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

function adquiereProductoComentarios() {
    if (localStorage.getItem("prodID") === null) {
        alert("Debe seleccionar un producto");
    } else {
        // Guarda en la variable global el id del producto actual
        currentProdID = localStorage.getItem("prodID");

        getJSONData(PRODUCT_INFO_URL + currentProdID + EXT_TYPE).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentProductInfo = resultObj.data
                // Muestra el producto y los productos relacionados
                showProductInfo()
            }
        });

        // Adquiere el JSON de los Comentarios de JaP
        getJSONData(PRODUCT_INFO_COMMENTS_URL + currentProdID + EXT_TYPE).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentCommentsArray = resultObj.data
            }
        }).then(function () {
            // Adquiere el Array de Commentarios en Firebase
            return adquiereComentariosFirebase(currentProdID)
        }).then(function (firebaseArrayComments) {
            // Combina los comentarios
            firebaseArrayComments.forEach(elemento => currentCommentsArray.push(elemento));
        }).then(function () {
            // Muestra los comentarios
            sortAndShowComments(ORDER_ASC_BY_DATE)
        });
    }
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

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Descarga la informacion de los Productos y Comentarios y llama a las funciones que los muestran
    adquiereProductoComentarios();

    // Al llamar a esta funcion no se le pasa el parámetro commentsArray
    // ya que este fue inicializado con la escucha del evento "DOMContentLoaded"
    // en la variable global currentCommentsArray y la funcion utiliza ese por defecto
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
        // Obtengo el mínimo y máximo de los intervalos para filtrar por puntaje
        // en los cometarios del producto
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
