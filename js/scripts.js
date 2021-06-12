// Mapa Leaflet
var mapa = L.map('mapid').setView([9.95, -84.15], 13);

// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Otra capa base esri
var capa_esri = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
).addTo(mapa)

// Conjunto de capas base
var capas_base = {
  "ESRI": capa_esri,
  "OSM": capa_osm,
};

// Ícono personalizado para asentamientos informales
const iconoVivienda = L.divIcon({
  html: '<i class="fas fa-house-damage-2x"></i>',
  className: 'estiloIconos'
});
	    
// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

// Capa vectorial de centroides asentamientos informales en formato GeoJSON

$.getJSON("https://dvictoria2020.github.io/tarea-4/datos/asentamientos_informales.geojson", function(geodata) {
  //Registros individuales
  var capa_asentamientos_informales = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "grey", 'weight': 1.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre del Asentamiento Informal</strong>: " + feature.properties.nombre_asentamiento + "<br>" + "<strong>Distrito</strong>: " + feature.properties.distrito + "<br>" + "<strong>Cantidad de viviendas</strong>: " + feature.properties.viviendas;
      layer.bindPopup(popupText);
    },			
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoVivienda});
    }
  });

  // Registros agrupados
  var asentamientos_informales_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  asentamientos_informales_agrupados.addLayer(capa_asentamientos_informales);

  // Se añade la capa al mapa y al control de capas
  asentamientos_informales_agrupados.addTo(mapa);
  control_capas.addOverlay(asentamientos_informales_agrupados, 'Asentamientos informales agrupados');
  control_capas.addOverlay(capa_asentamientos_informales, 'Asentamientos informales individuales');
  });