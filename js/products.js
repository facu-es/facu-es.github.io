const ORDER_ASC_BY_PRICE = "Precio_Ascendente";
const ORDER_DESC_BY_PRICE = "Precio_Descendente";
const ORDER_DESC_BY_RELEVANCE = "Relevancia";

// Variables para filtros
let minCount = undefined;
let maxCount = undefined;
let textoParaBuscar = undefined;
let currentSortCriteria = undefined;

// Variables para datos
let currentProductsArray = [];

// Ordena los elementos del array recibido
// Cuando se define criterio la funcion de comparacion adecuada es utilizada
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) { return -1; }
            if (aCost < bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_RELEVANCE) {
        result = array.sort(function (a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount) { return -1; }
            if (aSoldCount < bSoldCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// Guarda el ID del producto elegido en el Almacenamiento Local
function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

// Crea el contenido HTML que muestra los productos
function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount)) &&
            ((textoParaBuscar == undefined || textoParaBuscar == '') || (product.name.toLowerCase().includes(textoParaBuscar) || product.description.toLowerCase().includes(textoParaBuscar))) ) {

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

// Ordena y muestra los productos
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    // Si se establece un Array como parámetro lo guarda en la variable global currentProductsArray
    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    // Remplaza el contenido en currentProductsArray con el listado ordenado bajo el criterio elegido
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    // Muestra los productos ordenados
    showProductsList();
}

// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Verifica que se haya elegido una categoría
    let currentCategoryID = localStorage.getItem("catID");
    
    // Si no fue elegida ninguna redirige a categories
    if (currentCategoryID === null) {
        alert("Debe elegir una categoría");
        window.location.href = "categories.html";
        return
    }
    
    // Descarga la información de los Productos y llama a la funcion que los muestra
    getJSONData(PRODUCTS_URL + currentCategoryID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products

            // Agrega el texto para el título de la página
            document.getElementById('titulo-productos').innerHTML = "Verás aquí todos los productos de la categoría " + resultObj.data.catName;
            
            // Muestra los productos recibidos
            showProductsList()
        }

    });

    // Eventos de escucha de clic en los botones para ordenar productos
    document.getElementById("sortAscByPrice").addEventListener("click", function () {sortAndShowProducts(ORDER_ASC_BY_PRICE);});
    document.getElementById("sortDescByPrice").addEventListener("click", function () {sortAndShowProducts(ORDER_DESC_BY_PRICE);});
    document.getElementById("sortByRelevance").addEventListener("click", function () {sortAndShowProducts(ORDER_DESC_BY_RELEVANCE);});

    // Vacía los valores establecidos en el filtro de rango de cantidad de productos
    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
        document.getElementById("buscarTexto").value = "";

        minCount = undefined;
        maxCount = undefined;
        textoParaBuscar = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio de productos
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

        showProductsList();
    });

    // Escucha la entrada de texto en el campo buscar de los productos
    document.getElementById("buscarTexto").addEventListener("input", function () {
        textoParaBuscar = document.getElementById("buscarTexto").value;

        if ((textoParaBuscar != undefined) && (textoParaBuscar != "")) {
            textoParaBuscar = textoParaBuscar.toLowerCase();
        }
        else {
            textoParaBuscar = undefined;
        }

        showProductsList();
    });

});