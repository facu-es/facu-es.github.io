// Variables de ordenamiento
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_COUNT = "Cantidad";
let currentSortCriteria = undefined

// Variables para filtros
let minCount = undefined;
let maxCount = undefined;
let textoParaBuscar = undefined;

// Variables para datos
let currentUserID = undefined;
let currentCartListArray = [];
let firebaseCartListArray = [];

// Ordena los elementos del array recibido
// Cuando se define criterio la función de comparación adecuada es utilizada
function sortCartList(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.count);
            let bCount = parseInt(b.count);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// Crea el contenido HTML del carrito partiendo de currentCartListArray
function showCartListInfo() {
    let carritoElementosHTML = "";
    let subtotalArticulosPesos = 0;
    let subtotalArticulosDolares = 0;

    // Construye HTML con los productos del listado del carrito
    for (let i = 0; i < currentCartListArray.length; i++) {
        const articulo = currentCartListArray[i];
        
        if(articulo.currency === 'USD') {
            subtotalArticulosDolares += articulo.unitCost
        } else {
            subtotalArticulosPesos += articulo.unitCost
        }

        if (
            textoParaBuscar === undefined ||
            textoParaBuscar === '' ||
            articulo.name.toLowerCase().includes(textoParaBuscar) ||
            articulo.currency.toLowerCase().includes(textoParaBuscar)
        ) {

            carritoElementosHTML += `
            <tr>
                <th scope="row">
                    <div class="d-flex align-items-center">
                        <img src="${articulo.image}" class="img-fluid rounded-3" style="width: 120px;" alt="Imagen de ${articulo.name}">
                        <div class="flex-column ms-4">
                            <p class="mb-2">${articulo.name}</p>
                        </div>
                    </div>
                </th>
                <td class="align-middle">
                    <div class="d-flex flex-row">
                        <button class="btn btn-link border px-2"
                            onclick="this.parentNode.querySelector('input[name=cantidad]').stepDown(); this.parentNode.parentNode.parentNode.querySelector('p[name=subtotal]').innerHTML=this.parentNode.querySelector('input[name=cantidad]').value * this.parentNode.parentNode.parentNode.querySelector('p[name=costoUnidad]').innerHTML; currentCartListArray[${i}].count = this.parentNode.querySelector('input[name=cantidad]').value">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input id="form1" name="cantidad" value="${articulo.count}" type="number"
                            class="form-control form-control-sm" min="0" style="width: 50px;" />
                        <button class="btn btn-link border px-2"
                            onclick="this.parentNode.querySelector('input[name=cantidad]').stepUp(); this.parentNode.parentNode.parentNode.querySelector('p[name=subtotal]').innerHTML=this.parentNode.querySelector('input[name=cantidad]').value * this.parentNode.parentNode.parentNode.querySelector('p[name=costoUnidad]').innerHTML; currentCartListArray[${i}].count = this.parentNode.querySelector('input[name=cantidad]').value">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="align-middle">
                    <p class="mb-0" name="costoUnidad">${articulo.unitCost}</p>
                </td>
                <td class="align-middle">
                    <p class="mb-0">${articulo.currency}</p>
                </td>
                <td class="align-middle">
                    <p class="mb-0" name="subtotal">${articulo.count * articulo.unitCost}</p>
                </td>
                <td class="align-middle">
                    <button class="btn btn-link border px-2" onclick="quitarDelCarrito('${articulo.fid}')">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            <tr>
            `
            }
    }

    // Subtotal en Pesos
    console.log(subtotalArticulosPesos);

    // Subtotal en Dolares
    console.log(subtotalArticulosDolares);

    // Inserta HTML dentro de los identificadores correspondientes desde DOM
    document.getElementById("lista-carrito").innerHTML = carritoElementosHTML;
}

