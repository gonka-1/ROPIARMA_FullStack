// SESIÓN DE USUARIO 
 // clave de sesión
 const hhSesionKey = 'hh_sesion';
 // clave temporal para registro de usuario
 const hhRegistroTempKey = 'hh_registro';

 function guardarSesion(datos) {
    localStorage.setItem(hhSesionKey, JSON.stringify(datos));
 }

 // Verificar si hay una sesión guardada en el localStorage. Si la hay, devuelve los datos de la sesión, si no, devuelve null.
function obtenerSesion() {
  const raw = localStorage.getItem(hhSesionKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Cerrar sesión eliminando los datos de la sesión del localStorage.
function cerrarSesion() {
  localStorage.removeItem(hhSesionKey);
}

// Guardar datos temporales de registro de usuario durante el proceso de registro. Esto permite que los datos se mantengan mientras el usuario completa el registro en varias páginas.
function guardarRegistroTemp(datos) {
  sessionStorage.setItem(hhRegistroTempKey, JSON.stringify(datos));
}

// Obtener datos temporales de registro de usuario. Esto permite que los datos se mantengan mientras el usuario completa el registro en varias páginas.
function obtenerRegistroTemp() {
  const raw = sessionStorage.getItem(hhRegistroTempKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Limpiar datos temporales de registro de usuario. Esto se puede usar cuando el usuario completa el registro o decide cancelar el proceso.
function limpiarRegistroTemp() {
  sessionStorage.removeItem(hhRegistroTempKey);
}

// Nombre que se muestra en el perfil del usuario a partir del correo electrónico.
function obtenerNombreUsuario() {
  const usuario = email.split('@')[0]||email;
  return usuario
  .replace(/[._-]+/g, ' ')
  .split(' ')
  .filter(Boolean)
  .map(p => p.charAt(0).toUpperCase() + p.slice(1))
  .join(' ');
}

// CAMBIO HEADER - MOSTRAR "PERFIL"
function actualizarHeaderSesion() {
  const menu = document.querySelector('.logo.dropdown-menu');
  if (!menu) return;

  if (sesion) {
    menu.innerHTML = `
      <li><a class="dropdown-item" href="Perfil.html">Perfil</a></li>
      <li><a class="dropdown-item" href="#" id="btnCerrarSesionHeader">Cerrar sesión</a></li>
    `;
    const btnSalir = document.getElementById('btnCerrarSesionHeader');
    if (btnSalir) {
      btnSalir.addEventListener('click', function (e) {
        e.preventDefault();
        hhCerrarSesion();
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


document.addEventListener('DOMContentLoaded', function () {

// Datos personales
  const formDatosPersonales = document.getElementById('formDatosPersonales');

  if (formDatosPersonales) {
    formDatosPersonales.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validar campos vacíos
      const campos = formDatosPersonales.querySelectorAll('input, select');
      let esValido = true;

      campos.forEach(campo => {
        if (!campo.value.trim()) {
          campo.classList.add('is-invalid');
          esValido = false;
        } else {
          campo.classList.remove('is-invalid');
        }
      });

      if (!esValido) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }

      // Validar Edad (mayoría de edad)
      const diaInput = document.getElementById('diaNacimiento');
      const mesSelect = document.getElementById('mesNacimiento');
      const anioInput = document.getElementById('anioNacimiento');

      if (diaInput && mesSelect && anioInput) {
        const dia = parseInt(diaInput.value);
        const mes = parseInt(mesSelect.value);
        const anio = parseInt(anioInput.value);

        const fechaNac = new Date(anio, mes, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const diffMeses = hoy.getMonth() - fechaNac.getMonth();

        if (diffMeses < 0 || (diffMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
          edad--;
        }

        if (edad < 18) {
          alert('Debes ser mayor de 18 años para registrarte.');
          return;
        }
      }

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

      // Validaciones
      if (!email || !pass) {
        alert('Por favor, ingresa correo y contraseña.');
        return;
      }

      const tieneMinuscula = /[a-z]/.test(pass);
      const tieneMayuscula = /[A-Z]/.test(pass);
      const tieneNumero = /[0-9]/.test(pass);

      if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      if (!tieneMinuscula || !tieneMayuscula || !tieneNumero) {
        alert('La contraseña debe incluir al menos una letra mayúscula, una minúscula y un número.');
        return;
      }

      // Toast de Bootstrap o Alerta
      const toastEl = document.getElementById('toastUsuarioCreado');
      
      if (toastEl && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        setTimeout(() => {
          window.location.href = 'Principal.html';
        }, 2000);
      } else {
        alert('¡Usuario creado con éxito!');
        window.location.href = 'Principal.html';
      }
    });

    // Mostrar / Ocultar Contraseña
    const btnToggle = document.getElementById('togglePassword');
    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        const passInput = document.getElementById('typePassword');
        const icon = document.getElementById('toggleIcon');

        if (passInput && icon) {
          const esPassword = passInput.type === 'password';
          passInput.type = esPassword ? 'text' : 'password';
          icon.classList.toggle('bi-eye');
          icon.classList.toggle('bi-eye-slash');
        }
      });
    }
  }


  // INICIAR SESIÓN
  const formIngresar = document.getElementById('formIngresar');

  if (formIngresar) {
    formIngresar.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('typeEmail');
      const passInput = document.getElementById('typePassword');

      if (!emailInput || !passInput) return;

      const email = emailInput.value.trim();
      const pass = passInput.value.trim();

      // 1. Validar campos vacíos
      if (!email || !pass) {
        alert('Por favor, ingresa tu correo y contraseña para ingresar.');
        return;
      }

      // 2. Validaciones de la contraseña
      const tieneMinuscula = /[a-z]/.test(pass);
      const tieneMayuscula = /[A-Z]/.test(pass);
      const tieneNumero = /[0-9]/.test(pass);

      if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      if (!tieneMinuscula || !tieneMayuscula || !tieneNumero) {
        alert('La contraseña debe incluir al menos una letra mayúscula, una minúscula y un número.');
        return;
      }

      // 3. Confirmación de inicio de sesión exitoso y redirección
      alert('¡Bienvenido de nuevo! Has ingresado con éxito.');
      window.location.href = 'Principal.html';
    });
  }

});