let mymap = L.map('mapid').setView([49.3961, 15.59124], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVmb2UxODgyIiwiYSI6ImNrZ2p6NHc1NTI2czMyeXMxcHlic2Uzb20ifQ.ooeZvawU4JmVuO_rQXrG0w', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);

const points_url = 'https://zelda.sci.muni.cz/geoserver/ows?service=wfs&version=1.0.0&request=GetFeature&srsName=urn:ogc:def:crs:EPSG::4326&typenames=webovka:goth_jihlava_lokality&outputFormat=json&format_options=CHARSET:UTF-8';
let j_markers;
let j_images;

let focusIcon = L.icon({
    iconUrl : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let defaultIcon;

function onEachFeature(feature, layer) {
    layer
        .bindPopup(feature.properties['nazev'])
        .on('mouseover', function(){
            this.openPopup();
            defaultIcon = this.options.icon; 
            layer.setIcon(focusIcon);})
        .on('mouseout', function(){
            this.closePopup();
            layer.setIcon(defaultIcon);})
        .on('click', selected)
};
fetch('locations.json') // sem potom points_url
    .then(response => response.json())
    .then(output => {
        j_markers = output;
        //console.log(j_markers); //j_markers.features[i].properties['fid']) - fid lokality
        let markers = new L.geoJSON(j_markers, {
            onEachFeature: onEachFeature
        }).addTo(mymap);
    });
fetch('images.json')
    .then(response => response.json())
    .then(output => {
        j_images = output; //j_images[4].obj_id - fid lokality
    });
let l_img_open = false;

function selected(e) {
    const et = e.sourceTarget.feature;
    let displayed = document.getElementById('photos'); //smaže zobrazené fotky
    if (displayed.hasChildNodes()) {
        displayed.innerHTML = "";
    };
    for (let i=0; i<j_images.length; i++) { //zobrazí titulek a popisek lokality
        if ((j_images[i].obj_id == et.properties['fid']) && (j_images[i].title != "o")) {
            document.getElementById('title').innerHTML = j_images[i].title;
            document.getElementById('description').innerHTML = j_images[i].desc;
            if (j_images[i].d_src != '') {
                let d_source = document.createElement('a'); // zobrazí zdroj textu za popisem
                d_source.innerHTML = '(zdroj textu)';
                d_source.href = j_images[i].d_src;
                let d = document.getElementById('description');
                let nl = document.createElement('br');
                d.appendChild(nl);
                document.getElementById('description').appendChild(d_source);
            }
        }
    };
    const alt = document.getElementById('title').innerHTML;
    for (let i=0; i<j_images.length; i++) {
        if (et.properties['fid'] == j_images[i].obj_id) {
            let img = document.createElement('img');
            img.src = j_images[i].src;
            img.alt = alt;
            img.onclick = function(){
                if (l_img_open === false){
                    l_img_open = true;
                    let large_frame = document.createElement('div');
                    large_frame.id = 'lf';
                    document.getElementById('main').appendChild(large_frame);
                    document.getElementById('lf').style.visibility = 'visible';
                    
                    let img_d = document.createElement('div');
                    img_d.id = 'img_d';
                    if ((j_images[i].title == 'o') && (j_images[i].desc != '')){
                        img_d.innerText = j_images[i].desc;
                    };
                    let time = '';
                    if ((j_images[i].year > 0) && (j_images[i].acc > 0)){
                        if (j_images[i].acc == 1) {
                            time = ' Rok:'+'\xa0'+j_images[i].year+' (přibližně)';
                        } else {
                            time = ' Rok:'+'\xa0'+j_images[i].year;
                        }
                    } else {
                        time = ' Rok:'+'\xa0'+'neznámý';
                    }
                    let d_time = document.createTextNode(time);
                    img_d.appendChild(d_time);
                    document.getElementById('lf').appendChild(img_d);

                    large_image = document.createElement('img');
                    large_image.src = j_images[i].src;
                    large_image.alt = alt;
                    large_image.id = 'large_img';
                    document.getElementById('lf').appendChild(large_image);

                    let exit = document.createElement('button');
                    exit.id = 'exit';
                    exit.innerHTML = 'X';
                    exit.onclick = function () { //zavře zvětšený obrázek
                        let l_img = document.getElementById('large_img');
                        let p = document.getElementById('lf');
                        p.removeChild(l_img);
                        let e = document.getElementById('exit');
                        p.removeChild(e);
                        document.getElementById('lf').style.visibility = 'hidden';
                        l_img_open = false;
                        let y = document.getElementById('img_d');
                        p.removeChild(y);
                    };
                    document.getElementById('lf').appendChild(exit);
                };
            }; 
            document.getElementById('photos').appendChild(img);
        };
    };
};
//css miniatury obrázků: mouseover
//zúžit mapu
//záložka se zdroji
//nativní aspekt obrázků