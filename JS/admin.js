/* ==========================================================================
   1. VALIDACIÓN DE CUENTA (LOGIN)
   ========================================================================== */
function validacionCuenta() {
    var emailInput = document.getElementById('Email');
    var passInput = document.getElementById('Password');

    if (!emailInput || !passInput) return;

    var correo = emailInput.value.trim();
    var pass = passInput.value;

    if (!correo.includes('@') || !correo.includes('.') || correo.length <= 8) {
        alert("El correo no cumple con los requisitos.");
        return;
    }

    if (pass.length < 8 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
        alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        return;
    }

    window.location.href = "Administrador.html"; 
}


/* ==========================================================================
   2. DETECTOR DE PÁGINA E INICIALIZACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Si la página actual tiene la tabla de inventario, inicia inventario
    if (document.getElementById('tablaInventario')) {
        initInventario();
    }

    // Si la página actual tiene la tabla de órdenes, inicia órdenes
    if (document.getElementById('tablaOrdenes')) {
        initOrdenes();
    }
});


/* ==========================================================================
   3. MÓDULO DE INVENTARIO
   ========================================================================== */
const STORAGE_PRODUCTOS = 'inventario_ropiarma';
let productos = JSON.parse(localStorage.getItem(STORAGE_PRODUCTOS)) || [];
let DOM_PROD = {};

function initInventario() {
    DOM_PROD = {
        form: document.getElementById('formProducto'),
        tabla: document.getElementById('tablaInventario'),
        tituloForm: document.getElementById('formTitulo'),
        btnGuardar: document.getElementById('btnGuardar'),
        btnCancelar: document.getElementById('btnCancelar'),
        inputs: {
            id: document.getElementById('productoId'),
            nombre: document.getElementById('nombreProducto'),
            precio: document.getElementById('precioProducto'),
            stock: document.getElementById('stockProducto'),
            categoria: document.getElementById('categoriaProducto')
        }
    };

    if (DOM_PROD.form) {
        DOM_PROD.form.addEventListener('submit', guardarProducto);
    }
    renderizarTablaProductos();
}

function renderizarTablaProductos() {
    if (!DOM_PROD.tabla) return;
    DOM_PROD.tabla.innerHTML = '';

    if (productos.length === 0) {
        DOM_PROD.tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No hay productos registrados en el inventario.
                </td>
            </tr>`;
        return;
    }

    productos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3"><strong>${prod.nombre}</strong></td>
            <td><span class="badge badge-categoria">${prod.categoria}</span></td>
            <td>$${Number(prod.precio).toLocaleString('es-CL')}</td>
            <td>${prod.stock} u.</td>
            <td class="text-end pe-3">
                <button class="btn btn-outline-warning btn-sm me-1" onclick="cargarParaEditarProducto(${prod.id})">Editar</button>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
            </td>
        `;
        DOM_PROD.tabla.appendChild(tr);
    });

    localStorage.setItem(STORAGE_PRODUCTOS, JSON.stringify(productos));
}

function guardarProducto(e) {
    e.preventDefault();
    const id = DOM_PROD.inputs.id.value;
    const datosProducto = {
        id: id ? Number(id) : Date.now(),
        nombre: DOM_PROD.inputs.nombre.value.trim(),
        precio: parseFloat(DOM_PROD.inputs.precio.value),
        stock: parseInt(DOM_PROD.inputs.stock.value),
        categoria: DOM_PROD.inputs.categoria.value
    };

    if (id) {
        const index = productos.findIndex(p => p.id === Number(id));
        if (index !== -1) productos[index] = datosProducto;
    } else {
        productos.push(datosProducto);
    }

    resetearFormularioProducto();
    renderizarTablaProductos();
}

function cargarParaEditarProducto(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    DOM_PROD.inputs.id.value = prod.id;
    DOM_PROD.inputs.nombre.value = prod.nombre;
    DOM_PROD.inputs.precio.value = prod.precio;
    DOM_PROD.inputs.stock.value = prod.stock;
    DOM_PROD.inputs.categoria.value = prod.categoria;

    DOM_PROD.tituloForm.textContent = 'Editar Producto';
    DOM_PROD.btnGuardar.textContent = 'Actualizar Producto';
    DOM_PROD.btnGuardar.className = 'btn btn-warning btn-sm';
    DOM_PROD.btnCancelar.classList.remove('d-none');
}

function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    productos = productos.filter(p => p.id !== id);
    if (DOM_PROD.inputs.id.value == id) resetearFormularioProducto();
    renderizarTablaProductos();
}

