let mymap = L.map('mapid').setView([49.3961, 15.59124], 14);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVmb2UxODgyIiwiYSI6ImNrZ2p6NHc1NTI2czMyeXMxcHlic2Uzb20ifQ.ooeZvawU4JmVuO_rQXrG0w', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);
let markers = [ //formát 0 lat, 1 lon, 2 id
    [49.394736, 15.587058, 1],
    [49.402134, 15.573264, 2],
    [49.395420, 15.591023, 3]
];
const url = 'http://zelda.sci.muni.cz:8080/geoserver/ows?service=wfs&version=1.0.0&request=GetFeature&srsName=urn:ogc:def:crs:EPSG::4326&typenames=webovka:goth_jihlava_lokality&outputFormat=csv&format_options=CHARSET:UTF-8'

const req = new XMLHttpRequest();
req.open("GET", url);
req.send();
let text = req.responseText;
console.log(text);







let images = [ // formát 0 id markeru, 1 'název' u aktuální fotky jinak 'o', 2 adresa souboru, 3 časové určení (0=chybí), 4 přesnost časového určení (0=chybí, 1=přibližné, 2=přesné), 5 zdroj obrázku, 6 popisek, 7 zdroj popisku, 8 id obrázku
    [1, 'Brána Matky Boží', 'images/1n1.jpg', 0, 0, 'http://www.turistickelisty.sportovnilisty.cz/mistopis/brana-matky-bozi-v-jihlave-se-dochovala-jako-jedina-z-puvodnich-bran-3/', 'Brána Matky Boží je poslední dochovaná brána z původních pěti bran opevnění města Jihlavy. Nachází se v ulici Matky Boží a dnes představuje jednu z dominant města. Společně se zbytky městských hradeb je chráněna jako kulturní památka.', 'https://cs.wikipedia.org/wiki/Br%C3%A1na_Matky_Bo%C5%BE%C3%AD', 1],
    [1, 'o', 'images/1o1.jpg', 1300, 1, 'http://luzs.cz/jihlavska-pevnost.html', 'Brána Matky Boží kolem roku 1300 (Gustav Krum / Jihlavská pevnost)', 'http://luzs.cz/jihlavska-pevnost.html', 2],
    [1, 'o', 'images/1o2.jpg', 1899, 2, 'https://cesky.radio.cz/jihlavska-brana-matky-bozi-ukryva-hvezdarnu-8603245#&gid=asset&pid=1', '', '', 3],
    [2, 'Stadion v Jiráskově ulici', 'images/2n1.jpg', 0, 0, 'https://www.fcvysocina.cz/zobraz.asp?t=stadion', 'Stadion fotbalového klubu FC Vysočina Jihlava.', '', 4],
    [2, 'o', 'images/2o1.jpg', 1999, 2, 'https://www.fcvysocina.cz/fotogalerie.asp?sezona=&typ=9&slovo=&poslano=true', '', '', 5],
    [3, 'Obchodní dům Prior', 'images/3n1.jpg', 2020, 2, 'https://jihlavsky.denik.cz/zpravy_region/vitriny-jihlava-prior-20200506.html', '', '', 6],
    [3, 'o', 'images/3o1.jpg', 0, 0, 'http://galerie.zjihlavy.cz/jihlava-historicke-namesti/kretzl-spalicek-004.html', 'Krecl neboli Špalíček byl soubor historických středověkých domů, který až do roku 1975 stával na Masarykově náměstí v Jihlavě.', 'https://cs.wikipedia.org/wiki/Krecl', 7]
];
let att_marker = L.Marker.extend({ //přidá merkeru nějaké parametry
    options: {
        idm : 'id',
        title : 'title',
        descr : 'descr',
        descr_source : 'descr_source'
    }
});
let focusIcon = L.icon({
    iconUrl : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
let defaultIcon;
for (let i=0; i<markers.length; i++) {// zobrazí markery, uloží k němu pár parametrů a popup názvu, žlutý hover
    let lat = markers[i][0];
    let lon = markers[i][1];
    let id = markers[i][2];
    for (let x=0; x<images.length; x++) {
        if (id === images[x][0] && images[x][1] != 'o') {
            title = images[x][1];
            let marker = new att_marker([lat, lon], {
                idm : images[x][0],
                title : images[x][1],
                descr : images[x][6],
                descr_source : images[x][7]
            }).on('click', function(){
                marker.setIcon(focusIcon);})
            .bindPopup(title)
            .on('mouseover', function(){
                this.openPopup();
                defaultIcon = this.options.icon; 
                marker.setIcon(focusIcon);})
            .on('mouseout', function(){
                this.closePopup();
                marker.setIcon(defaultIcon);})
            .on('click', selected_marker)
            .addTo(mymap)};
    }
}
let l_img_open = false;

function selected_marker(e) {
    let is_o_img = document.getElementById('photos'); //smaže již zobrazené fotky
    if (is_o_img.hasChildNodes()) {
        is_o_img.innerHTML = "";
    }
    document.getElementById('title').innerHTML = e.sourceTarget.options.title;    //zobrazí titulek, popisek
    document.getElementById('description').innerHTML = e.sourceTarget.options.descr;

    if (e.sourceTarget.options.descr_source != '') {
        let image_source = document.createElement('a'); // zobrazí zdroj textu za popisem
        image_source.innerHTML = '(zdroj textu)';
        image_source.href = e.sourceTarget.options.descr_source;
        let d = document.getElementById('description');
        let nl = document.createElement('br');
        d.appendChild(nl);
        document.getElementById('description').appendChild(image_source);
    }
    for (let x=0; x<images.length; x++) {// nahraje miniatury obrázků
        if (e.sourceTarget.options.idm === images[x][0]){
            let img = document.createElement('img');
            img.src = images[x][2];
            img.id = images[x][8];
            img.des = images[x][6];
            img.n_o = images[x][1];
            img.tim = images[x][3];
            img.tim_acc = images[x][4];
            img.onclick = function() { // zvětší obrázek při kliknutí na miniaturu
                if (l_img_open === false){
                    l_img_open = true;
                    let large_frame = document.createElement('div');
                    large_frame.id = 'lf';
                    document.getElementById('main').appendChild(large_frame);
                    document.getElementById('lf').style.visibility = 'visible';
                    
                    let img_d = document.createElement('div');
                    img_d.id = 'img_d';
                    if (this.n_o == 'o'){
                        img_d.innerText = this.des;
                    }
                    let time = '';
                    if (this.tim > 0 && this.tim_acc > 0){
                        if (this.tim_acc == 1) {
                            time = ' Rok:'+'\xa0'+this.tim+' (přibližně)';
                        } else {
                            time = ' Rok:'+'\xa0'+this.tim;
                        }
                    } else {
                        time = ' Rok:'+'\xa0'+'neznámý';
                    }
                    let d_time = document.createTextNode(time);
                    img_d.appendChild(d_time);
                    document.getElementById('lf').appendChild(img_d);
                    
                    large_image = document.createElement('img');
                    large_image.src = this.src;
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
                    }
                    document.getElementById('lf').appendChild(exit);
                }
            } 
            document.getElementById('photos').appendChild(img);
        };
    };
};
