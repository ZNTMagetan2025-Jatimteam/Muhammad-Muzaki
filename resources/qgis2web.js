// =================== MAP (ringan) ===================
var map = new ol.Map({
  target: 'map',
  renderer: 'canvas',
  pixelRatio: 1, // ↓ resolusi render biar ringan di HP
  layers: layersList,
  view: new ol.View({
    maxZoom: 28,
    minZoom: 1,
    enableRotation: false // matikan rotasi
  })
});

// pastikan semua interaksi rotasi bener2 off
map.getInteractions().forEach(function (i) {
  if (i instanceof ol.interaction.DragRotate || i instanceof ol.interaction.PinchRotate) {
    map.removeInteraction(i);
  }
});

// initial view - epsg:3857 coordinates if not "Match project CRS"
map.getView().fit([12380303.848863, -872308.820723, 12426751.219873, -848550.976236], map.getSize());

// ================ small screen definition ================
var hasTouchScreen = map.getViewport().classList.contains('ol-touch');
var isSmallScreen = window.innerWidth < 650;

// ================== controls container ==================
var topLeftContainer = new ol.control.Control({
  element: (() => {
    var d = document.createElement('div');
    d.id = 'top-left-container';
    return d;
  })(),
});
map.addControl(topLeftContainer);

var bottomLeftContainer = new ol.control.Control({
  element: (() => {
    var d = document.createElement('div');
    d.id = 'bottom-left-container';
    return d;
  })(),
});
map.addControl(bottomLeftContainer);

var topRightContainer = new ol.control.Control({
  element: (() => {
    var d = document.createElement('div');
    d.id = 'top-right-container';
    return d;
  })(),
});
map.addControl(topRightContainer);

var bottomRightContainer = new ol.control.Control({
  element: (() => {
    var d = document.createElement('div');
    d.id = 'bottom-right-container';
    return d;
  })(),
});
map.addControl(bottomRightContainer);

// ========================= popup =========================
var container = document.getElementById('popup');
var content   = document.getElementById('popup-content');
var closer    = document.getElementById('popup-closer');
var sketch;

closer.onclick = function() {
  container.style.display = 'none';
  closer.blur();
  return false;
};
var overlayPopup = new ol.Overlay({
  element: container,
  autoPan: true
});
map.addOverlay(overlayPopup);

var NO_POPUP = 0;
var ALL_FIELDS = 1;

function getPopupFields(layerList, layer) {
  var idx = layersList.indexOf(layer) - (layersList.length - popupLayers.length);
  return popupLayers[idx];
}

// ============ highlight collection (lebih hemat) ============
var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: collection,
    useSpatialIndex: false
  }),
  // style default; highlight via click masih bisa kalau dipakai
  style: [new ol.style.Style({
    stroke: new ol.style.Stroke({ color: '#f00', width: 1 }),
    fill:   new ol.style.Fill({ color: 'rgba(255,0,0,0.1)' })
  })],
  updateWhileAnimating: false,   // <-- dulunya true (lebih berat)
  updateWhileInteracting: false  // <-- dulunya true (lebih berat)
});

var doHighlight = false; // <-- matikan hover highlight
var doHover     = false; // <-- matikan popup hover (berat di HP)

