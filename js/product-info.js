let currentProductInfo = [];
let currentCommentsArray = [];

// Crea el contenido HTML que muestra el currentProductInfoo
function showProductInfo() {

    let htmlContentToAppend = "";
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
                        <img class="bd-placeholder-img card-img-top" src="${currentProductInfo.images[0]}"
                            alt="Imagen de ${currentProductInfo.name}">
                    </div>
                    <div class="row">
                        <div class="col-4 mt-1">
                            <img src="${currentProductInfo.images[1]}" data-mdb-img="${currentProductInfo.images[1]}"
                                alt="Imagen 2 de ${currentProductInfo.name}" class="img-thumbnail" />
                        </div>
                        <div class="col-4 mt-1">
                            <img src="${currentProductInfo.images[2]}" data-mdb-img="${currentProductInfo.images[2]}"
                                alt="Imagen 3 de ${currentProductInfo.name}" class="img-thumbnail" />
                        </div>
                        <div class="col-4 mt-1">
                            <img src="${currentProductInfo.images[3]}" data-mdb-img="${currentProductInfo.images[3]}"
                                alt="Imagen 4 de ${currentProductInfo.name}" class="img-thumbnail" />
                    </div>
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
                        <div class="text-muted"><span>Cantidad vendidos: ${currentProductInfo.soldCount}</span></div>
                        <div> <span> Precio: ${currentProductInfo.currency}
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
                        <div class="col-md-6">
                            <div class="card mb-4 shadow-sm custom-card cursor-active">
                                <img class="card-img-top"
                                    src="${currentProductInfo.relatedProducts[0].image}"
                                    alt="Imagen de ${currentProductInfo.relatedProducts[0].name}">
                                <h3 class="m-3">${currentProductInfo.relatedProducts[0].name}</h3>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-4 shadow-sm custom-card cursor-active">
                                <img class="card-img-top"
                                    src="${currentProductInfo.relatedProducts[1].image}"
                                    alt="Imagen de ${currentProductInfo.relatedProducts[1].name}">
                                <h3 class="m-3">${currentProductInfo.relatedProducts[1].name}</h3>
                            </div>
                        </div>
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

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    if (localStorage.getItem("prodID") === null) {
        alert("Debe seleccionar un currentProductInfoo");
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
});