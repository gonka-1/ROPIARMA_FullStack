/* DATOS DE LAS SEDES */
var sedes = [
    { nombre: "Huerto Central (Santiago)", lat: -33.4985, lng: -70.6173, descripcion: "Emco 4780, San Joaquín, Santiago" },
    { nombre: "Sede Puerto Montt", lat: -41.4716, lng: -72.9405, descripcion: "Serrano 129, Puerto Montt, Los Lagos" },
    { nombre: "Sede Villarrica", lat: -39.2783, lng: -72.2241, descripcion: "Av. Pedro de Valdivia 905, Villarrica, Araucanía" },
    { nombre: "Sede Nacimiento", lat: -37.5023, lng: -72.6749, descripcion: "Baquedano 563, Nacimiento, Bío Bío" },
    { nombre: "Sede Viña del Mar", lat: -33.0104, lng: -71.5463, descripcion: "11 Nte. 851, Viña del Mar, Valparaíso" },
    { nombre: "Sede Valparaíso", lat: -33.0298, lng: -71.6293, descripcion: "Necochea 159, Valparaíso" },
    { nombre: "Sede Concepción", lat: -36.8268, lng: -73.0415, descripcion: "Martín García Oñez de Loyola 18, Concepción, Bío Bío" }
];

var indexActual = 0;
var map;
var marcadores = [];



function inicializarMapa() {

    map = L.map('mapa').setView([sedes[0].lat, sedes[0].lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap | Huerto Hogar'
    }).addTo(map);


    sedes.forEach(function (sede) {
        var marker = L.marker([sede.lat, sede.lng]).addTo(map);
        
        marker.bindPopup(`
            <div style="text-align:center;">
                <b style="color: #2d5a27; font-size: 16px;">${sede.nombre}</b><br>
                <span style="color: #6c757d; font-size: 14px;">${sede.descripcion}</span>
            </div>
        `);
        
        marcadores.push(marker);
    });


    var infoSede = document.getElementById("info-sede");
    if (infoSede !== null) {
        infoSede.innerText = sedes[0].nombre;
    }
    
    marcadores[0].openPopup();
}

function cambiarSede(direccion) {
    indexActual += direccion;


    if (indexActual >= sedes.length) {
        indexActual = 0; 
    } else if (indexActual < 0) {
        indexActual = sedes.length - 1;
    }

    var sedeActual = sedes[indexActual];


    map.flyTo([sedeActual.lat, sedeActual.lng], 15, {
        duration: 1.5
    });


    marcadores[indexActual].openPopup();
    

    var infoSede = document.getElementById("info-sede");
    if (infoSede !== null) {
        infoSede.innerText = sedeActual.nombre;
    }
}


if (document.getElementById("mapa") !== null) {
    inicializarMapa();
}