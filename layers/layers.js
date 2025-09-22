var wms_layers = [];


        var lyr_GoogleSatellite_0 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });

        var lyr_OpenStreetMap_1 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_MuhammadMuzaki_2 = new ol.format.GeoJSON();
var features_MuhammadMuzaki_2 = format_MuhammadMuzaki_2.readFeatures(json_MuhammadMuzaki_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MuhammadMuzaki_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MuhammadMuzaki_2.addFeatures(features_MuhammadMuzaki_2);
var lyr_MuhammadMuzaki_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MuhammadMuzaki_2, 
                style: style_MuhammadMuzaki_2,
                popuplayertitle: 'Muhammad Muzaki',
                interactive: true,
    title: 'Muhammad Muzaki<br />\
    <img src="styles/legend/MuhammadMuzaki_2_0.png" /> 1<br />\
    <img src="styles/legend/MuhammadMuzaki_2_1.png" /> 2<br />\
    <img src="styles/legend/MuhammadMuzaki_2_2.png" /> 3<br />\
    <img src="styles/legend/MuhammadMuzaki_2_3.png" /> 4<br />\
    <img src="styles/legend/MuhammadMuzaki_2_4.png" /> 5<br />\
    <img src="styles/legend/MuhammadMuzaki_2_5.png" /> 6<br />\
    <img src="styles/legend/MuhammadMuzaki_2_6.png" /> 7<br />\
    <img src="styles/legend/MuhammadMuzaki_2_7.png" /> 8<br />\
    <img src="styles/legend/MuhammadMuzaki_2_8.png" /> 9<br />\
    <img src="styles/legend/MuhammadMuzaki_2_9.png" /> 10<br />\
    <img src="styles/legend/MuhammadMuzaki_2_10.png" /> 11<br />\
    <img src="styles/legend/MuhammadMuzaki_2_11.png" /> 12<br />\
    <img src="styles/legend/MuhammadMuzaki_2_12.png" /> 13<br />\
    <img src="styles/legend/MuhammadMuzaki_2_13.png" /> 14<br />\
    <img src="styles/legend/MuhammadMuzaki_2_14.png" /> 15<br />\
    <img src="styles/legend/MuhammadMuzaki_2_15.png" /> 16<br />\
    <img src="styles/legend/MuhammadMuzaki_2_16.png" /> 17<br />\
    <img src="styles/legend/MuhammadMuzaki_2_17.png" /> 18<br />\
    <img src="styles/legend/MuhammadMuzaki_2_18.png" /> 19<br />\
    <img src="styles/legend/MuhammadMuzaki_2_19.png" /> 20<br />\
    <img src="styles/legend/MuhammadMuzaki_2_20.png" /> 21<br />\
    <img src="styles/legend/MuhammadMuzaki_2_21.png" /> 22<br />\
    <img src="styles/legend/MuhammadMuzaki_2_22.png" /> 23<br />\
    <img src="styles/legend/MuhammadMuzaki_2_23.png" /> 24<br />\
    <img src="styles/legend/MuhammadMuzaki_2_24.png" /> 25<br />\
    <img src="styles/legend/MuhammadMuzaki_2_25.png" /> 26<br />\
    <img src="styles/legend/MuhammadMuzaki_2_26.png" /> 27<br />\
    <img src="styles/legend/MuhammadMuzaki_2_27.png" /> 28<br />\
    <img src="styles/legend/MuhammadMuzaki_2_28.png" /> 29<br />\
    <img src="styles/legend/MuhammadMuzaki_2_29.png" /> 30<br />\
    <img src="styles/legend/MuhammadMuzaki_2_30.png" /> 31<br />\
    <img src="styles/legend/MuhammadMuzaki_2_31.png" /> 32<br />\
    <img src="styles/legend/MuhammadMuzaki_2_32.png" /> 33<br />\
    <img src="styles/legend/MuhammadMuzaki_2_33.png" /> 34<br />\
    <img src="styles/legend/MuhammadMuzaki_2_34.png" /> 35<br />\
    <img src="styles/legend/MuhammadMuzaki_2_35.png" /> 36<br />\
    <img src="styles/legend/MuhammadMuzaki_2_36.png" /> 37<br />\
    <img src="styles/legend/MuhammadMuzaki_2_37.png" /> 38<br />\
    <img src="styles/legend/MuhammadMuzaki_2_38.png" /> 39<br />\
    <img src="styles/legend/MuhammadMuzaki_2_39.png" /> <br />' });
