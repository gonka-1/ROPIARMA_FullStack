var productos = [
    { id: "FR001", nombre: "Manzana Fuji", precio: 1200, stock: 150, Unidad: "KG" },
    { id: "FR002", nombre: "Naranja Valencia", precio: 1000, stock: 200, Unidad: "KG" },
    { id: "FR003", nombre: "Plátanos Cavendish", precio: 800, stock: 250, Unidad: "KG" },
    { id: "VR001", nombre: "Zanahoria Orgánica", precio: 900, stock: 100, Unidad: "KG" },
    { id: "VR002", nombre: "Espinacas Frescas", precio: 700, stock: 800, Unidad: "Bolsas" },
    { id: "VR003", nombre: "Pimientos Tricolores", precio: 1500, stock: 120, Unidad: "KG" },
    { id: "PO001", nombre: "Miel Orgánica", precio: 5000, stock: 50, Unidad: "Frasco" },
    { id: "PL001", nombre: "Leche Entera", precio: 1100, stock: 100, Unidad: "Lt" },
    { id: "PO003", nombre: "Quinoa", precio: 5000, stock: 200, Unidad: "KG" }
];


//FUNCIONES DE CARRITO

/*CARRITO*/
var porcentajeDescuento = 0;

const llave = "carrito";

var nombreArchivo = window.location.pathname.split("/").pop();

var mapaProductos = {
    "VistaManzana.html": "FR001",
    "VistaNaranja.html": "FR002",
    "VistaPlatano.html": "FR003",
    "VistaZanahoria.html": "VR001",
    "VistaEspinaca.html": "VR002",
    "VistaPimiento.html": "VR003",
    "VistaMiel.html": "PO001",
    "VistaLeche.html": "PL001",
    "VistaQuinoa.html": "PO003"
};

var idActual = mapaProductos[nombreArchivo] || "FR001";

var productoActual = productos.find(function (p) {
    return p.id === idActual;
});

function guardar(producto) {
    var storageActual = localStorage.getItem(llave);
    var lista = storageActual != null ? JSON.parse(storageActual) : [];

    var indiceExistente = lista.findIndex(function (item) {
        return item.id === producto.id;
    });

    if (indiceExistente !== -1) {
        lista[indiceExistente].cantidad += producto.cantidad;
    } else {
        lista.push(producto);
    }

    localStorage.setItem(llave, JSON.stringify(lista));
}

function agregarAlCarrito() {
    var select = document.getElementById("selectCantidad");
    var cantidadAComprar = parseInt(select.value);

    if (productoActual.stock <= 0 || cantidadAComprar <= 0 || cantidadAComprar > productoActual.stock) {
        alert("SIN STOCK DISPONIBLE!!\n\nNo hay suficiente stock disponible");
        return;
    }

    var producto = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        cantidad: cantidadAComprar,
        unidad: productoActual.Unidad
    };

    guardar(producto);
    productoActual.stock -= cantidadAComprar;
    actualizarInterfazStock();

    alert(`Agregaste ${cantidadAComprar} ${productoActual.Unidad} al carrito. Quedan ${productoActual.stock} ${productoActual.Unidad} en stock`);
}

function actualizarInterfazStock() {
    var select = document.getElementById("selectCantidad");
    var texto = document.getElementById("textoStock");

    if (texto !== null && select !== null) {
        texto.textContent = `(+${productoActual.stock} ${productoActual.Unidad} disponibles)`;

        var maxOpciones = productoActual.stock;
        select.innerHTML = "";

        if (maxOpciones <= 0) {
            select.innerHTML = '<option value="0">Sin stock</option>';
            select.disabled = true;
        } else {
            select.disabled = false;
            for (var i = 1; i <= maxOpciones; i++) {
                select.innerHTML += `<option value="${i}">${i} ${productoActual.Unidad}</option>`;
            }
        }
    }
}

actualizarInterfazStock();

function obtenerCarrito() {
    var storageActual = localStorage.getItem("carrito");
    return storageActual != null ? JSON.parse(storageActual) : [];
}

function renderizarCarrito() {
    var lista = obtenerCarrito();
    var contenedor = document.getElementById("contenedorProductos");
    var subtotalTexto = document.getElementById("subtotalTexto");
    var totalTexto = document.getElementById("totalTexto");

    contenedor.innerHTML = "";
    var totalAcumulado = 0;

    if (lista.length === 0) {
        contenedor.innerHTML = `
        <div class="card corder-0 shadow-sm p-4 text-center text-muted">
            Tu carrito vacío.
        </div>`;
        subtotalTexto.textContent = "$0";
        totalTexto.textContent = "$0";
        return;
    }

    lista.forEach(function (item, indice) {
        var subtotal = item.precio * item.cantidad;
        totalAcumulado += subtotal;

        contenedor.innerHTML += `
        <div class="card border-0 shadow-sm p-3 mb-3 rounded-3">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <h6 class="fw-bold mb-1">${item.nombre}</h6>
                        <span class="text-muted small">$${item.precio} / ${item.unidad}</span>
                    </div>

                    <div class="d-flex align-items-center border rounded-2 px-2 py-1">
                        <button class="btn btn-sm border-0 px-2" onclick="cambiarCantidad(${indice}, -1)">-</button>
                        <span class="px-3 fw-bold">${item.cantidad} ${item.unidad}</span>
                        <button class="btn btn-sm border-0 px-2" onclick="cambiarCantidad(${indice}, 1)">+</button>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                        <span class="fw-bold fs-5">$${subtotal}</span>
                        <button class="btn btn-link text-danger p-0 border-0" onclick="eliminarProducto(${indice})">
                            ❌
                        </button>
                    </div>
                </div>
            </div>`;
    });

    var montoDescuento = Math.round(totalAcumulado * porcentajeDescuento);
    var totalFinal = totalAcumulado - montoDescuento;

    if (subtotalTexto) subtotalTexto.textContent = `$${totalAcumulado}`;
    if (totalTexto) totalTexto.textContent = `$${totalFinal}`;
}

