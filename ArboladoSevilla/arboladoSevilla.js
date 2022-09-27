require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Histogram",
  "esri/smartMapping/statistics/histogram",
  "esri/smartMapping/statistics/uniqueValues",
  "esri/rest/support/Query",
  "esri/Color",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/geometryEngine"
], (
  Map,
  MapView,
  FeatureLayer,
  Legend,
  Histogram,
  histogram,
  uniqueValues,
  Query, Color,
  GraphicsLayer, Graphic, geometryEngine
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
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      // size: 6,
      color: "green",
      // color: new Color("rgba(121, 255, 157, 0.85)"),
      outline: {
        color: "white",
        width: 0.5,
      },
    },
    visualVariables: [
      {
        type: "size",
        valueExpression: `Round(Number($feature.Perimetro)/100,2)`,
        stops: [
          { value: 0.1, size: 4 },
          { value: 0.5, size: 6 },
          { value: 3, size: 12 },
        ],
      },
    ],
  };

  const treesLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/hcmP7kr0Cx3AcTJk/arcgis/rest/services/Parques_y_Jardines_Arbol_Viario/FeatureServer/0",
    renderer: treesRenderer,
    definitionExpression: "Perimetro <> 'NULL'",
    // popupTemplate: {
    //   title: "{Nombre}",
    //   content: "Ejemplar de {Altura} metros de altura",
    // },
  });
  const bufferLayer = new GraphicsLayer();

  map.addMany([bufferLayer, treesLayer]);

  // Listado de especies
  //   var species = [];
  //   uniqueValues({
  //     layer: treesLayer,
  //     field: "Nombre",
  //   }).then(function (response) {
  //     // prints each unique value and the count of features containing that value
  //     let infos = response.uniqueValueInfos;
  //     console.log("unique", response);
  //     infos.forEach(function (info) {
  //       species.push({ name: info.value, value: info.count });
  //       // console.log("CANDIDATE: ", info.value, " # OF CAMPAIGN STOPS: ", info.count);
  //     });
  //     // console.log('species', species)
  //   });

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

  // const polySym = {
  //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
  //   color: [140, 140, 222, 0.5],
  //   outline: {
  //     color: [0, 0, 0, 0.5],
  //     width: 2
  //   }
  // };
  // const pointSym = {
  //   type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
  //   color: [255, 0, 0],
  //   outline: {
  //     color: [255, 255, 255],
  //     width: 1
  //   },
  //   size: 7
  // };
  // view.on('click', evt => {
  //   bufferLayer.removeAll();
  //   const buffer = geometryEngine.buffer(
  //     evt.mapPoint,
  //     500,
  //     "meters"
  //     // 1,
  //     // "kilometers"
  //   );

  //   bufferLayer.add(
  //     new Graphic({
  //       geometry: buffer,
  //       symbol: polySym
  //     })
  //   );
  // });

  // Histograma
  // const params = {
  //     layer: treesLayer,
  //     valueExpression: `Round(Number($feature.Perimetro)/100,2)`,
  //     view: view,
  //     bins: 10
  //     };

  //     histogram(params)
  //     .then(function(histogramResult) {
  //         console.log('histogram',histogramResult)
  //         const histogram = Histogram.fromHistogramResult(histogramResult);
  //         histogram.container = "histogram";
  //     })
  //     .catch(function(error) {
  //         console.log("there was an error: ", error);
  //     });
});