var format_OSMROADMAGETAN_3 = new ol.format.GeoJSON();
var features_OSMROADMAGETAN_3 = format_OSMROADMAGETAN_3.readFeatures(json_OSMROADMAGETAN_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_OSMROADMAGETAN_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_OSMROADMAGETAN_3.addFeatures(features_OSMROADMAGETAN_3);
var lyr_OSMROADMAGETAN_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_OSMROADMAGETAN_3, 
                style: style_OSMROADMAGETAN_3,
                popuplayertitle: 'OSMROAD MAGETAN',
                interactive: false,
    title: 'OSMROAD MAGETAN<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_0.png" /> motorway<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_1.png" /> primary<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_2.png" /> secondary<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_3.png" /> tertiary<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_4.png" /> trunk<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_5.png" /> unclassified<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_6.png" /> motorway_link<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_7.png" /> path<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_8.png" /> residential<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_9.png" /> service<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_10.png" /> tertiary_link<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_11.png" /> track<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_12.png" /> trunk_link<br />\
    <img src="styles/legend/OSMROADMAGETAN_3_13.png" /> <br />' });
var format_TitikSampel_4 = new ol.format.GeoJSON();
var features_TitikSampel_4 = format_TitikSampel_4.readFeatures(json_TitikSampel_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_TitikSampel_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_TitikSampel_4.addFeatures(features_TitikSampel_4);
cluster_TitikSampel_4 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource_TitikSampel_4
});
var lyr_TitikSampel_4 = new ol.layer.Vector({
                declutter: false,
                source:cluster_TitikSampel_4, 
                style: style_TitikSampel_4,
                popuplayertitle: 'Titik Sampel',
                interactive: true,
                title: '<img src="styles/legend/TitikSampel_4.png" /> Titik Sampel'
            });

