// SESIÓN DE USUARIO

// key para la sesión
const sesionKey = 'sesion';

// key temporal para registro de usuario
const registroTempKey = 'registro';

function guardarSesion(datos){
  localStorage.setItem(sesionKey, JSON.stringify(datos));
}

// Verificar si hay una sesión guardada en localStorage. 
// Si la hay, devuelve los datos, si no devuelve null
function obtenerSesion(){
  const raw = localStorage.getItem(sesionKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null
  }
}

// Cerrar sesión. Se eliminan los datos del localStorage
function cerrarSesion(){
  localStorage.removeItem(sesionKey);
}

//Guardar datos temporales de registro de usuario duranye el proceso de registro. 
// Permite que los datos se mantengan mientras el usuario completa el registro
function guardarRegistroTemp(datos) {
  sessionStorage.setItem(registroTempKey, JSON.stringify(datos));
}

// Obtener datos temporales de registro de usuario y convierte de nuevo en objeto
function obtenerRegistroTemp(){
  const raw = sessionStorage.getItem(registroTempKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e){
    return null
  }
}

// Limpiar datos temporales de registro de usuario
function limpiarRegistroTemp(){
  sessionStorage.removeItem(registroTempKey);
}

// Nombre que se muestra en el perfil a partir del correo electrónico a partir de nombre ingresado durante el registro
function obtenerNombreUsuario(email, nombre) {
  if (nombre && nombre.trim()) return nombre.trim();

  const usuario = email.split('@')[0] || email;
  return usuario
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

// CAMBIO DE HEADER AL INGRESAR A LA CUENTA
function actualizarHeaderSesion(){
  const menu = document.querySelector('.logo.dropdown .dropdown-menu');
  if (!menu) return;

  const sesion = obtenerSesion();

  if (sesion) {

    const nombreUsuario = sesion.nombre || obtenerNombreUsuario(sesion.email, '');

    menu.innerHTML = `
     <li class="dropdown-header text-dark fw-bold border-bottom pb-2 mb-1">
        👤 ${nombreUsuario}
      </li>
      <li><a class="dropdown-item" href="Perfil.html">Perfil</a></li>
      <li><a class="dropdown-item" href="seguimiento.html">Mis pedidos</a></li>
      <li><a class="dropdown-item" href="#" id="btnCerrarSesionHeader">Cerrar sesión</a></li>
    `;
    const btnSalir = document.getElementById('btnCerrarSesionHeader');
    if (btnSalir) {
      btnSalir.addEventListener('click', function (e) {
        e.preventDefault();
        cerrarSesion();
        window.location.href = 'Principal.html';
      });
    }
  } else {
    menu.innerHTML = `
      <li><a class="dropdown-item" href="Usuario-ingresar.html">Ingresar</a></li>
      <li><a class="dropdown-item" href="Usuario.html">Crear usuario</a></li>
    `;
  }
}

// MOSTRAR DATOS DE LA CUENTA EN LA VISTA "PERFIL"
function mostrarPerfilUsuario(){
  const sesion = obtenerSesion();
  if (!sesion) return;

  const campos = {
    nombreUsuarioPerfil: sesion.nombre,
    emailUsuarioPerfil: sesion.email,
    telefonoUsuarioPerfil: sesion.telefono,
    comunaUsuarioPerfil: sesion.comuna,
    ciudadUsuarioPerfil: sesion.ciudad,
    regionUsuarioPerfil: sesion.region
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor || '-';
  });
}

// MOSTRAR / OCULTAR CONTRASEÑA
function configurarTogglePassword(){
  const btnToggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('typePassword');
  const icon = document.getElementById('toggleIcon');

  if (!btnToggle || !passwordInput || !icon) return;

  btnToggle.addEventListener('click', function(){
    const isPassword = passwordInput.type == 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('bi-eye', !isPassword);
    icon.classList.toggle('bi-eye-slash', isPassword);
  })
}