function createPopupField(currentFeature, currentFeatureKeys, layer) {
  var popupText = '';
  for (var i = 0; i < currentFeatureKeys.length; i++) {
    if (currentFeatureKeys[i] != 'geometry' && currentFeatureKeys[i] != 'layerObject' && currentFeatureKeys[i] != 'idO') {
      var popupField = '';
      if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "hidden field") {
        continue;
      } else if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
        if (currentFeature.get(currentFeatureKeys[i]) == null) continue;
      }
      if (
        layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - always visible" ||
        layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data"
      ) {
        popupField += '<th>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</th><td>';
      } else {
        popupField += '<td colspan="2">';
      }
      if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
        if (currentFeature.get(currentFeatureKeys[i]) == null) continue;
      }
      if (
        layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - always visible" ||
        layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data"
      ) {
        popupField += '<strong>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</strong><br />';
      }

      if (layer.get('fieldImages')[currentFeatureKeys[i]] != "ExternalResource") {
        popupField += (currentFeature.get(currentFeatureKeys[i]) != null ? autolinker.link(currentFeature.get(currentFeatureKeys[i]).toLocaleString()) + '</td>' : '');
      } else {
        var fieldValue = currentFeature.get(currentFeatureKeys[i]);
        if (/\.(gif|jpg|jpeg|tif|tiff|png|avif|webp|svg)$/i.test(fieldValue)) {
          popupField += (fieldValue != null ? '<img src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" /></td>' : '');
        } else if (/\.(mp4|webm|ogg|avi|mov|flv)$/i.test(fieldValue)) {
          popupField += (fieldValue != null ? '<video controls><source src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" type="video/mp4">Il tuo browser non supporta il tag video.</video></td>' : '');
        } else {
          popupField += (fieldValue != null ? autolinker.link(fieldValue.toLocaleString()) + '</td>' : '');
        }
      }
      popupText += '<tr>' + popupField + '</tr>';
    }
  }
  return popupText;
}

var highlight;
var autolinker = new Autolinker({ truncate: { length: 30, location: 'smart' } });

// ================== (DISABLED) HOVER HANDLER ==================
// Fungsi dibiarkan ada, tapi LISTENER-nya tidak dipasang agar ringan.
// map.on('pointermove', onPointerMove);
function onPointerMove(evt) {
  if (!doHover && !doHighlight) return;
  // ... (biarkan kosong / atau isi aslinya kalau perlu)
}

// ================== POPUP via SINGLE CLICK ===================
var popupContent = '';
var popupCoord   = null;
var featuresPopupActive = false;

function updatePopup() {
  if (popupContent) {
    content.innerHTML = popupContent;
    container.style.display = 'block';
    overlayPopup.setPosition(popupCoord);
  } else {
    container.style.display = 'none';
    closer.blur();
  }
}

function onSingleClickFeatures(evt) {
  if (doHover || sketch) return;
  if (!featuresPopupActive) featuresPopupActive = true;

  var pixel = map.getEventPixel(evt.originalEvent);
  var coord = evt.coordinate;
  var currentFeature;
  var currentFeatureKeys;
  var clusteredFeatures;
  var popupText = '<ul>';

  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined)) {
      var doPopup = false;
      for (var k in layer.get('fieldImages')) {
        if (layer.get('fieldImages')[k] !== "Hidden") doPopup = true;
      }
      currentFeature = feature;
      clusteredFeatures = feature.get("features");
      if (typeof clusteredFeatures !== "undefined") {
        if (doPopup) {
          for (var n = 0; n < clusteredFeatures.length; n++) {
            currentFeature = clusteredFeatures[n];
            currentFeatureKeys = currentFeature.getKeys();
            popupText += '<li><table>';
            popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
            popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
            popupText += '</table></li>';
          }
        }
      } else {
        currentFeatureKeys = currentFeature.getKeys();
        if (doPopup) {
          popupText += '<li><table>';
          popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
          popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
          popupText += '</table>';
        }
      }
    }
  });
  if (popupText === '<ul>') {
    popupText = '';
  } else {
    popupText += '</ul>';
  }

  popupContent = popupText;
  popupCoord   = coord;
  updatePopup();
}

