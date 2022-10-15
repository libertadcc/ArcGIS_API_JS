require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/geometry/geometryEngine",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
], function (
  Map,
  MapView,
  FeatureLayer,
  geometryEngine,
  Graphic,
  GraphicsLayer
) {
  // Suelo
  var teselas = new FeatureLayer({
    url: "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/TeselaEspana_WFL1/FeatureServer/0",
    definitionExpression: "Corine221 >= 0.2",
    renderer: {
      type: "simple",
      // Icono árbol
      // https://esriespana.s3.amazonaws.com/fede/Imagenes/Demo_Apps/icono_arbol.png
      symbol: {
        type: "simple-fill",
        color: [94, 33, 41],
        outline: {
          width: 1,
          color: "white",
        },
      },
    },
  });

  // --- SIGPAC Rueda ---
  let renderer = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    field: "USO_SIGPAC",
    defaultSymbol: { type: "simple-fill" }, // autocasts as new SimpleFillSymbol()
    uniqueValueInfos: [
      {
        value: "AG",
        symbol: {
          type: "simple-fill",
          color: "#d17535",
        },
      },
      {
        value: "CA",
        symbol: {
          type: "simple-fill",
          color: "#0203a4",
        },
      },
      {
        value: "ED",
        symbol: {
          type: "simple-fill",
          color: "#74a0b0",
        },
      },
      {
        value: "FO",
        symbol: {
          type: "simple-fill",
          color: "#72bd2f",
        },
      },
      {
        value: "FY",
        symbol: {
          type: "simple-fill",
          color: "#be62d9",
        },
      },
      {
        value: "IM",
        symbol: {
          type: "simple-fill",
          color: "#6e0e15",
        },
      },
      {
        value: "OV",
        symbol: {
          type: "simple-fill",
          color: "#4cdaaf",
        },
      },
      {
        value: "PA",
        symbol: {
          type: "simple-fill",
          color: "#9a2270",
        },
      },
      {
        value: "PR",
        symbol: {
          type: "simple-fill",
          color: "#f9c7a5",
        },
      },
      {
        value: "PS",
        symbol: {
          type: "simple-fill",
          color: "#6a50cc",
        },
      },
      {
        value: "TA",
        symbol: {
          type: "simple-fill",
          color: "#0da4fa",
        },
      },
      {
        value: "VI",
        symbol: {
          type: "simple-fill",
          color: "#18864f",
        },
      },
      {
        value: "ZU",
        symbol: {
          type: "simple-fill",
          color: "#1479bf",
        },
      },
      {
        value: "FS",
        symbol: {
          type: "simple-fill",
          color: "#9de396",
        },
      },
    ],
  };

  const landUse = document.getElementById("land-use").text;
  let arcadeRenderer = {
    type: "unique-value",
    valueExpression: landUse,
    uniqueValueInfos: [
      {
        value: "Zonas Edificadas",
        symbol: {
          type: "simple-fill",
          color: "#BD7EBE",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "No productoras",
        symbol: {
          type: "simple-fill",
          color: "#FD7F6F",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "Pasto",
        symbol: {
          type: "simple-fill",
          color: "#7EB0D5",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "Viñedo",
        symbol: {
          type: "simple-fill",
          color: "#B2E061",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "Bosque",
        symbol: {
          type: "simple-fill",
          color: "#FFB55A",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "Agua",
        symbol: {
          type: "simple-fill",
          color: "#FFEE65",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
      {
        value: "Otros cultivos arbóreos",
        symbol: {
          type: "simple-fill",
          color: "#BEB9DB",
          outline: {
            width: 0.2,
            color: [0, 0, 0, 0.1],
          },
        },
      },
    ],
  };

  var rueda = new FeatureLayer({
    url: "https://services1.arcgis.com/YFraetVkEAF1lMag/ArcGIS/rest/services/Recintos_SIGPAC_Rueda/FeatureServer/0",
    renderer: arcadeRenderer,
  });

  const map = new Map({
    basemap: "dark-gray-vector",
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-4.959, 41.41],
    zoom: 10,
    popup: {
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false,
        position: "bottom-left",
      },
      visibleElements: {
        closeButton: false,
      },
    },
    container: "viewDiv",
  });

  const municipios = new FeatureLayer({
    url: "https://services1.arcgis.com/YFraetVkEAF1lMag/arcgis/rest/services/Burgos/FeatureServer/14",
  });
  let bufferLayer = new GraphicsLayer();
  map.addMany([rueda, bufferLayer]);

  // Reset buffer
  let monthSelect = document.getElementById("month");
  monthSelect.addEventListener("calciteSelectChange", () => {
    bufferLayer.removeAll();
    view.popup.visible = false;
  });
  let yearSelect = document.getElementById("year");
  yearSelect.addEventListener("calciteSelectChange", () => {
    bufferLayer.removeAll();
    view.popup.visible = false;
  });

  // ------- Cálculo de estadística ----
  let sumPrecipitation = {
    onStatisticField: "precip",
    outStatisticFieldName: "prec_sum",
    statisticType: "sum",
  };

  let avgTempMax = {
    onStatisticField: "tmax",
    outStatisticFieldName: "tmax_avg",
    statisticType: "avg",
  };

  let avgTempMin = {
    onStatisticField: "tmin",
    outStatisticFieldName: "tmin_avg",
    statisticType: "avg",
  };
  let avgTempMed = {
    onStatisticField: "tmed",
    outStatisticFieldName: "tmed_avg",
    statisticType: "avg",
  };

  var aemetData = new FeatureLayer({
    url: "https://services1.arcgis.com/YFraetVkEAF1lMag/arcgis/rest/services/Estaciones_AEMET/FeatureServer/3",
  });

  view.on("click", (evt) => {
    view.popup.open({
      location: "bottom-left",
    });

    let date = getDate();

    const options = {
      include: municipios,
    };

    const borderSymb = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "transparent",
      style: "solid",
      outline: {
        width: 1.5,
        color: [161, 222, 214],
      },
    };

    const polySym = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [140, 140, 222, 0.5],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2,
      },
    };
    view
      .hitTest(
        evt
        // , options
      )
      .then((response) => {
        bufferLayer.removeAll();
        view.popup.visible = false;
        if (response.results[0].graphic.geometry != null) {
          const geom = response.results[0].graphic.geometry;
          // buffer polígono para buscar estaciones
          const buffer = geometryEngine.buffer(geom, 100, "kilometers");
          // Representar el borde del polígono
          bufferLayer.add(
            new Graphic({
              geometry: geom,
              symbol: borderSymb,
            })
          );
          // Representar el buffer
          // bufferLayer.add(
          //   new Graphic({
          //     geometry: buffer,
          //     symbol: polySym,
          //   })
          // );

          let query = aemetData.createQuery();
          query.where = `case_ = '${date}'`;
          query.geometry = buffer;
          query.outStatistics = [
            avgTempMax,
            avgTempMin,
            avgTempMed,
            sumPrecipitation,
          ];
          aemetData.queryFeatures(query).then((response) => {
            let stats = response.features[0].attributes;
            console.log("stats", stats);
            if (stats.tmax_avg !== null) {
              var tmax_avg = stats.tmax_avg.toFixed(2);
              var tmin_avg = stats.tmin_avg.toFixed(2);
              var tmed_avg = stats.tmed_avg.toFixed(2);
              view.popup.visible = true;
              view.popup.title = `Datos climáticos ${date}`;
              view.popup.content = `
                <b>Temperatura media: </b>${tmed_avg} ºC
                <br/>
                <b>Temperatura máxima media: </b>${tmax_avg} ºC
                <br/>
                <b>Temperatura mínima media: </b>${tmin_avg} ºC
                <br/>
                <b>Precipitación total: </b>${stats.prec_sum} mm
                <br/>`;
            } else {
              view.popup.visible = true;
              view.popup.content =
                "No hay ninguna estación metereológica a menos 100 de km.";
            }
          });
        }
      });
  });

  function getDate() {
    var month = document.getElementById("month");
    var year = document.getElementById("year");
    return (date = `${month.value}/${year.value}`);
  }
});
