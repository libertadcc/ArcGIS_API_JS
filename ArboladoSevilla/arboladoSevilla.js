require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/rest/support/Query",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/geometryEngine"
], (
  Map,
  MapView,
  FeatureLayer,
  Query, 
  GraphicsLayer, 
  Graphic, 
  geometryEngine
) => {
  const map = new Map({
    basemap: "gray-vector",
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-5.984, 37.393],
    zoom: 16,
  });

  const treesRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "images/icono_arbol.png"
    },
    visualVariables: [
      {
        type: "size",
        field: "Altura",
        stops: [
          { value: 0.5, size: 4 },
          { value: 1.5, size: 6 },
          { value: 3, size: 8 },
          { value: 6, size: 10 },
        ],
      }
    ],
  };

  const treesLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/hcmP7kr0Cx3AcTJk/arcgis/rest/services/Parques_y_Jardines_Arbol_Viario/FeatureServer/0",
    renderer: treesRenderer
  });
  const bufferLayer = new GraphicsLayer();

  map.addMany([bufferLayer, treesLayer]);

  const groupTrees = document.querySelector("calcite-tile-select-group");
  groupTrees.addEventListener("calciteTileSelectChange", (e) => {
    view.whenLayerView(treesLayer).then((treeTypeLayerView) => {
      treeTypeLayerView.featureEffect = {
        filter: {
          where: `Nombre = '${e.target.value}'`,
        },
        excludedEffect: "opacity(0.3) blur(5px)",
      };
    });
  });

  const clearSelectionBtn = document.getElementById("clear-selection-btn");
  clearSelectionBtn.addEventListener("click", () => {
    view.whenLayerView(treesLayer).then((treeTypeLayerView) => {
      treeTypeLayerView.featureEffect = {
        filter: {
          where: "1 = 1",
        },
        excludedEffect: "opacity(0.3) blur(5px)",
      };
    });

    document.querySelectorAll("calcite-tile-select").forEach((tileSelect) => {
      tileSelect.toggleAttribute("checked", false);
    });
  });

  // ---- ESTADÍSTICAS ----

  const polySym = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [255, 188, 226, 0.7],
    outline: {
      color: [142, 68, 173, 0.7],
      width: 2
    }
  };

  let msg = document.getElementById('msg-stats');
  const check = document.getElementById('stats');


  check.addEventListener('calciteSwitchChange', (evt) => {
    if (evt.detail.switched === false) {
      msg.innerHTML = '';
      bufferLayer.removeAll();
    }
  });
  
  view.on('click', evt => {
    
    bufferLayer.removeAll();

    if(check.checked) {
      let buffer = geometryEngine.buffer(evt.mapPoint, 200, "meters");
  
      bufferLayer.add(
        new Graphic({
          geometry: buffer,
          symbol: polySym
        })
      );
      
      view.whenLayerView(treesLayer).then(() => {
        const query = new Query();
        query.outFields = ['*'];
        query.groupByFieldsForStatistics= ['Nombre'];
        query.orderByFields= ['SpeciesCount desc'];
        query.outStatistics =  [{
          "statisticType": "count", 
          "onStatisticField": "Nombre", 
          "outStatisticFieldName": "SpeciesCount"
        }];
        query.geometry = buffer;
        
        treesLayer.queryFeatures(query).then(response => {
          console.log('query', response)
          msg.innerHTML = `En este área de <b>200 metros de radio</b> hay <b>${response.features[0].attributes.SpeciesCount} árboles</b> y la especie más abundante es <b><i>${response.features[0].attributes.Nombre}</i></b>.`
          msg.style = "font-size: 15px;"
        });
      });
    } 
  });
});