function onSingleClickWMS(evt) {
  if (doHover || sketch) return;
  if (!featuresPopupActive) popupContent = '';

  var coord = evt.coordinate;
  var viewProjection = map.getView().getProjection();
  var viewResolution = map.getView().getResolution();

  for (var i = 0; i < wms_layers.length; i++) {
    if (wms_layers[i][1] && wms_layers[i][0].getVisible()) {
      var url = wms_layers[i][0].getSource().getFeatureInfoUrl(
        evt.coordinate, viewResolution, viewProjection, { 'INFO_FORMAT': 'text/html' }
      );
      if (url) {
        const wmsTitle = wms_layers[i][0].get('popuplayertitle');
        var ldsRoller = '<div id="lds-roller"><img class="lds-roller-img" style="height: 25px; width: 25px;"></img></div>';

        popupCoord   = coord;
        popupContent += ldsRoller;
        updatePopup();

        var timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => { reject(new Error('Timeout exceeded')); }, 5000);
        });

        function tryFetch(urls) {
          if (urls.length === 0) return Promise.reject(new Error('All fetch attempts failed'));
          return fetch(urls[0])
            .then((response) => {
              if (response.ok) return response.text();
              throw new Error('Fetch failed');
            })
            .catch(() => tryFetch(urls.slice(1)));
        }

        const urlsToTry = [ url, encodeURIComponent(url), 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url) ];

        Promise.race([ tryFetch(urlsToTry), timeoutPromise ])
          .then((html) => {
            if (html.indexOf('<table') !== -1) {
              popupContent += '<a><b>' + wmsTitle + '</b></a>';
              popupContent += html + '<p></p>';
              updatePopup();
            }
          })
          .finally(() => {
            setTimeout(() => {
              var loaderIcon = document.querySelector('#lds-roller');
              if (loaderIcon) loaderIcon.remove();
            }, 500);
          });
      }
    }
  }
}

map.on('singleclick', onSingleClickFeatures);
map.on('singleclick', onSingleClickWMS);

// ==================== get container DOM ====================
var topLeftContainerDiv    = document.getElementById('top-left-container');
var bottomLeftContainerDiv = document.getElementById('bottom-left-container');
var bottomRightContainerDiv= document.getElementById('bottom-right-container');

// ======================= geolocate =========================
let isTracking = false;

const geolocateButton = document.createElement('button');
geolocateButton.className = 'geolocate-button fa fa-map-marker';
geolocateButton.title = 'Geolocalizza';

const geolocateControl = document.createElement('div');
geolocateControl.className = 'ol-unselectable ol-control geolocate';
geolocateControl.appendChild(geolocateButton);
map.getTargetElement().appendChild(geolocateControl);

const accuracyFeature = new ol.Feature();
const positionFeature = new ol.Feature({
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: '#3399CC' }),
      stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
    })
  })
});

const geolocateOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({ features: [accuracyFeature, positionFeature] })
});

const geolocation = new ol.Geolocation({
  projection: map.getView().getProjection()
});

geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});
geolocation.on('change:position', function () {
  const coords = geolocation.getPosition();
  positionFeature.setGeometry(coords ? new ol.geom.Point(coords) : null);
});

// JANGAN tracking otomatis (hemat baterai & CPU)
geolocation.setTracking(false);

function handleGeolocate() {
  if (isTracking) {
    geolocation.setTracking(false);
    map.removeLayer(geolocateOverlay);
    isTracking = false;
  } else {
    geolocation.setTracking(true);
    map.addLayer(geolocateOverlay);
    const pos = geolocation.getPosition();
    if (pos) map.getView().setCenter(pos);
    isTracking = true;
  }
}
geolocateButton.addEventListener('click', handleGeolocate);
geolocateButton.addEventListener('touchstart', handleGeolocate);

// ======================= measurement =======================
let measuring = false;

const measureButton = document.createElement('button');
measureButton.className = 'measure-button fas fa-ruler';
measureButton.title = 'Measure';

const measureControl = document.createElement('div');
measureControl.className = 'ol-unselectable ol-control measure-control';
measureControl.appendChild(measureButton);
map.getTargetElement().appendChild(measureControl);

function handleMeasure() {
  if (!measuring) {
    selectLabel.style.display = "";
    map.addInteraction(draw);
    createHelpTooltip();
    createMeasureTooltip();
    measuring = true;
  } else {
    selectLabel.style.display = "none";
    map.removeInteraction(draw);
    map.removeOverlay(helpTooltip);
    map.removeOverlay(measureTooltip);
    const staticTooltips = document.getElementsByClassName("tooltip-static");
    while (staticTooltips.length > 0) {
      staticTooltips[0].parentNode.removeChild(staticTooltips[0]);
    }
    measureLayer.getSource().clear();
    sketch = null;
    measuring = false;
  }
}
measureButton.addEventListener('click', handleMeasure);
measureButton.addEventListener('touchstart', handleMeasure);