function resetearFormularioProducto() {
    DOM_PROD.form.reset();
    DOM_PROD.inputs.id.value = '';
    DOM_PROD.tituloForm.textContent = 'Agregar Producto';
    DOM_PROD.btnGuardar.textContent = 'Guardar Producto';
    DOM_PROD.btnGuardar.className = 'btn btn-verde-admin btn-sm';
    DOM_PROD.btnCancelar.classList.add('d-none');
}

function cancelarEdicion() {
    resetearFormularioProducto();
}


/* ==========================================================================
   4. MÓDULO DE ÓRDENES
   ========================================================================== */
const STORAGE_ORDENES = 'ordenes_huerto_hogar';
let ordenes = JSON.parse(localStorage.getItem(STORAGE_ORDENES)) || [];
let DOM_ORD = {};

function initOrdenes() {
    DOM_ORD = {
        form: document.getElementById('formOrden'),
        tabla: document.getElementById('tablaOrdenes'),
        tituloForm: document.getElementById('formTituloOrden'),
        btnGuardar: document.getElementById('btnGuardarOrden'),
        btnCancelar: document.getElementById('btnCancelarOrden'),
        inputs: {
            id: document.getElementById('ordenId'),
            cliente: document.getElementById('clienteOrden'),
            correo: document.getElementById('correoOrden'),
            total: document.getElementById('totalOrden'),
            estado: document.getElementById('estadoOrden')
        }
    };

    if (DOM_ORD.form) {
        DOM_ORD.form.addEventListener('submit', guardarOrden);
    }
    renderizarTablaOrdenes();
}

function renderizarTablaOrdenes() {
    if (!DOM_ORD.tabla) return;
    DOM_ORD.tabla.innerHTML = '';

    if (ordenes.length === 0) {
        DOM_ORD.tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No hay órdenes registradas.
                </td>
            </tr>`;
        return;
    }

    ordenes.forEach(ord => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3 fw-bold">${ord.id}</td>
            <td>
                <div>${ord.cliente}</div>
                <small class="text-muted">${ord.correo}</small>
            </td>
            <td>${ord.fecha}</td>
            <td>$${Number(ord.total).toLocaleString('es-CL')}</td>
            <td>${obtenerBadgeEstado(ord.estado)}</td>
            <td class="text-end pe-3">
                <button class="btn btn-outline-warning btn-sm me-1" onclick="cargarParaEditarOrden('${ord.id}')">Editar</button>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarOrden('${ord.id}')">Eliminar</button>
            </td>
        `;
        DOM_ORD.tabla.appendChild(tr);
    });

    localStorage.setItem(STORAGE_ORDENES, JSON.stringify(ordenes));
}

function guardarOrden(e) {
    e.preventDefault();
    const id = DOM_ORD.inputs.id.value;
    const hoy = new Date();
    const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    const datosOrden = {
        id: id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        cliente: DOM_ORD.inputs.cliente.value.trim(),
        correo: DOM_ORD.inputs.correo.value.trim(),
        total: parseFloat(DOM_ORD.inputs.total.value),
        estado: DOM_ORD.inputs.estado.value,
        fecha: id ? (ordenes.find(o => o.id === id)?.fecha || fechaActual) : fechaActual
    };

    if (id) {
        const index = ordenes.findIndex(o => o.id === id);
        if (index !== -1) ordenes[index] = datosOrden;
    } else {
        ordenes.push(datosOrden);
    }

    resetearFormularioOrden();
    renderizarTablaOrdenes();
}

function cargarParaEditarOrden(id) {
    const ord = ordenes.find(o => o.id === id);
    if (!ord) return;

    DOM_ORD.inputs.id.value = ord.id;
    DOM_ORD.inputs.cliente.value = ord.cliente;
    DOM_ORD.inputs.correo.value = ord.correo;
    DOM_ORD.inputs.total.value = ord.total;
    DOM_ORD.inputs.estado.value = ord.estado;

    DOM_ORD.tituloForm.textContent = 'Editar Órden';
    DOM_ORD.btnGuardar.textContent = 'Actualizar Órden';
    DOM_ORD.btnGuardar.className = 'btn btn-warning btn-sm';
    DOM_ORD.btnCancelar.classList.remove('d-none');
}

function eliminarOrden(id) {
    if (!confirm('¿Estás seguro de eliminar esta órden?')) return;
    ordenes = ordenes.filter(o => o.id !== id);
    if (DOM_ORD.inputs.id.value === id) resetearFormularioOrden();
    renderizarTablaOrdenes();
}

function resetearFormularioOrden() {
    DOM_ORD.form.reset();
    DOM_ORD.inputs.id.value = '';
    DOM_ORD.tituloForm.textContent = 'Registrar Nueva Órden';
    DOM_ORD.btnGuardar.textContent = 'Registrar Órden';
    DOM_ORD.btnGuardar.className = 'btn btn-verde-admin btn-sm';
    DOM_ORD.btnCancelar.classList.add('d-none');
}

