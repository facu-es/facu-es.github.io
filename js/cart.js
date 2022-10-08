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

// Gestiona el incremento de un Item
function aumentaCantidad(itemID) {
    // Actualiza la cantidad en el Array de Items
    currentCartListArray[itemID].count = Math.round(parseInt(currentCartListArray[itemID].count) + 1);

    // Actualiza cantidad en Firebase si el objeto contiene un ID de Objeto de Firebase
    if(currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, currentCartListArray[itemID].count);
    }
    
    // Muestra los valores actualizados
    showCartListInfo()
}

// Gestiona el decremento de un Item
function reduceCantidad(itemID) {
    // Actualiza la cantidad en el Array de Items
    currentCartListArray[itemID].count = Math.round(parseInt(currentCartListArray[itemID].count) - 1);

    // Actualiza cantidad en Firebase si el objeto contiene un ID de Objeto de Firebase
    if(currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, currentCartListArray[itemID].count);
    }

    // Muestra los valores actualizados
    showCartListInfo()
}

// Actualiza la cantidad en el Array de Items
function actualizaCantidad(itemID, cantidad) {
    // Define el parámetro como la cantidad de producto
    currentCartListArray[itemID].count = Math.round(cantidad);

    // Actualiza cantidad en Firebase
    if(currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, Math.round(cantidad));
    }

    // Muestra los valores actualizados
    showCartListInfo()
}

// Elimina un elemento del carrito, propaga el cambio a Firebase y actualiza la lista de items en pantalla
function quitarDelCarrito(itemID) {
    // Elimina item en Firebase si el objeto contiene un ID de Objeto de Firebase
    if(currentCartListArray[itemID].hasOwnProperty('fid')) {
        eliminarElementoCarrito(currentCartListArray[itemID].fid);
    }

    // Elimina item en Array actual
    currentCartListArray.splice(itemID, 1)

    // Actualiza la vista de elementos del carrito
    showCartListInfo();
}

// Crea el contenido HTML del carrito partiendo de currentCartListArray
function showCartListInfo() {
    // Inicializa constantes para formato de valores monetarios
    const moneda_formato_usd = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'USD' });
    const moneda_formato_uyu = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' });

    // Inicializa variable para los datos HTML a mostrar
    let carritoElementosHTML = "";

    // Inicializa variables para calcular cantidades numericas
    let subtotalArticulosPesos = 0;
    let subtotalArticulosDolares = 0;
    let costoEnvioArticulosPesos = 0;
    let costoEnvioArticulosDolares = 0;
    let totalPesos = 0;
    let totalDolares = 0;

    // Construye HTML con los productos del listado del carrito
    for (let i = 0; i < currentCartListArray.length; i++) {
        // Item actual del recorrido por el Array
        const articulo = currentCartListArray[i];
        
        // Suma de costos totales en Pesos y Dólares y configuracion de formato para cada costo individual
        if(articulo.currency === 'USD') {
            // Suma de todos los valores
            subtotalArticulosDolares += articulo.count * articulo.unitCost;
            
            // Valores calculados para el elemento a mostrar
            costoArticulo = moneda_formato_usd.format(articulo.unitCost);
            subtotalArticulo = moneda_formato_usd.format(articulo.count * articulo.unitCost);
        } else {
            // Suma de todos los valores
            subtotalArticulosPesos += articulo.count * articulo.unitCost;

            // Valores calculados para el elemento a mostrar
            costoArticulo = moneda_formato_uyu.format(articulo.unitCost);
            subtotalArticulo = moneda_formato_uyu.format(articulo.count * articulo.unitCost);
        }

        // Solo construye HTML para los elementos a mostrar
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
                            onclick="reduceCantidad(${i})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input name="cantidad" value="${articulo.count}" type="number"
                            onchange="actualizaCantidad(${i}, this.value)" class="form-control form-control-sm cantidad-producto" min="0" />
                        <button class="btn btn-link border px-2"
                            onclick="aumentaCantidad(${i})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="align-middle">
                    <p class="mb-0" name="costoUnidad">${costoArticulo}</p>
                </td>
                <td class="align-middle">
                    <p class="mb-0" name="subtotal">${subtotalArticulo}</p>
                </td>
                <td class="align-middle">
                    <button class="btn btn-link border px-2" onclick="quitarDelCarrito('${i}')">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            <tr>
            `
            }
    }

    // Calcula costo de envío
    if (document.getElementById("envioPremium").checked) {
        // Calcula costos para el envío Premium (15 %)
        costoEnvioArticulosPesos = Math.round(subtotalArticulosPesos * 0.15);
        costoEnvioArticulosDolares = Math.round(subtotalArticulosDolares * 0.15);
    } else if (document.getElementById("envioExpress").checked) {
        // Calcula costos para el envío Express (7 %)
        costoEnvioArticulosPesos = Math.round(subtotalArticulosPesos * 0.07);
        costoEnvioArticulosDolares = Math.round(subtotalArticulosDolares * 0.07);
    } else if (document.getElementById("envioStandard").checked) {
        // Calcula costos para el envío Standard (5 %)
        costoEnvioArticulosPesos = Math.round(subtotalArticulosPesos * 0.05);
        costoEnvioArticulosDolares = Math.round(subtotalArticulosDolares * 0.05);
    }

    // Calcula costo total
    totalPesos = subtotalArticulosPesos + costoEnvioArticulosPesos;
    totalDolares = subtotalArticulosDolares + costoEnvioArticulosDolares;

    // Inserta HTML dentro de los identificadores correspondientes desde DOM
    document.getElementById("lista-carrito").innerHTML = carritoElementosHTML;
    document.getElementById("carrito-subtotal-pesos").innerHTML = moneda_formato_uyu.format(subtotalArticulosPesos);
    document.getElementById("carrito-subtotal-dolares").innerHTML = moneda_formato_usd.format(subtotalArticulosDolares);
    document.getElementById("carrito-costo-envio-pesos").innerHTML = moneda_formato_uyu.format(costoEnvioArticulosPesos);
    document.getElementById("carrito-costo-envio-dolares").innerHTML = moneda_formato_usd.format(costoEnvioArticulosDolares);
    document.getElementById("carrito-costo-total-pesos").innerHTML = moneda_formato_uyu.format(totalPesos);
    document.getElementById("carrito-costo-total-dolares").innerHTML = moneda_formato_usd.format(totalDolares);
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

    // Escucha cambios en la seleccion del tipo de envio
    document.getElementById("envioPremium").addEventListener("change", showCartListInfo);
    document.getElementById("envioExpress").addEventListener("change", showCartListInfo);
    document.getElementById("envioStandard").addEventListener("change", showCartListInfo);
});