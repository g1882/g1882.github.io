document.getElementById('home').onclick = function () {
    location.href = 'index.html';
};
function Validation(){ //validace při odeslání formuláře
    if (document.getElementById('contact').value === ""){
        alert('Vyplntě vaší emailovou adresu');
        return false;
    }
    else if (document.getElementById('up').files.length === 0) {
        alert('Nahrajte obrázek.');
        return false;
    }
    else if ((document.getElementById('object').value === "") && (b1b2)){
        alert('Vyberte objekt na mapě.');
        return false;
    }
    else if (document.getElementById('message').value === ""){
        alert('Popište obrázky.');
        return false;
    }
    else {
        return true;
    }
};
const mymap = L.map('mapid').setView([49.3961, 15.59124], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVmb2UxODgyIiwiYSI6ImNrZ2p6NHc1NTI2czMyeXMxcHlic2Uzb20ifQ.ooeZvawU4JmVuO_rQXrG0w', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);

const loc_cluster = L.markerClusterGroup({
    maxClusterRadius: 80,
    iconCreateFunction: function (cluster) {
        const locs = cluster.getAllChildMarkers();
        let html = '<div class="circle">' + locs.length + '</div>';
        return L.divIcon({ 
            html: html, 
            className: 'mycluster',
            iconSize: L.point(20, 20),
        });
    },
    showCoverageOnHover: false
}).addTo(mymap);

let j_markers;
const focusIcon = L.icon({
    iconUrl : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let defaultIcon;
let b1b2 = false;
function onEachFeature(feature, layer) {
    layer
        .bindPopup(feature.properties['nazev'])
        .on('mouseover', function(){
            this.openPopup();
            defaultIcon = this.options.icon; 
            layer.setIcon(focusIcon);}
            )
        .on('mouseout', function(){
            this.closePopup();
            layer.setIcon(defaultIcon);}
            )
        .on('click', selected)
};
const points_url = 'https://zelda.sci.muni.cz/geoserver/webovka/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=webovka:goth_jihlava_lokality&srsName=urn:ogc:def:crs:EPSG::4326&outputFormat=json';
fetch(points_url)
    .then(response => response.json())
    .then(output => {
        j_markers = output;
        let markers = L.geoJSON(j_markers, {
            onEachFeature: onEachFeature
        })
        loc_cluster.addLayer(markers);
    });
function selected(e){
    if (b1b2){
        document.getElementById('pick').style.color = 'grey'; 
        let s = document.getElementById('loc_selected');
        s.innerText = e.sourceTarget.feature.properties['nazev'];
        s.style.backgroundColor = 'white';
        document.getElementById('object').innerText = e.sourceTarget.feature.properties['nazev'];
    }
}
let newMarker;
function addMarker(e){
    document.getElementById('mapid').style.cursor = ''
    if (newMarker){
        mymap.removeLayer(newMarker);
    }
    newMarker = new L.marker(e.latlng, {draggable:true}).addTo(mymap);
    newMarker.setIcon(focusIcon);
    document.getElementById('object').innerText = e.latlng;
}
let b1 = document.getElementById('on_map'); //vybrat existující lokalitu
b1.addEventListener('click', function(){
    b1b2 = true;
    b2.disabled = true;
    document.getElementById('pick').style.display = 'block';
    document.getElementById('form').style.visibility = 'visible';
    document.getElementById('loc_name').remove();
});
let b2 = document.getElementById('not_on_map'); //přidat novou lokalitu
b2.addEventListener('click', function(){
    b1.disabled = true;
    document.getElementById('form').style.visibility = 'visible';
    document.getElementById('mapid').style.cursor = 'crosshair';
    mymap.on('click', addMarker);
});
