// Variables de ordenamiento
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_COUNT = "Cantidad";
let currentSortCriteria = undefined

// Variables para filtros
let textoParaBuscar = undefined;

// Variables para datos
let currentUserID = undefined;
let currentCartListArray = [];
let firebaseCartListArray = [];

// Cotizacion de precios
const PESOS_POR_DOLAR = 41;

/*
// Inicializa el uso de Mercado Pago
const mp = new MercadoPago('TEST-d326b969-adb9-4767-98c2-84d3519a0f91', {
    locale: 'es-UY',
});

// Configuracion Mercado Pago
const cardForm = mp.cardForm({
    amount: '100.5',
    autoMount: true,
    processingMode: 'aggregator',
    form: {
        id: 'form-checkout',
        cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Cardholder name',
        },
        cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'Email',
        },
        cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: 'Card number',
        },
        expirationDate: {
            id: 'form-checkout__expirationDate',
            placeholder: 'MM/YYYY'
        },
        securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'CVV',
        },
        installments: {
            id: 'form-checkout__installments',
            placeholder: 'Total installments'
        },
        identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Document type'
        },
        identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Document number'
        },
        issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Issuer'
        }
    },
    callbacks: {
        onFormMounted: error => {
            if (error) return console.warn('Form Mounted handling error: ', error)
            console.log('Form mounted')
        },
        onFormUnmounted: error => {
            if (error) return console.warn('Form Unmounted handling error: ', error)
            console.log('Form unmounted')
        },
        onIdentificationTypesReceived: (error, identificationTypes) => {
            if (error) return console.warn('identificationTypes handling error: ', error)
            console.log('Identification types available: ', identificationTypes)
        },
        onPaymentMethodsReceived: (error, paymentMethods) => {
            if (error) return console.warn('paymentMethods handling error: ', error)
            console.log('Payment Methods available: ', paymentMethods)
        },
        onIssuersReceived: (error, issuers) => {
            if (error) return console.warn('issuers handling error: ', error)
            console.log('Issuers available: ', issuers)
        },
        onInstallmentsReceived: (error, installments) => {
            if (error) return console.warn('installments handling error: ', error)
            console.log('Installments available: ', installments)
        },
        onCardTokenReceived: (error, token) => {
            if (error) return console.warn('Token handling error: ', error)
            console.log('Token available: ', token)
        },
        onSubmit: (event) => {
            event.preventDefault();
            const cardData = cardForm.getCardFormData();
            console.log('CardForm data available: ', cardData)
        },
        onFetching:(resource) => {
            console.log('Fetching resource: ', resource)

            // Animate progress bar
            const progressBar = document.querySelector('.progress-bar')
            progressBar.removeAttribute('value')

            return () => {
                progressBar.setAttribute('value', '0')
            }
        },
        onError: (error, event) => {
            console.log(event, error);
        },
        onValidityChange: (error, field) => {
            if (error) return error.forEach(e => console.log(`${field}: ${e.message}`));
            console.log(`${field} is valid`);
        },
        onReady: () => {
            console.log("CardForm ready");
        }
    }
});
*/

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
};

// Gestiona el incremento de un Item
function aumentaCantidad(itemID) {
    // Aumenta la cantidad en 1, redondea al entero más cercano y se asegura de que el valor no crece por debajo de 0
    currentCartListArray[itemID].count = Math.max(Math.round(parseInt(currentCartListArray[itemID].count) + 1), 0);

    // Actualiza cantidad en Firebase si el objeto contiene un ID de Objeto de Firebase
    if (currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, currentCartListArray[itemID].count);
    }

    // Muestra los valores actualizados
    showCartListInfo()
};

// Gestiona el decremento de un Item
function reduceCantidad(itemID) {
    // Reduce la cantidad en 1, redondea al entero más cercano y se asegura de que el valor no cae por debajo de 0
    currentCartListArray[itemID].count = Math.max(Math.round(parseInt(currentCartListArray[itemID].count) - 1), 0);

    // Actualiza cantidad en Firebase si el objeto contiene un ID de Objeto de Firebase
    if (currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, currentCartListArray[itemID].count);
    }

    // Muestra los valores actualizados
    showCartListInfo()
};

// Actualiza la cantidad en el Array de Items
function actualizaCantidad(itemID, cantidad) {
    // Establece la cantidad en base al valor provisto, redondea al entero más cercano y se asegura de que el valor no se establece por debajo de 0
    currentCartListArray[itemID].count = Math.max(Math.round(parseInt(cantidad)), 0);

    // Actualiza cantidad en Firebase
    if (currentCartListArray[itemID].hasOwnProperty('fid')) {
        actualizaElementoCarrito(currentCartListArray[itemID].fid, Math.max(Math.round(parseInt(cantidad)), 0));
    }

    // Muestra los valores actualizados
    showCartListInfo()
};