document.addEventListener('DOMContentLoaded', function(){

  actualizarHeaderSesion();
  configurarTogglePassword();
  mostrarPerfilUsuario();

  // Datos personales
  const formDatosPersonales = document.getElementById('formDatosPersonales');

  if (formDatosPersonales) {
    formDatosPersonales.addEventListener('submit', function(e){
      e.preventDefault();

      // Validar datos vacíos
      const campos = formDatosPersonales.querySelectorAll('input, select');
      let esValido = true;

      campos.forEach(campo => {
        if (!campo.value.trim()){
          campo.classList.add('is-invalid');
          esValido = false;
        } else {
          campo.classList.remove('is-invalid');
        }
      });

      if (!esValido) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
      }

      // Validad edad
      const diaInput = document.getElementById('diaNacimiento')
      const mesSelect = document.getElementById('mesNacimiento')
      const anioInput = document.getElementById('anioNacimiento')

      if(diaInput && mesSelect && anioInput){
        const dia = parseInt(diaInput.value);
        const mes = parseInt(mesSelect.value);
        const anio = parseInt(anioInput.value);

        const fechaNac = new Date(anio, mes, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const difMeses = hoy.getMonth() - fechaNac.getMonth();

        if (difMeses < 0 || (difMeses === 0 && hoy.getDate() < fechaNac.getDate())){
          edad--;
        }

        if (edad < 18){
          alert('Debes ser mayor de 18 años para registrarte');
          return
        }
      }

      const nombre = document.getElementById('typeNombre').value.trim() || '';
      const apellido = document.getElementById('typeApellido').value.trim() || '';
      const telefono = document.getElementById('typePhone').value.trim() || '';
      const comuna = document.getElementById('typeComuna').value.trim() || '';
      const ciudad = document.getElementById('typeCiudad').value.trim() || '';
      const region = document.getElementById('typeRegion').value.trim() || '';
 
      guardarRegistroTemp({ nombre, apellido, telefono, comuna, ciudad, region });
 
      window.location.href = 'Usuario-conf.html';
    });
  }

  // CREAR USUARIO  
  const formUsuario = document.getElementById('formUsuario');

  if (formUsuario) {
    formUsuario.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('typeEmail');
      const passInput = document.getElementById('typePassword');

      if (!emailInput || !passInput) return;

      const email = emailInput.value.trim();
      const pass = passInput.value.trim();

      // Validaciones campos vacíos
      if (!email || !pass) {
        alert('Por favor, ingresa correo y contraseña');
        return;
      }

      const tieneMinuscula = /[a-z]/.test(pass);
      const tieneMayuscula = /[A-Z]/.test(pass);
      const tieneNumero = /[0-9]/.test(pass);

      if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      if (!tieneMinuscula || !tieneMayuscula || !tieneNumero) {
        alert('La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número');
        return;
      }

      const datosPersonales = obtenerRegistroTemp() || {};
      guardarSesion({...datosPersonales, email});
      limpiarRegistroTemp();
      actualizarHeaderSesion();

      // TOAST DE BOOTSTRAP (alerta)
      const toastCreado = document.getElementById('toastUsuarioCreado');

      if (toastCreado && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastCreado);
        toast.show();

        setTimeout(() => {
          window.location.href = 'Principal.html';
        }, 2000);
      } else {
        alert('¡Usuario creado con éxito!');
        window.location.href = 'Principal.html';
      }
    });
  }

  // INICIAR SESIÓN
  const formIngresar = document.getElementById('formIngresar');

  if (formIngresar) {
    formIngresar.addEventListener('submit', function (e){
      e.preventDefault();

      const emailInput = document.getElementById('typeEmail');
      const passInput = document.getElementById('typePassword');

      if (!emailInput || !passInput) return;

      const email = emailInput.value.trim();
      const pass = passInput.value.trim();

      // 1. Validar campos vacíos
      if (!email || !pass) {
        alert('Por favor, ingresa tu correo y contraseña para ingresar');
        return;
      }

      // 2. Validar contraseña
      const tieneMinuscula = /[a-z]/.test(pass);
      const tieneMayuscula = /[A-Z]/.test(pass);
      const tieneNumero = /[0-9]/.test(pass);

      if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      if (!tieneMinuscula || !tieneMayuscula || !tieneNumero) {
        alert('La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número');
        return;
      }

      const sesionPrevia = obtenerSesion();
      const registroTemp = obtenerRegistroTemp();
      const datosBase = (sesionPrevia && sesionPrevia.email === email)
        ? sesionPrevia
        : { nombre: obtenerNombreUsuario(email, registroTemp && registroTemp.nombre)};

      guardarSesion({...datosBase, email});
      actualizarHeaderSesion();

      // 3. Confirmación de inicio de sesión exitoso y redirección a Principal.html
      alert('¡Bienvenido de nuevo!')
      window.location.href = 'Principal.html';
    });
  }

});