map.on('pointermove', function(evt) {
  if (evt.dragging) return;
  if (measuring) {
    var helpMsg = 'Click to start drawing';
    if (sketch) {
      var geom = (sketch.getGeometry());
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = continueLineMsg;
      }
    }
    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);
  }
});

var selectLabel = document.createElement("label");
selectLabel.innerHTML = "&nbsp;Measure:&nbsp;";
var typeSelect = document.createElement("select");
typeSelect.id = "type";

[ { value: "LineString", description: "Length" },
  { value: "Polygon",   description: "Area" } ].forEach(function (opt) {
  var el = document.createElement("option");
  el.value = opt.value; el.text = opt.description;
  typeSelect.appendChild(el);
});

selectLabel.appendChild(typeSelect);
measureControl.appendChild(selectLabel);
selectLabel.style.display = "none";

var helpTooltipElement, helpTooltip, measureTooltipElement, measureTooltip;
var continueLineMsg = 'Click to continue drawing the line';
var continuePolygonMsg = "1click continue, 2click close";

var typeSelect = document.getElementById("type");
var typeSelectForm = document.getElementById("form_measure");

typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
  map.addInteraction(draw);
};

var measureLineStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({ color: "rgba(0, 0, 255)", lineDash: [10, 10], width: 4 }),
  image: new ol.style.Circle({ radius: 6, stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255)", width: 1 }) })
});
var measureLineStyle2 = new ol.style.Style({
  stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255)", lineDash: [10, 10], width: 2 }),
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({ color: "rgba(0, 0, 255)", width: 1 }),
    fill: new ol.style.Fill({ color: "rgba(255, 204, 51, 0.4)" })
  })
});
var labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: "14px Calibri,sans-serif",
    fill: new ol.style.Fill({ color: "rgba(0, 0, 0, 1)" }),
    stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 1)", width: 3 })
  })
});
var labelStyleCache = [];
var styleFunction = function (feature) {
  var styles = [measureLineStyle, measureLineStyle2];
  var geometry = feature.getGeometry();
  var type = geometry.getType();
  var lineString;
  if (type === "Polygon") {
    lineString = new ol.geom.LineString(geometry.getCoordinates()[0]);
  } else if (type === "LineString") {
    lineString = geometry;
  }
  if (lineString) {
    var count = 0;
    lineString.forEachSegment(function (a, b) {
      var segment = new ol.geom.LineString([a, b]);
      var label = formatLength(segment);
      if (labelStyleCache.length - 1 < count) labelStyleCache.push(labelStyle.clone());
      labelStyleCache[count].setGeometry(segment);
      labelStyleCache[count].getText().setText(label);
      styles.push(labelStyleCache[count]);
      count++;
    });
  }
  return styles;
};
var source = new ol.source.Vector();
var measureLayer = new ol.layer.Vector({
  source: source,
  displayInLayerSwitcher: false,
  style: function (feature) { labelStyleCache = []; return styleFunction(feature); }
});
map.addLayer(measureLayer);