// Elimina un elemento del carrito, propaga el cambio a Firebase y actualiza la lista de items en pantalla
function quitarDelCarrito(itemID) {
    // Elimina item en Firebase si el objeto contiene un ID de Objeto de Firebase
    if (currentCartListArray[itemID].hasOwnProperty('fid')) {
        eliminarElementoCarrito(currentCartListArray[itemID].fid);
    }

    // Elimina item en Array actual
    currentCartListArray.splice(itemID, 1)

    // Actualiza la vista de elementos del carrito
    showCartListInfo();
};

// Permite al usuario ver el producto del carrito mediante una redireccion
function verProducto(itemID) {
    localStorage.setItem("prodID", currentCartListArray[itemID].id);
    window.location = "product-info.html"
};

// Crea el contenido HTML del carrito partiendo de currentCartListArray
function showCartListInfo() {
    // Inicializa constantes para formato de valores monetarios
    const moneda_formato_usd = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'USD' });
    const moneda_formato_uyu = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' });

    // Inicializa variable para los datos HTML a mostrar
    let carritoElementosHTML = "";

    // Inicializa variables para calcular cantidades numéricas
    let subtotalArticulo = 0;
    let subtotalArticulos = 0;
    let subtotalArticulosPesos = 0;
    let subtotalArticulosDolares = 0;
    let costoEnvioArticulos = 0;
    let totalArticulos = 0;

    // Construye HTML con los productos del listado del carrito
    for (let i = 0; i < currentCartListArray.length; i++) {
        // Inicializa variable para almacenar objeto del producto actualmente iterado
        let articulo;

        // Se sanitizan los campos alterables
        articulo = {
            count: DOMPurify.sanitize(currentCartListArray[i].count, { USE_PROFILES: { html: true } }),
            unitCost: DOMPurify.sanitize(currentCartListArray[i].unitCost, { USE_PROFILES: { html: true } }),
            name: DOMPurify.sanitize(currentCartListArray[i].name, { USE_PROFILES: { html: true } }),
            image: DOMPurify.sanitize(currentCartListArray[i].image, { USE_PROFILES: { html: true } }),
            currency: DOMPurify.sanitize(currentCartListArray[i].currency, { USE_PROFILES: { html: true } }),
        }

        // Suma de costos totales en Pesos y Dólares y configuracion de formato para cada costo individual
        if (articulo.currency === 'USD') {
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

        // Solo construye HTML para los elementos a mostrar definidos por la función de búsqueda
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
                        <button class="btn btn-link mb-2" onclick="verProducto(${i})">${articulo.name}</button>
                        </div>
                    </div>
                </th>
                <td class="align-middle">
                <input value="${articulo.name}-${articulo.count}" name="compraprod" type="text" hidden required>
                    <div class="d-flex flex-row">
                        <button class="btn btn-link border px-2"
                            onclick="reduceCantidad(${i})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input value="${articulo.count}" type="number"
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

    // Consolida costos a dólares
    subtotalArticulos = subtotalArticulosDolares + (subtotalArticulosPesos / PESOS_POR_DOLAR);

    // Calcula costo de envío
    if (document.getElementById("envioPremium").checked) {
        // Calcula costos para el envío Premium (15 %)
        costoEnvioArticulos = Math.round(subtotalArticulos * 0.15);
    } else if (document.getElementById("envioExpress").checked) {
        // Calcula costos para el envío Express (7 %)
        costoEnvioArticulos = Math.round(subtotalArticulos * 0.07);
    } else if (document.getElementById("envioStandard").checked) {
        // Calcula costos para el envío Standard (5 %)
        costoEnvioArticulos = Math.round(subtotalArticulos * 0.05);
    }

    // Calcula costo total
    totalArticulos = subtotalArticulos + costoEnvioArticulos;

    // Inserta HTML dentro de los identificadores correspondientes desde DOM
    document.getElementById("lista-carrito").innerHTML = carritoElementosHTML;
    document.getElementById("carrito-subtotal").innerHTML = moneda_formato_usd.format(subtotalArticulos);
    document.getElementById("carrito-costo-envio").innerHTML = moneda_formato_usd.format(costoEnvioArticulos);
    document.getElementById("carrito-costo-total").innerHTML = moneda_formato_usd.format(totalArticulos);
};

// Ordena y muestra los productos
function sortAndShowCartList(sortCriteria, cartListArray) {
    // Se guarda en una variable global el criterio actual de ordenamiento
    currentSortCriteria = sortCriteria;

    // Si por parámetro se define un Array a ordenar, se asigna ese a la variable global
    if (cartListArray != undefined) {
        currentCartListArray = cartListArray;
    }

    // Guarda en la variable global el Array ordenado en base al criterio
    currentCartListArray = sortCartList(currentSortCriteria, currentCartListArray);

    // Muestra el carrito del usuario
    showCartListInfo();
};

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

            // Sanitiza valores de salida
            // currentCartListArray.forEach(elemento => Object.entries(elemento).map(atributo => elemento[atributo[0]] = DOMPurify.sanitize(atributo[1], { USE_PROFILES: { html: true } })));
        }).then(function () {
            // Muestra los productos
            sortAndShowCartList(ORDER_ASC_BY_NAME)
        });
};

