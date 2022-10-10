// Variables de ordenamiento
const ORDER_ASC_BY_DATE = "Fecha_Ascendente";
const ORDER_DESC_BY_DATE = "Fecha_Descendente";
const ORDER_ASC_BY_SCORE = "Calificacion_Ascendente";
const ORDER_DESC_BY_SCORE = "Calificacion_Descendente";

// Variables para filtros
let minCount = undefined;
let maxCount = undefined;
let textoParaBuscar = undefined;
let textoComentario = "";
let puntosComentario = "";

// Variables para datos
let currentProdID = undefined;
let currentProductInfo = [];
let currentCommentsArray = [];
let firebaseCommentsArray = [];

// Ordena los elementos del array recibido
// Cuando se define criterio la función de comparación adecuada es utilizada
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

// Ordena y muestra los comentarios
function sortAndShowComments(sortCriteria, commentsArray) {
    currentSortCriteria = sortCriteria;

    // Si se establece un Array como parámetro lo guarda en la variable global currentCommentsArray
    if (commentsArray != undefined) {
        currentCommentsArray = commentsArray;
    }

    // Remplaza el contenido en currentCommentsArray con el listado ordenado bajo el criterio elegido
    currentCommentsArray = sortComments(currentSortCriteria, currentCommentsArray);

    // Muestra los comentarios ordenados
    showCommentsList();
}

// Crea el contenido HTML del producto partiendo de currentProductInfo
function showProductInfo() {
    let carrouselElementosHTML = "";
    let carrouselIndicadoresHTML = "";
    let relacionadosProductoHTML = "";
    let detallesProductoHTML = "";

    // Construye HTML con las imágenes del producto
    // NOTA: Podría haber utilizado la notación directa de no ser porque un solo producto contiene 5 imágenes
    // aunque no están representadas en el JSON entregado por el servidor.

    for (let i = 0; i < currentProductInfo.images.length; i++) {
        if (i === 0) {
            carrouselElementosHTML += `<div class="carousel-item active"><img src="${currentProductInfo.images[i]}" class="d-block w-100" alt="Imagen ${i + 1} de ${currentProductInfo.name}"></div>`;
            carrouselIndicadoresHTML += `<button type="button" data-bs-target="#indicadorImagen" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Imagen ${i + 1} de ${currentProductInfo.name}"></button>`;
        } else {
            carrouselElementosHTML += `<div class="carousel-item"><img src="${currentProductInfo.images[i]}" class="d-block w-100" alt="Imagen ${i + 1} de ${currentProductInfo.name}"></div>`;
            carrouselIndicadoresHTML += `<button type="button" data-bs-target="#indicadorImagen" data-bs-slide-to="${i}" aria-label="Imagen ${i + 1} de ${currentProductInfo.name}"></button>`;
        }
    };

    // Construye HTML con los productos relacionados al producto principal
    // NOTA: Podría haber utilizado la notación directa de no ser porque la API no define explícitamente
    // que solo se presenten dos relacionados, aunque ese ha sido el caso.
    
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

    // Crea el contenido en HTML de los detalles del producto
    detallesProductoHTML = `
    <div><span class="fw-bold fs-6">Cantidades vendidas:</span> <span>${currentProductInfo.soldCount}</span></div>
    <div><span class="fw-bold fs-6">Precio: </span><span>${currentProductInfo.currency} ${currentProductInfo.cost}</span></div>
    <hr class="singleline">
    <span class="fst-italic text-center text-wrap text-break fs-5">${currentProductInfo.description}</span>
    `

    // Inserta HTML dentro de los identificadores correspondientes desde DOM
    document.getElementById("nombreProducto").innerHTML = currentProductInfo.name;
    document.getElementById("carrouselIndicadores").innerHTML = carrouselIndicadoresHTML;
    document.getElementById("carrouselElementos").innerHTML = carrouselElementosHTML;
    document.getElementById("relacionadosProducto").innerHTML = relacionadosProductoHTML;
    document.getElementById("categoriaActual").innerHTML = currentProductInfo.category;
    document.getElementById("productoActual").innerHTML = currentProductInfo.name;
    document.getElementById("detallesProducto").innerHTML = detallesProductoHTML;
}