function cambiarCantidad(indice, cambio) {
    var lista = obtenerCarrito();

    lista[indice].cantidad += cambio;;

    if (lista[indice].cantidad <= 0) {
        lista.splice(indice, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(lista));

    renderizarCarrito();
}

function eliminarProducto(indice) {
    var lista = obtenerCarrito();

    lista.splice(indice, 1);

    localStorage.setItem("carrito", JSON.stringify(lista));
    renderizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    porcentajeDescuento = 0;

    var input = document.getElementById("inputCupon");
    var mensaje = document.getElementById("mensajeCupon");

    if (input !== null) {
        input.value = "";
    }

    if (mensaje != null) {
        mensaje.textContent = "";
    }

    renderizarCarrito();
}


function comprar() {
    var lista = obtenerCarrito();

    if (lista.length === 0) {
        alert("Tu carrito está vacio. Agrega productos antes de continuar.");
        return;
    }

    alert("Muchas gracias por tu compra en Huerto-Hogar!!")

    localStorage.removeItem("carrito");
    renderizarCarrito();


    window.location.href = "Principal.html";
}

function aplicarCupon() {
    var input = document.getElementById("inputCupon");
    var mensaje = document.getElementById("mensajeCupon");

    if (!input || !mensaje) return;

    var codigo = input.value.trim().toUpperCase();

    if (codigo === "HUERTITO10") {
        porcentajeDescuento = 0.10;

        mensaje.className = "d-block mt-1 small text-success";
        mensaje.textContent = "Cupón del 10% aplicado!!";
    } else if (codigo === "FUJI123") {
        porcentajeDescuento = 0.20;
        mensaje.className = "d-block mt-1 small text-success";
        mensaje.textContent = "Cupón del 20% aplicado!!";
    } else {
        porcentajeDescuento = 0;
        mensaje.className = "d-block mt-1 small text-danger";
        mensaje.textContent = "Cupón no valido";
    }

    renderizarCarrito();
}

function actualizarContadorCarrito(){
    var contador = document.getElementById("contadorCarrito");
    if (!contador) return;

    var lista = obtenerCarrito();

    var totalProductos = 0;
    lista.forEach(item => totalProductos += (item.cantidad || 1));

    contador.textContent = totalProductos;
    contador.style.display = "inline-block";


}

actualizarContadorCarrito();

if (document.getElementById("contenedorProductos")) {
    renderizarCarrito();
}

/*CARRITO*/

/*RESEÑAS*/

const productId = mapaProductos[nombreArchivo];

// 1. Dibujar las reseñas guardadas en la pantalla
function mostrarResenas() {
    if(!productId) return;

    const todas = JSON.parse(localStorage.getItem('resenas')) || {};
    const lista = todas[productId] || [];
    const contenedor = document.getElementById('reviews-list');

    // Limpiar lista antes de actualizar
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p>Sin opiniones aún.</p>';
        document.getElementById('avg-rating').textContent = '0.0';
        document.getElementById('avg-stars').textContent = '☆☆☆☆☆';
        document.getElementById('total-reviews').textContent = '0';
        return;
    }

    // Calcular promedio de estrellas
    let suma = 0;
    lista.forEach(r => suma += Number(r.rating));
    const promedio = (suma / lista.length).toFixed(1);

    // Actualizar resumen visual
    document.getElementById('avg-rating').textContent = promedio;
    document.getElementById('avg-stars').textContent = '★'.repeat(Math.round(promedio)) + '☆'.repeat(5 - Math.round(promedio));
    document.getElementById('total-reviews').textContent = lista.length;

    // Insertar cada reseña en el HTML
    lista.forEach(r => {
        contenedor.innerHTML += `
      <div class="tarjeta-resena">
        <div class="encabezado-resena">
          <span class="autor-resena">${r.author}</span>
          <span class="estrellas">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        </div>
        <p class="comentario-texto">${r.comment}</p>
        <span class="fecha-resena">${r.date}</span>
      </div>
    `;
    });
}

// 2. Guardar nueva reseña al enviar el formulario
document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const nueva = {
        author: document.getElementById('review-author').value,
        rating: document.getElementById('review-rating').value,
        comment: document.getElementById('review-comment').value,
        date: new Date().toLocaleDateString()
    };

    // Obtener objeto actual de localStorage y guardar
    const todas = JSON.parse(localStorage.getItem('resenas')) || {};
    if (!todas[productId]) todas[productId] = [];

    todas[productId].unshift(nueva);
    localStorage.setItem('resenas', JSON.stringify(todas));

    // Limpiar formulario y recargar lista
    e.target.reset();
    mostrarResenas();
});

// 3. Cargar al abrir la página
mostrarResenas();

/*RESEÑAS*/