// Ajusta interfaz de Medio de Pago y alertas de usuario en el botón de elección
function eligeMedioPago() {
    // Campos de input para Tarjeta de Crédito
    const ccNombre = document.getElementById("pago-cc-nombre");
    const ccNumero = document.getElementById("pago-cc-numero");
    const ccVmes = document.getElementById("pago-cc-v-mes");
    const ccVanio = document.getElementById("pago-cc-v-anio");
    const ccCVV = document.getElementById("pago-cc-cvv");

    // Campos de input para Transferencia Bancaria
    const trfNumero = document.getElementById("pago-trf-numero");

    // Elementos de alerta para el usuario
    const mensajeBoton = document.getElementById("mediopago-mensaje-boton");
    const mensajeModal = document.getElementById("mediopago-mensaje-modal");

    if (document.getElementById("pago-trf").checked) {
        // Deshabilita Tarjeta de Crédito
        ccNombre.setAttribute("disabled", "");
        ccNumero.setAttribute("disabled", "");
        ccVmes.setAttribute("disabled", "");
        ccVanio.setAttribute("disabled", "");
        ccCVV.setAttribute("disabled", "");

        // Habilita Transferencia
        trfNumero.removeAttribute("disabled");

        // Si faltan campos a completar
        // Muestra el mensaje de que hay datos pendientes
        if (trfNumero.value === "") {
            mensajeBoton.removeAttribute("hidden");
            mensajeModal.removeAttribute("hidden");
        } else {
            mensajeBoton.setAttribute("hidden", "");
            mensajeModal.setAttribute("hidden", "");
        }
    } else if (document.getElementById("pago-cc").checked) {
        // Deshabilita Tarjeta de Crédito
        ccNombre.removeAttribute("disabled");
        ccNumero.removeAttribute("disabled");
        ccVmes.removeAttribute("disabled");
        ccVanio.removeAttribute("disabled");
        ccCVV.removeAttribute("disabled");

        // Habilita Transferencia
        trfNumero.setAttribute("disabled", "");

        // Si faltan campos a completar
        // Muestra el mensaje de que hay datos pendientes
        if (ccNombre.value === "" ||
            ccNumero.value === "" ||
            ccVmes.value === "" ||
            ccVanio.value === "" ||
            ccCVV.value === "") {
            mensajeBoton.removeAttribute("hidden");
            mensajeModal.removeAttribute("hidden");
            return false
        } else {
            mensajeBoton.setAttribute("hidden", "");
            mensajeModal.setAttribute("hidden", "");
            return true
        }
    } else {
        // Ningun medio seleccionado
        mensajeBoton.removeAttribute("hidden");
        mensajeModal.removeAttribute("hidden");
        console.log("Estamos aqui")
        return false
    }
}

// Valida cantidad de productos en el Carrito
function validaProductosCarrito() {
    // Inicializa variable para guardar productos a corregir
    corregirProductos = "";

    // Verifica que ningun item contiene cantidad cero 
    for (let i = 0; i < currentCartListArray.length; i++) {
        producto = currentCartListArray[i];
        if (producto.count <= 0) {
            corregirProductos += `<br />${producto.name}`
        }
    }

    // Si se hayaron productos a corregir, notifica al usuario y retorna false
    // De lo contrario retorna true
    if (corregirProductos === "") {
        return true
    } else {
        alertaUsuario("Cantidad incorrecta de productos en carrito", "Hay productos con menos de 1 unidad en el Carrito.<br />Corríjalos primero<br /><br />Productos con problemas: " + corregirProductos, "warning", 0);
        return false
    }
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

    // Gestiona formulario de pago
    let form = document.getElementById('pagar-carrito')

    // Loop over them and prevent submission
    form.addEventListener('submit', function (event) {
        // Emite mensajes al usuario
        eligeMedioPago();

        // Si se valida el formulario, el medio de pago y las cantidades de producto en el carrito
        // Envía el formulario y avisa al usuario, de lo contrario detiene el envío y muestra los campos/productos a corregir
        if (!validaProductosCarrito() || !form.checkValidity()) {
            // Detiene comportamiento por defecto
            event.preventDefault();
            event.stopPropagation();
        } else {
            alert("Compra realizada con éxito");
            // alertaUsuario("¡Compra realizada!", "Su compra ha sido realizada con éxito", "success");
        }

        form.classList.add('was-validated')
    }, false)

    // Eventos de escucha para seleccion de Medio de Pago
    document.getElementById('pago-trf').addEventListener('change', eligeMedioPago);
    document.getElementById('pago-cc').addEventListener('change', eligeMedioPago);
    // document.getElementById('pago-mp').addEventListener('change', eligeMedioPago);

    // Eventos de escucha en campos de Medios de Pago
    document.getElementById("pago-cc-nombre").addEventListener('input', eligeMedioPago);
    document.getElementById("pago-cc-numero").addEventListener('input', eligeMedioPago);
    document.getElementById("pago-cc-v-mes").addEventListener('input', eligeMedioPago);
    document.getElementById("pago-cc-v-anio").addEventListener('input', eligeMedioPago);
    document.getElementById("pago-cc-cvv").addEventListener('input', eligeMedioPago);
    document.getElementById("pago-trf-numero").addEventListener('input', eligeMedioPago);
});