function cancelarEdicionOrden() {
    resetearFormularioOrden();
}

function obtenerBadgeEstado(estado) {
    switch (estado) {
        case 'Pendiente': return `<span class="badge bg-warning text-dark">Pendiente</span>`;
        case 'En Preparación': return `<span class="badge bg-info text-dark">En Preparación</span>`;
        case 'Enviado': return `<span class="badge bg-primary">Enviado</span>`;
        case 'Entregado': return `<span class="badge bg-success">Entregado</span>`;
        default: return `<span class="badge bg-secondary">${estado}</span>`;
    }
}

/* ==========================================================================
   5.CLIENTES
   ========================================================================== */
const STORAGE_CLIENTES = 'clientes_huerto_hogar';
let clientes = JSON.parse(localStorage.getItem(STORAGE_CLIENTES)) || [];
let DOM_CLI = {};

function initClientes() {
    DOM_CLI = {
        form: document.getElementById('formCliente'),
        tabla: document.getElementById('tablaClientes'),
        tituloForm: document.getElementById('formTituloCliente'),
        btnGuardar: document.getElementById('btnGuardarCliente'),
        btnCancelar: document.getElementById('btnCancelarCliente'),
        inputs: {
            id: document.getElementById('clienteId'),
            nombre: document.getElementById('nombreCliente'),
            correo: document.getElementById('correoCliente'),
            telefono: document.getElementById('telefonoCliente'),
            region: document.getElementById('regionCliente')
        }
    };

    if (DOM_CLI.form) {
        DOM_CLI.form.addEventListener('submit', guardarCliente);
    }
    renderizarTablaClientes();
}

function renderizarTablaClientes() {
    if (!DOM_CLI.tabla) return;
    DOM_CLI.tabla.innerHTML = '';

    if (clientes.length === 0) {
        DOM_CLI.tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No hay clientes registrados.
                </td>
            </tr>`;
        return;
    }

    clientes.forEach(cli => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3"><strong>${cli.nombre}</strong></td>
            <td>${cli.correo}</td>
            <td>${cli.telefono || 'Sin registro'}</td>
            <td>${cli.region}</td>
            <td class="text-end pe-3">
                <button class="btn btn-outline-warning btn-sm me-1" onclick="cargarParaEditarCliente(${cli.id})">Editar</button>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarCliente(${cli.id})">Eliminar</button>
            </td>
        `;
        DOM_CLI.tabla.appendChild(tr);
    });

    localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(clientes));
}

function guardarCliente(e) {
    e.preventDefault();
    const id = DOM_CLI.inputs.id.value;
    const datosCliente = {
        id: id ? Number(id) : Date.now(),
        nombre: DOM_CLI.inputs.nombre.value.trim(),
        correo: DOM_CLI.inputs.correo.value.trim(),
        telefono: DOM_CLI.inputs.telefono.value.trim(),
        region: DOM_CLI.inputs.region.value
    };

    if (id) {
        const index = clientes.findIndex(c => c.id === Number(id));
        if (index !== -1) clientes[index] = datosCliente;
    } else {
        clientes.push(datosCliente);
    }

    resetearFormularioCliente();
    renderizarTablaClientes();
}

function cargarParaEditarCliente(id) {
    const cli = clientes.find(c => c.id === id);
    if (!cli) return;

    DOM_CLI.inputs.id.value = cli.id;
    DOM_CLI.inputs.nombre.value = cli.nombre;
    DOM_CLI.inputs.correo.value = cli.correo;
    DOM_CLI.inputs.telefono.value = cli.telefono;
    DOM_CLI.inputs.region.value = cli.region;

    DOM_CLI.tituloForm.textContent = 'Editar Cliente';
    DOM_CLI.btnGuardar.textContent = 'Actualizar Cliente';
    DOM_CLI.btnGuardar.className = 'btn btn-warning btn-sm';
    DOM_CLI.btnCancelar.classList.remove('d-none');
}

function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    clientes = clientes.filter(c => c.id !== id);
    if (DOM_CLI.inputs.id.value == id) resetearFormularioCliente();
    renderizarTablaClientes();
}

function resetearFormularioCliente() {
    DOM_CLI.form.reset();
    DOM_CLI.inputs.id.value = '';
    DOM_CLI.tituloForm.textContent = 'Registrar Cliente';
    DOM_CLI.btnGuardar.textContent = 'Guardar Cliente';
    DOM_CLI.btnGuardar.className = 'btn btn-verde-admin btn-sm';
    DOM_CLI.btnCancelar.classList.add('d-none');
}