// Adquiere el listado de productos en el carrito desde JSON de JaP y Firebase
function adquiereCarritoCompras(userID) {
    // Solo existe un carrito en JaP
    // lo aplicaremos para todos los usuarios
    currentUserID = 25801;

    // Adquiere el JSON del producto elegido
    getJSONData(CART_INFO_URL + currentUserID + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCartListArray = resultObj.data.articles;
        }
    })
        .then(function () {
            // Adquiere el Carrito desde Firebase
            return adquiereCarritoFirebase(userID)
        }).then(function (firebaseArrayCarrito) {
            // Combina los productos
            firebaseArrayCarrito.forEach(elemento => currentCartListArray.push(elemento))
        }).then(function () {
            // Muestra los productos
            sortAndShowCartList(ORDER_ASC_BY_NAME)
        });
};

// Ordena y muestra los productos
function sortAndShowCartList(sortCriteria, cartListArray) {
    currentSortCriteria = sortCriteria;

    if (cartListArray != undefined) {
        currentCartListArray = cartListArray;
    }

    currentCartListArray = sortCartList(currentSortCriteria, currentCartListArray);

    // Muestro el carrito del usuario
    showCartListInfo();
}

// Elimina un elemento del carrito, propaga el cambio a Firebase y actualiza la lista de items en pantalla
function quitarDelCarrito(firebaseID) {
    console.log(currentCartListArray.findIndex(elemento => elemento.fid === firebaseID));
    
    // Elimina item en array actual
    currentCartListArray.splice(currentCartListArray.findIndex(elemento => elemento.fid === firebaseID), 1)

    // Elimina item en Firebase
    eliminarElementoCarrito(firebaseID);

    // Actualiza la vista de elementos del carrito
    showCartListInfo();
}


// Espera a que se encuentren todos los elementos HTML cargados en el DOM.
document.addEventListener("DOMContentLoaded", function (e) {
    // Descarga el carrito de compras del usuario y llama a la funcion que lo muestra
    adquiereCarritoCompras(usuarioActual.uid);

    // Escucha de eventos para funciones de filtrado
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCartList(ORDER_ASC_BY_NAME);
    });
    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCartList(ORDER_DESC_BY_NAME);
    });
    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCartList(ORDER_BY_COUNT);
    });

    // Escucha de evento para funcion de busqueda
    document.getElementById("buscarTexto").addEventListener("input", function () {
        textoParaBuscar = document.getElementById("buscarTexto").value;
        if ((textoParaBuscar != undefined) && (textoParaBuscar != "")) {
            textoParaBuscar = textoParaBuscar.toLowerCase();
        } else {
            textoParaBuscar = undefined;
        }
        showCartListInfo();
    });

//    // Escucha de evento de cambio sobre los campos de los item del producto
//    document.getElementsByClassName("productCountInput").addEventListener("change", function(){
//        productCount = this.value;
//        updateTotalCosts();
//    });
//
//    document.getElementById("productcount").addEventListener("change", function() {
//        this.parentNode.parentNode.parentNode.querySelector('p[name=subtotal]').innerHTML=this.parentNode.querySelector('input[name=cantidad]').value * this.parentNode.parentNode.parentNode.querySelector('p[name=costoUnidad]').innerHTML;
//        
//        currentCartListArray[].count = this.parentNode.querySelector('input[name=cantidad]').value
//        updateTotalCosts();
//    });
//
//    document.getElementById("goldradio").addEventListener("change", function(){
//        comissionPercentage = 0.13;
//        updateTotalCosts();
//    });
//    
//    document.getElementById("premiumradio").addEventListener("change", function(){
//        comissionPercentage = 0.07;
//        updateTotalCosts();
//    });
//
//    document.getElementById("standardradio").addEventListener("change", function(){
//        comissionPercentage = 0.03;
//        updateTotalCosts();
//    });
//
//    document.getElementById("productCurrency").addEventListener("change", function(){
//        if (this.value == DOLLAR_CURRENCY)
//        {
//            MONEY_SYMBOL = DOLLAR_SYMBOL;
//        } 
//        else if (this.value == PESO_CURRENCY)
//        {
//            MONEY_SYMBOL = PESO_SYMBOL;
//        }
//
//        updateTotalCosts();
//    });
});