var draw;
function addInteraction() {
  var type = typeSelect.value;
  draw = new ol.interaction.Draw({
    source: source,
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: function (feature) { return styleFunction(feature, type); }
  });
  var listener;
  draw.on('drawstart', function(evt) {
    sketch = evt.feature;
    var tooltipCoord = evt.coordinate;
    listener = sketch.getGeometry().on('change', function(evt) {
      var geom = evt.target;
      var output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  }, this);
  draw.on('drawend', function() {
    measureTooltipElement.className = 'tooltip tooltip-static';
    measureTooltip.setOffset([0, -7]);
    sketch = null;
    measureTooltipElement = null;
    createMeasureTooltip();
    ol.Observable.unByKey(listener);
  }, this);
}
function createHelpTooltip() {
  if (helpTooltipElement) helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip hidden';
  helpTooltip = new ol.Overlay({ element: helpTooltipElement, offset: [15, 0], positioning: 'center-left' });
  map.addOverlay(helpTooltip);
}
function createMeasureTooltip() {
  if (measureTooltipElement) measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({ element: measureTooltipElement, offset: [0, -15], positioning: 'bottom-center' });
  map.addOverlay(measureTooltip);
}
var formatLength = function(line) {
  var length = 0;
  var coordinates = line.getCoordinates();
  var sourceProj = map.getView().getProjection();
  for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
    length += ol.sphere.getDistance(c1, c2);
  }
  return (length > 100)
    ? (Math.round(length / 1000 * 100) / 100) + ' km'
    : (Math.round(length * 100) / 100) + ' m';
};
var formatArea = function (polygon) {
  var area = polygon.getArea();
  return (area > 1000000)
    ? Math.round((area / 1000000) * 1000) / 1000 + " km<sup>2</sup>"
    : Math.round(area * 100) / 100 + " m<sup>2</sup>";
};
addInteraction();

// pindahkan dropdown measure ke kontrol
var parentElement = document.querySelector(".measure-control");
var elementToMove = document.getElementById("form_measure");
if (elementToMove && parentElement) {
  parentElement.insertBefore(elementToMove, parentElement.firstChild);
}

// ========================= geocoder =========================
var geocoderLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
map.addLayer(geocoderLayer);
var vectorSource = geocoderLayer.getSource();

var obj2 = {
  value: '',
  letMeKnow() {},
  get gcd() { return this.value; },
  set gcd(value) { this.value = value; this.letMeKnow(); }
};
var obj = {
  value: '',
  get label() { return this.value; },
  set label(value) { this.value = value; }
};

function onSelected(feature) {
  obj.label = feature;
  input.value = typeof obj.label.properties.label === "undefined" ? obj.label.properties.display_name : obj.label.properties.label;
  var coordinates = ol.proj.transform(
    [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
    "EPSG:4326",
    map.getView().getProjection()
  );
  vectorSource.clear(true);
  obj2.gcd = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
  var marker = new ol.Feature(new ol.geom.Point(coordinates));
  var zIndex = 1;
  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      scale: 0.7,
      opacity: 1,
      src: "./resources/marker.png",
      zIndex: zIndex
    }),
    zIndex: zIndex
  }));
  vectorSource.addFeature(marker);
  map.getView().setCenter(coordinates);
  map.getView().setZoom(18);
}

var formatResult = function (feature, el) {
  var title = document.createElement("strong");
  el.appendChild(title);
  var detailsContainer = document.createElement("small");
  el.appendChild(detailsContainer);
  var details = [];
  title.innerHTML = feature.properties.label || feature.properties.display_name;
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) details.push(feature.properties.context);
  detailsContainer.innerHTML = details.join(", ");
};

class AddDomControl extends ol.control.Control {
  constructor(elementToAdd, opt_options) {
    const options = opt_options || {};
    const element = document.createElement("div");
    if (options.className) element.className = options.className;
    element.appendChild(elementToAdd);
    super({ element: element, target: options.target });
  }
}
function myHandler(featureCollection) {}

const url = {
  "Nominatim OSM": "https://nominatim.openstreetmap.org/search?format=geojson&addressdetails=1&",
  "France BAN": "https://api-adresse.data.gouv.fr/search/?"
};
var containers = new Photon.Search({
  resultsHandler: myHandler,
  onSelected: onSelected,
  placeholder: "Search an address",
  formatResult: formatResult,
  url: url["Nominatim OSM"],
  position: "topright"
});
var controlGeocoder = new AddDomControl(containers, {
  className: "photon-geocoder-autocomplete ol-unselectable ol-control",
});
map.addControl(controlGeocoder);
var search = document.getElementsByClassName("photon-geocoder-autocomplete ol-unselectable ol-control")[0];
search.style.display = "flex";

var button = document.createElement("button");
button.type = "button";
button.id = "gcd-button-control";
button.className = "gcd-gl-btn fa fa-search leaflet-control";
search.insertBefore(button, search.firstChild);
var last = search.lastChild;
last.style.display = "none";
button.addEventListener("click", function () {
  last.style.display = (last.style.display === "none") ? "block" : "none";
});
var input = document.getElementsByClassName("photon-input")[0];

