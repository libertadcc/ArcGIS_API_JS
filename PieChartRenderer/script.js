require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
], (Map, MapView, FeatureLayer, Legend, Expand) => {
  const map = new Map({
    basemap: "gray-vector",
  });
  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-3, 40],
    zoom: 5,
    constraints: {
      minScale: 9500000,
      maxScale: 900000,
      snapToZoom: false,
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-right",
        buttonEnabled: false,
        breakpoint: false,
      },
    },
  });
  const educationalLayer = new FeatureLayer({
    portalItem: {
      id: "5327b3ba8dfa4c6098917dd9682edff2",
    },
    renderer: {
      type: "pie-chart", // autocasts as new PieChartRenderer
      size: 10,
      attributes: [
        {
          field: "SUM_L0Estudios_T12_2",
          color: "#ef233c",
          label: "Personas sin estudios",
        },
        {
          field: "SUM_L0Estudios_T12_3",
          color: "#fee440",
          label: "Personas con estudios de primer grado",
        },
        {
          field: "SUM_L0Estudios_T12_4",
          color: "#00bbf9",
          label: "Personas con estudios de segundo grado",
        },
        {
          field: "SUM_L0Estudios_T12_5",
          color: "#80ed99",
          label: "Personas con estudios de tercer grado",
        },
      ],
      backgroundFillSymbol: {
        // polygon fill behind pie chart
        color: [127, 127, 127, 0.2],
        outline: {
          width: 1,
          color: [255, 255, 255, 0.3],
        },
      },
      outline: {
        width: 0.75,
        color: "grey",
      },
      visualVariables: [
        {
          type: "size",
          valueExpression: "$feature.SUM_L0Estudios_T1_1",
          minDataValue: 80000, // Pob min 80k
          maxDataValue: 5000000, // Pob máx 6M
          minSize: 12,
          maxSize: 48,
        },
      ],
    },
    popupTemplate: {
      title: "{Nombre}",
      content: [
        {
          type: "media",
          mediaInfos: [
            {
              title: "Nivel de estudios en {Nombre}",
              type: "pie-chart",
              value: {
                fields: [
                  "SUM_L0Estudios_T12_2",
                  "SUM_L0Estudios_T12_3",
                  "SUM_L0Estudios_T12_4",
                  "SUM_L0Estudios_T12_5",
                ],
              },
            },
            {
              type: "line-chart",
              title: "Estudios de hombres",
              value: {
                fields: [
                  "SUM_L0Estudios_T13_3",
                  "SUM_L0Estudios_T13_5",
                  "SUM_L0Estudios_T13_7",
                  "SUM_L0Estudios_T13_9",
                ],
              },
            },
            {
              type: "line-chart",
              title: "Estudios de mujeres",
              value: {
                fields: [
                  "SUM_L0Estudios_T13_4",
                  "SUM_L0Estudios_T13_6",
                  "SUM_L0Estudios_T13_8",
                  "SUM_L0Estudios_T13_10",
                ],
              },
            },{
                type: "column-chart",
                title: "Estudios por sexo",
                value: {
                    fields: [
                        "SUM_L0Estudios_T13_3",
                        "SUM_L0Estudios_T13_4",
                        "SUM_L0Estudios_T13_5",
                        "SUM_L0Estudios_T13_6",
                        "SUM_L0Estudios_T13_7",
                        "SUM_L0Estudios_T13_8",
                        "SUM_L0Estudios_T13_9",
                        "SUM_L0Estudios_T13_10",
                    ]
                }
            },
          ],
        },
        // Tabla
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "SUM_L0Estudios_T13_3",
              label: "Hombres sin estudios",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_4",
              label: "Mujeres sin estudios",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_5",
              label: "Hombres con estudios de primer grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_6",
              label: "Mujeres con estudios de primer grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_7",
              label: "Hombres con estudios de segundo grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_8",
              label: "Mujeres con estudios de segundo grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_9",
              label: "Hombres con estudios de tercer grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T13_10",
              label: "Mujeres con estudios de tercer grado",
              format: {
                digitSeparator: true,
              },
            },
            {
              fieldName: "SUM_L0Estudios_T1_1",
              label: "Población total",
              format: {
                digitSeparator: true,
              },
            }
          ]
        }
      ],
      // Campos popups 
      fieldInfos: [
        {
          fieldName: "SUM_L0Estudios_T12_2",
          label: "Personas sin estudios",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T12_3",
          label: "Personas con estudios de primer grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T12_4",
          label: "Personas con estudios de segundo grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T12_5",
          label: "Personas con estudios de tercer grado",
          format: {
            digitSeparator: true,
          }
        },
        { fieldName: "SUM_L0Estudios_T13_3", 
            label: "Hombres sin estudios",
            format: {
                digitSeparator: true,
            }
        },
        {
          fieldName: "SUM_L0Estudios_T13_4",
          label: "Mujeres sin estudios",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_5",
          label: "Hombres con estudios de primer grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_6",
          label: "Mujeres con estudios de primer grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_7",
          label: "Hombres con estudios de segundo grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_8",
          label: "Mujeres con estudios de segundo grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_9",
          label: "Hombres con estudios de tercer grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T13_10",
          label: "Mujeres con estudios de tercer grado",
          format: {
            digitSeparator: true,
          }
        },
        {
          fieldName: "SUM_L0Estudios_T1_1",
          label: "Población total",
          format: {
            digitSeparator: true,
          }
        },
      ],
    },
  });
  map.add(educationalLayer);

  const legend = new Legend({
    view: view,
    layerInfos: [{
        layer: educationalLayer,
        title: 'Nivel de estudios en España'
    }]
  });
  view.ui.add(legend, "bottom-left");

});
