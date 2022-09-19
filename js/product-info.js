let currentProductInfo = [];
let currentCommentsArray = [];


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
    // NOTA para mi: Podria haber utilizado la notacion hardcodeada de no ser porque un solo producto contiene 5 imagenes
    // aunque no está representadas en el JSON entregado por el servidor.
    for (let i = 0; i < currentProductInfo.images.length; i++) {
        imagenesProducto += `
                        <div onmouseover="setPrincipalImage('${currentProductInfo.images[i]}')" class="col-3 mt-1">
                            <img src="${currentProductInfo.images[i]}" data-mdb-img="${currentProductInfo.images[i]}"
                                alt="Imagen ${i} de ${currentProductInfo.name}" class="img-thumbnail" />
                        </div>
        `;
    }

    // Construye html con los productos relacionados del producto
    // NOTA para mi: Podria haber utilizado la notacion hardcodeada de no ser porque la API no define explicitamente
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

        // TO DO:
        // Se mantiene este loque para agregar funciones de filtrado a los comentarios

        //        if (((minCount == undefined) || (minCount != undefined && parseInt(comment.productCount) >= minCount)) &&
        //            ((maxCount == undefined) || (maxCount != undefined && parseInt(comment.productCount) <= maxCount)) &&
        //            ((textoParaBuscar == undefined || textoParaBuscar == '') || (comment.name.toLowerCase().includes(textoParaBuscar) || comment.description.toLowerCase().includes(textoParaBuscar)))) {

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
                  <span>Fecha: </span>${moment(comment.dateTime, moment.ISO_8601).format('LL [a las] LTS')}
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

    document.getElementById("comentarios").innerHTML = htmlContentToAppend;
}

function adquiereProductoComentarios() {
    if (localStorage.getItem("prodID") === null) {
        alert("Debe seleccionar un producto");
    } else {
        getJSONData(PRODUCT_INFO_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentProductInfo = resultObj.data
                // Muestra el producto y el producto relacionado
                showProductInfo()
            }
        });

        // Adquiere el JSON de los Comentarios
        getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("prodID") + EXT_TYPE).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentCommentsArray = resultObj.data
                // Muestra los comentarios
                showCommentsList()
            }
        });
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    adquiereProductoComentarios();
});