lyr_GoogleSatellite_0.setVisible(true);lyr_OpenStreetMap_1.setVisible(true);lyr_MuhammadMuzaki_2.setVisible(true);lyr_OSMROADMAGETAN_3.setVisible(true);lyr_TitikSampel_4.setVisible(true);
var layersList = [lyr_GoogleSatellite_0,lyr_OpenStreetMap_1,lyr_MuhammadMuzaki_2,lyr_OSMROADMAGETAN_3,lyr_TitikSampel_4];
lyr_MuhammadMuzaki_2.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'OBJECTID_1': 'OBJECTID_1', 'NOZN': 'NOZN', 'PENGGUNAAN': 'PENGGUNAAN', 'SMPBKREL': 'SMPBKREL', 'SMPBAKU': 'SMPBAKU', 'NILAIZN': 'NILAIZN', 'JMLSMPL': 'JMLSMPL', 'NILMIN': 'NILMIN', 'NILMAKS': 'NILMAKS', 'WADMKK': 'WADMKK', 'WADMPR': 'WADMPR', 'THNNILAI': 'THNNILAI', 'cluster': 'cluster', 'JNSZN': 'JNSZN', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', 'Luas_M2': 'Luas_M2', 'HISTZONE': 'HISTZONE', 'legenda': 'legenda', });
lyr_OSMROADMAGETAN_3.set('fieldAliases', {'osm_id': 'osm_id', 'code': 'code', 'fclass': 'fclass', 'name': 'name', 'ref': 'ref', 'oneway': 'oneway', 'maxspeed': 'maxspeed', 'layer': 'layer', 'bridge': 'bridge', 'tunnel': 'tunnel', });
lyr_TitikSampel_4.set('fieldAliases', {'No_Urut_En': 'No_Urut_En', 'Kode_Titik': 'Kode_Titik', 'Kecamatan': 'Kecamatan', 'Kelurahan': 'Kelurahan', 'XTM': 'XTM', 'YTM': 'YTM', 'Status_Kep': 'Status_Kep', 'Jenis_Data': 'Jenis_Data', 'Tanggal_Pe': 'Tanggal_Pe', 'Harga': 'Harga', 'Luas_tanah': 'Luas_tanah', 'Penggunaan': 'Penggunaan', 'Luas_Bangu': 'Luas_Bangu', 'Tahun_Pemb': 'Tahun_Pemb', 'Tahun_Reno': 'Tahun_Reno', });
lyr_MuhammadMuzaki_2.set('fieldImages', {'OBJECTID': 'TextEdit', 'OBJECTID_1': 'Range', 'NOZN': 'TextEdit', 'PENGGUNAAN': 'TextEdit', 'SMPBKREL': 'TextEdit', 'SMPBAKU': 'TextEdit', 'NILAIZN': 'TextEdit', 'JMLSMPL': 'TextEdit', 'NILMIN': 'TextEdit', 'NILMAKS': 'TextEdit', 'WADMKK': 'TextEdit', 'WADMPR': 'TextEdit', 'THNNILAI': 'TextEdit', 'cluster': 'TextEdit', 'JNSZN': 'Range', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', 'Luas_M2': 'TextEdit', 'HISTZONE': 'TextEdit', 'legenda': 'TextEdit', });
lyr_OSMROADMAGETAN_3.set('fieldImages', {'osm_id': 'TextEdit', 'code': 'Range', 'fclass': 'TextEdit', 'name': 'TextEdit', 'ref': 'TextEdit', 'oneway': 'TextEdit', 'maxspeed': 'Range', 'layer': 'TextEdit', 'bridge': 'TextEdit', 'tunnel': 'TextEdit', });
lyr_TitikSampel_4.set('fieldImages', {'No_Urut_En': '', 'Kode_Titik': '', 'Kecamatan': '', 'Kelurahan': '', 'XTM': '', 'YTM': '', 'Status_Kep': '', 'Jenis_Data': '', 'Tanggal_Pe': '', 'Harga': '', 'Luas_tanah': '', 'Penggunaan': '', 'Luas_Bangu': '', 'Tahun_Pemb': '', 'Tahun_Reno': '', });
lyr_MuhammadMuzaki_2.set('fieldLabels', {'OBJECTID': 'hidden field', 'OBJECTID_1': 'hidden field', 'NOZN': 'inline label - always visible', 'PENGGUNAAN': 'inline label - always visible', 'SMPBKREL': 'hidden field', 'SMPBAKU': 'hidden field', 'NILAIZN': 'hidden field', 'JMLSMPL': 'hidden field', 'NILMIN': 'hidden field', 'NILMAKS': 'hidden field', 'WADMKK': 'hidden field', 'WADMPR': 'hidden field', 'THNNILAI': 'hidden field', 'cluster': 'hidden field', 'JNSZN': 'hidden field', 'Shape_Leng': 'hidden field', 'Shape_Area': 'hidden field', 'Luas_M2': 'inline label - always visible', 'HISTZONE': 'inline label - always visible', 'legenda': 'hidden field', });
lyr_OSMROADMAGETAN_3.set('fieldLabels', {'osm_id': 'no label', 'code': 'no label', 'fclass': 'no label', 'name': 'no label', 'ref': 'no label', 'oneway': 'no label', 'maxspeed': 'no label', 'layer': 'no label', 'bridge': 'no label', 'tunnel': 'no label', });
lyr_TitikSampel_4.set('fieldLabels', {'No_Urut_En': 'inline label - always visible', 'Kode_Titik': 'inline label - always visible', 'Kecamatan': 'inline label - always visible', 'Kelurahan': 'inline label - always visible', 'XTM': 'inline label - always visible', 'YTM': 'inline label - always visible', 'Status_Kep': 'inline label - always visible', 'Jenis_Data': 'inline label - always visible', 'Tanggal_Pe': 'inline label - always visible', 'Harga': 'inline label - always visible', 'Luas_tanah': 'inline label - always visible', 'Penggunaan': 'inline label - always visible', 'Luas_Bangu': 'inline label - always visible', 'Tahun_Pemb': 'inline label - always visible', 'Tahun_Reno': 'inline label - always visible', });
lyr_TitikSampel_4.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});