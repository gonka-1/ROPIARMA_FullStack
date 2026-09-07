/*SEGUIMIENTO*/

const pedidosBaseDatos = {
    "HH-1001": {
        cliente: "Valentina Martinoli",
        direccion: "Emco 4780, San Joaquín, Santiago",
        estado: "En Camino",
        progreso: "75%"
    },
    "HH-1002": {
        cliente: "Matias Vera",
        direccion: "Serrano 129, Puerto Montt",
        estado: "Entregado",
        progreso: "100%"
    },
    "HH-1003": {
        cliente: "Lucas Pizarro",
        direccion: "Av. Providencia 1234, Providencia, Santiago",
        estado: "Preparando",
        progreso: "40%"
    },
    "HH-1004": {
        cliente: "Jose Rojo",
        direccion: "Calle Valparaíso 567, Viña del Mar",
        estado: "Recibido",
        progreso: "15%"
    }
};

// Función para procesar la búsqueda
function buscarPedido(event) {
    event.preventDefault();

    const inputCodigo = document.getElementById("inputCodigo");
    const resultadoDiv = document.getElementById("resultadoSeguimiento");
    const errorDiv = document.getElementById("mensajeError");

    if (inputCodigo !== null && resultadoDiv !== null && errorDiv !== null) {

        const codigo = inputCodigo.value.trim().toUpperCase();
        const pedido = pedidosBaseDatos[codigo];

        if (pedido) {
            errorDiv.classList.add("d-none");
            resultadoDiv.classList.remove("d-none");

            document.getElementById("idPedidoTexto").textContent = codigo;
            document.getElementById("nombreCliente").textContent = pedido.cliente;
            document.getElementById("direccionCliente").textContent = pedido.direccion;
            document.getElementById("badgeEstado").textContent = pedido.estado;

            const barraProgreso = document.getElementById("barraProgreso");
            if (barraProgreso !== null) {
                barraProgreso.style.width = pedido.progreso;
            }
        } else {
            resultadoDiv.classList.add("d-none");
            errorDiv.classList.remove("d-none");
        }
    }
}

// Asignación directa e inmediata del listener
const formSeguimiento = document.getElementById("formSeguimiento");
if (formSeguimiento !== null) {
    formSeguimiento.addEventListener("submit", buscarPedido);
}

// Respaldo por si el DOM no estaba listo
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formSeguimiento");
    if (form !== null) {
        form.removeEventListener("submit", buscarPedido);
        form.addEventListener("submit", buscarPedido);
    }
});


/*SEGUIMIENTO*/