// Crea el contenido en HTML de los comentarios
function showCommentsList() {
    // Variable para almacenar los comentarios a mostrar en este llamado
    let htmlContentToAppend = "";

    // Establece idioma para los textos calculados de fecha por moments.js
    moment.locale('es');

    for (let i = 0; i < currentCommentsArray.length; i++) {
        let comment = currentCommentsArray[i];

        // Funciones de filtrado a los comentarios
        if (((minCount == undefined) || (minCount != undefined && parseInt(comment.score) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(comment.score) <= maxCount)) &&
            // El campo de búsqueda coincide por texto en nombre de usuario y comentario
            ((textoParaBuscar == undefined || textoParaBuscar == '') || (comment.user.toLowerCase().includes(textoParaBuscar) || comment.description.toLowerCase().includes(textoParaBuscar)))) {

            // Construye menú de edicion de comentario
            if(comment.fid !== null && comment.user === usuarioActual.nid && !comment.eliminado) {
                bloqueEdicionComentario = `
                <a class="link-muted" href="javascript:actualizaComentarioFirebase('${comment.product}', '${i}', '${comment.fid}')"><i class="fas fa-pencil-alt ms-2"></i></a>
                <a class="link-muted" href="javascript:eliminaComentarioFirebase('${comment.product}', '${i}', '${comment.fid}')"><i class="fas fa-redo-alt ms-2"></i></a>
                `;
            } else {
                bloqueEdicionComentario = "";
            };

            // Avisa si el comentario fue eliminado
            if(comment.eliminado) {
                comment.description = `<span class="text-muted">-- Comentario eliminado el ${moment(comment.eliminado, moment.ISO_8601).format('LLLL')} --</span>`;
                comment.score = '0';
            }

            // Avisa si el comentario fue actualizado
            if(comment.actualizado && !comment.eliminado) {
                comment.description = `<span class="text-muted">-- Comentario actualizado el ${moment(comment.actualizado, moment.ISO_8601).format('LLLL')} --</span><br /><br />${comment.description}`;
            }
            
            htmlContentToAppend += `
            <div class="card-body p-4">
                <div class="d-flex flex-start">
                    <img class="rounded-circle shadow-1-strong me-3" src="img/img_perfil.png" alt="avatar" width="60" height="60" />
                    <div>
                        <h6 class="fw-bold mb-1">${comment.user}</h6>
                        <div class="d-flex align-items-center mb-1">
                            <p class="mb-0 fst-italic"><span class="fst-italic">Fecha: </span>${moment(comment.dateTime, moment.ISO_8601).format('LLLL')}</p>
                            ${bloqueEdicionComentario}
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <span class="fst-italic">Calificación: </span>
                            <div class="star-ratings-sprite ms-2"><span style="width:${
                // Con las siguientes clases de CSS se define una superposición de dos conjuntos de cinco estrellas
                // el de abajo con estrellas grises, y el de arriba con estrellas amarillas.
                // La longitud de la extensión de las estrellas amarillas se define con la etiqueta style aplicada a span
                // Como el valor de extensión ( width ) es porcentual, se requiere un cambio de variable mediante el multiplicador 20
                // Como el máximo valor en comment.score es 5 con ese multiplicador se establece incluso la posibilidad de puntuaciones fraccionarias.
                comment.score * 20}%" class="star-ratings-sprite-rating"></span>
                            </div>
                        </div>
                        <p class="mb-0">${comment.description}</p>
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
    currentProdID = prodID;

    // Si no fue elegido ninguno redirige a products
    if (currentProdID === null || currentProdID === "" | currentProdID === undefined) {
        if (localStorage.getItem("prodID") === null) {
            alertaUsuario("Requisito incumplido", "Debe elegir un producto", "warning");
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
        // Adquiere el Array de comentarios en Firebase
        return adquiereComentariosFirebase(currentProdID)
    }).then(function (firebaseArrayComments) {
        // Combina los comentarios
        firebaseArrayComments.forEach(elemento => currentCommentsArray.push(elemento));
    }).then(function () {
        // Muestra los comentarios
        sortAndShowComments(ORDER_ASC_BY_DATE)
    });
};

// Limpia campos de filtros de los comentarios
function limpiarFiltrosComentarios() {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    document.getElementById("buscarTexto").value = "";

    minCount = undefined;
    maxCount = undefined;
    textoParaBuscar = undefined;

    // Muestra los comentarios
    showCommentsList();
}

// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Descarga la información de los Productos y Comentarios y llama a las funciones que los muestran
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

    // Eventos de escucha de clic en el botón para limpiar los valores establecidos los filtros
    document.getElementById("clearRangeFilter").addEventListener("click", limpiarFiltrosComentarios);

    // Eventos de escucha de clic en el botón para filtrar por los rangos establecidos
    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        // Obtiene intervalo mínimo y máximo definido para filtrar basado en puntaje de los comentarios del producto
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        } else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined;
        }
        showCommentsList();
    });

    // Eventos de escucha de clic en el botón para enviar comentario
    document.getElementById("enviarComentario").addEventListener("click", enviaComentarioFirebase);

    // Escucha la entrada de texto en el campo buscar de los comentarios
    document.getElementById("buscarTexto").addEventListener("input", function () {
        textoParaBuscar = document.getElementById("buscarTexto").value;
        if ((textoParaBuscar != undefined) && (textoParaBuscar != "")) {
            textoParaBuscar = textoParaBuscar.toLowerCase();
        } else {
            textoParaBuscar = undefined;
        }
        showCommentsList();
    });

});