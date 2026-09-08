function validacionCuenta() {
    var correo = document.getElementById('Email').value.trim();
    var pass = document.getElementById('Password').value;

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