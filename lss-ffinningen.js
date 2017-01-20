var color_fw       = 'red';
var color_thw      = 'blue';
var color_pol      = 'green';
var color_rd       = 'pink';
var color_wasser   = 'blue';

var B1_AAO         = 'aao_1025454';
var B2_AAO         = 'aao_1025456';
var B2_DL_AAO      = 'aao_1025481';
var B3_AAO         = 'aao_1025458';
var B3_DL_AAO      = 'aao_1026046';

var veh_driving = document.getElementById('mission_vehicle_driving');
var veh_mission = document.getElementById('mission_vehicle_at_mission');

var elems = document.querySelectorAll('h3#missionH1');
for (var i = 0, len = elems.length; i < len; i++){
    var test;
    var orig = elems[i].innerHTML;
    elems[i].innerHTML = elems[i].innerHTML.replace(/(<small>[^.]+<\/small>)/ig, '');
    test = elems[i].innerText;

    switch(test) {
        case (test.match('Mülleimerbrand') ||
              test.match('Containerbrand') ||
              test.match('Brennender PKW') ||
              test.match('Motorrad-Brand') ||
              test.match('Brennendes Gras') ||
              test.match('Brennendes Laub') ||
              test.match('Fettbrand in Pommesbude') ||
              test.match('Sperrmüllbrand') ||
              test.match('Strohballen Brand') ||
              test.match('Traktor Brand') ||
              test.match('Brennende Telefonzelle') ||
              test.match('Baum auf Straße') ||
              test.match('Kleiner Waldbrand') ||
              test.match('Brand in Briefkasten') ||
              test.match('Brennendes Gebüsch') ||
              test.match('Brennender Anhänger') ||
              test.match('Brennendes Bus-Häuschen') ||
              test.match('Verkehrsunfall') ||
              test.match('Auslaufende Betriebsstoffe') ||
              test.match('Brand auf Weihnachtsmarkt') ||
              test.match('Kleintier in Not') ||
              test.match('Brennender Bollerwagen') ||
              test.match('Kleine Ölspur') ||
              test.match('Brennende Vogelscheuche') ||
              test.match('Brennende Papiercontainer') ||
              test.match('Brennende Hecke') ||
              test.match('Äste auf Fahrbahn') ||
              test.match('Umherfliegendes Baumaterial') ||
              test.match('Baum auf Radweg') ||
              test.match('Feuerprobealarm an Schule') ||
              test.match('Keller unter Wasser') ||
              {}).input:

            B1(elems[i], orig);
            break;

        case (test.match('Gartenlaubenbrand') ||
              test.match('Brennender LKW') ||
              test.match('Wohnwagenbrand') ||
              test.match('Kleiner Feldbrand') ||
              test.match('Feuer auf Balkon') ||
              test.match('Flächenbrand') ||
              test.match('Küchenbrand') ||
              {}).input:

            B2(elems[i], orig);
            break;

        case (test.match('Zimmerbrand') ||
              test.match('Schornsteinbrand') ||
              {}).input:

            B2_DL(elems[i], orig);
            break;

        case (test.match('Feuer in Schnellrestaurant') ||
              test.match('Kellerbrand') ||
              {}).input:
            B3(elems[i], orig);
            break;

        case (test.match('Dachstuhlbrand') ||
              {}).input:

            B3_DL(elems[i], orig);
            break;
    }
}

function B1(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B1</b></font>'+orig;

    if (veh_driving === null && veh_mission === null) {
        document.getElementById(B1_AAO).click();
    }
}
function B2(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B2</b></font>'+orig;
    if (veh_driving === null && veh_mission === null) {
        document.getElementById(B2_AAO).click();
    }
}
function B2_P(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B2 P</b></font>'+orig;
}
function B2_DL(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B2 DL</b></font>'+orig;
    if (veh_driving === null && veh_mission === null) {
        document.getElementById(B2_DL_AAO).click();
    }
}
function B2_DL_P(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B2_kZug</b></font>'+orig;
}
function B3(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B3</b></font>'+orig;
    if (veh_driving === null && veh_mission === null) {
        document.getElementById(B3_AAO).click();
    }
}
function B3_P(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B3 P</b></font>'+orig;
}
function B3_DL(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B3 DL</b></font>'+orig;
    if (veh_driving === null && veh_mission === null) {
        document.getElementById(B3_DL_AAO).click();
    }
}
function B3_DL_P(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B3_kZug</b></font>'+orig;
}
function B3_DL_ELW_P(el, orig) {
    el.innerHTML = '<font color='+color_fw+'><b>B3_LZ</b></font>'+orig;
}