function cancelarEdicionCliente() {
    resetearFormularioCliente();
}


/* ==========================================================================
   6.EMPLEADOS
   ========================================================================== */
const STORAGE_EMPLEADOS = 'empleados_huerto_hogar';
let empleados = JSON.parse(localStorage.getItem(STORAGE_EMPLEADOS)) || [];
let DOM_EMP = {};

function initEmpleados() {
    DOM_EMP = {
        form: document.getElementById('formEmpleado'),
        tabla: document.getElementById('tablaEmpleados'),
        tituloForm: document.getElementById('formTituloEmpleado'),
        btnGuardar: document.getElementById('btnGuardarEmpleado'),
        btnCancelar: document.getElementById('btnCancelarEmpleado'),
        inputs: {
            id: document.getElementById('empleadoId'),
            rut: document.getElementById('rutEmpleado'),
            nombre: document.getElementById('nombreEmpleado'),
            cargo: document.getElementById('cargoEmpleado'),
            estado: document.getElementById('estadoEmpleado')
        }
    };

    if (DOM_EMP.form) {
        DOM_EMP.form.addEventListener('submit', guardarEmpleado);
    }
    renderizarTablaEmpleados();
}

function renderizarTablaEmpleados() {
    if (!DOM_EMP.tabla) return;
    DOM_EMP.tabla.innerHTML = '';

    if (empleados.length === 0) {
        DOM_EMP.tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No hay empleados registrados.
                </td>
            </tr>`;
        return;
    }

    empleados.forEach(emp => {
        const badgeEstado = emp.estado === 'Activo' 
            ? '<span class="badge bg-success">Activo</span>' 
            : '<span class="badge bg-secondary">Inactivo</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3 fw-bold">${emp.rut}</td>
            <td>${emp.nombre}</td>
            <td><span class="badge bg-info text-dark">${emp.cargo}</span></td>
            <td>${badgeEstado}</td>
            <td class="text-end pe-3">
                <button class="btn btn-outline-warning btn-sm me-1" onclick="cargarParaEditarEmpleado(${emp.id})">Editar</button>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarEmpleado(${emp.id})">Eliminar</button>
            </td>
        `;
        DOM_EMP.tabla.appendChild(tr);
    });

    localStorage.setItem(STORAGE_EMPLEADOS, JSON.stringify(empleados));
}

function guardarEmpleado(e) {
    e.preventDefault();
    const id = DOM_EMP.inputs.id.value;
    const datosEmpleado = {
        id: id ? Number(id) : Date.now(),
        rut: DOM_EMP.inputs.rut.value.trim(),
        nombre: DOM_EMP.inputs.nombre.value.trim(),
        cargo: DOM_EMP.inputs.cargo.value,
        estado: DOM_EMP.inputs.estado.value
    };

    if (id) {
        const index = empleados.findIndex(emp => emp.id === Number(id));
        if (index !== -1) empleados[index] = datosEmpleado;
    } else {
        empleados.push(datosEmpleado);
    }

    resetearFormularioEmpleado();
    renderizarTablaEmpleados();
}

function cargarParaEditarEmpleado(id) {
    const emp = empleados.find(e => e.id === id);
    if (!emp) return;

    DOM_EMP.inputs.id.value = emp.id;
    DOM_EMP.inputs.rut.value = emp.rut;
    DOM_EMP.inputs.nombre.value = emp.nombre;
    DOM_EMP.inputs.cargo.value = emp.cargo;
    DOM_EMP.inputs.estado.value = emp.estado;

    DOM_EMP.tituloForm.textContent = 'Editar Empleado';
    DOM_EMP.btnGuardar.textContent = 'Actualizar Empleado';
    DOM_EMP.btnGuardar.className = 'btn btn-warning btn-sm';
    DOM_EMP.btnCancelar.classList.remove('d-none');
}

function eliminarEmpleado(id) {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    empleados = empleados.filter(e => e.id !== id);
    if (DOM_EMP.inputs.id.value == id) resetearFormularioEmpleado();
    renderizarTablaEmpleados();
}

function resetearFormularioEmpleado() {
    DOM_EMP.form.reset();
    DOM_EMP.inputs.id.value = '';
    DOM_EMP.tituloForm.textContent = 'Registrar Empleado';
    DOM_EMP.btnGuardar.textContent = 'Guardar Empleado';
    DOM_EMP.btnGuardar.className = 'btn btn-verde-admin btn-sm';
    DOM_EMP.btnCancelar.classList.add('d-none');
}

function cancelarEdicionEmpleado() {
    resetearFormularioEmpleado();
}