// ======================= layer search ======================
var searchLayer = new SearchLayer({
  layer: lyr_OSMROADMAGETAN_3,
  colName: 'code',
  zoom: 10,
  collapsed: true,
  map: map,
  maxResults: 10,
});
map.addControl(searchLayer);
document.getElementsByClassName('search-layer')[0].getElementsByTagName('button')[0].className += ' fa fa-binoculars';
document.getElementsByClassName('search-layer-input-search')[0].placeholder = 'Search feature ...';

// ======================== layerswitcher =====================
var layerSwitcher = new ol.control.LayerSwitcher({
  tipLabel: "Layers",
  target: 'top-right-container'
});
map.addControl(layerSwitcher);

// ======================== attribution ======================
var bottomAttribution = new ol.control.Attribution({
  collapsible: false,
  collapsed: false,
  className: 'bottom-attribution'
});
map.addControl(bottomAttribution);
var attributionList = document.createElement('li');
attributionList.innerHTML = `
  <a href="https://github.com/qgis2web/qgis2web">qgis2web</a> &middot;
  <a href="https://openlayers.org/">OpenLayers</a> &middot;
  <a href="https://qgis.org/">QGIS</a>
`;
var bottomAttributionUl = bottomAttribution.element.querySelector('ul');
if (bottomAttributionUl) {
  bottomAttribution.element.insertBefore(attributionList, bottomAttributionUl);
}

// ===== Temporarily disable hover when mouse di atas control =====
var preDoHover = doHover;
var preDoHighlight = doHighlight;
var isPopupAllActive = false;
document.addEventListener('DOMContentLoaded', function() {
  if (doHover || doHighlight) {
    var controlElements = document.getElementsByClassName('ol-control');
    for (var i = 0; i < controlElements.length; i++) {
      controlElements[i].addEventListener('mouseover', function() {
        doHover = false;
        doHighlight = false;
      });
      controlElements[i].addEventListener('mouseout', function() {
        doHover = preDoHover;
        if (isPopupAllActive) { return; }
        doHighlight = preDoHighlight;
      });
    }
  }
});

// =================== move controls ke container ===================
var zoomControl = document.getElementsByClassName('ol-zoom')[0];
if (zoomControl) topLeftContainerDiv.appendChild(zoomControl);

if (typeof geolocateControl !== 'undefined') topLeftContainerDiv.appendChild(geolocateControl);
if (typeof measureControl   !== 'undefined') topLeftContainerDiv.appendChild(measureControl);

var searchbar = document.getElementsByClassName('photon-geocoder-autocomplete ol-unselectable ol-control')[0];
if (searchbar) topLeftContainerDiv.appendChild(searchbar);

var searchLayerControl = document.getElementsByClassName('search-layer')[0];
if (searchLayerControl) topLeftContainerDiv.appendChild(searchLayerControl);

var scaleLineControl = document.getElementsByClassName('ol-scale-line')[0];
if (scaleLineControl) {
  scaleLineControl.className += ' ol-control';
  bottomLeftContainerDiv.appendChild(scaleLineControl);
}
var attributionControl = document.getElementsByClassName('bottom-attribution')[0];
if (attributionControl) bottomRightContainerDiv.appendChild(attributionControl);

// =================== OPTIMISASI: layer OFF dulu ===================
// Semua layer vektor disembunyikan saat awal + dikasih opacity 0.7
function walk(layer, fn) {
  if (layer instanceof ol.layer.Group) {
    layer.getLayers().forEach(function (l) { walk(l, fn); });
  } else {
    fn(layer);
  }
}
walk(map.getLayerGroup(), function (layer) {
  if (layer instanceof ol.layer.Vector || layer instanceof ol.layer.VectorImage) {
    layer.setVisible(false);  // OFF dulu, user nyalakan via LayerSwitcher
    layer.setOpacity(0.7);    // lebih enteng & enak dilihat
  }
});
