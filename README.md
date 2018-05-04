# Terra Draw Map

Component created with React, OpenLayer.

## Src folder

Contain the src component

## Configuration Example

````
const config = {
  vectorLayers: [
    {
      name: "chemins",
      url: "http://localhost:8080/data/chemins_li_p1/{z}/{x}/{y}.pbf",
      minZoom: 12,
      style: {
        property: "GRIDCODE",
        draw: value => {
          switch (value) {
            case 0:
              return {
                color: "#aaa69d",
                width: 1.25
              };
            case 1:
              return {
                color: "#84817a",
                width: 1.25
              };
            case 2:
              return {
                color: "#ffb142",
                width: 1.25
              };
            case 3:
              return {
                color: "#cc8e35",
                width: 1.25
              };
            case 4:
              return {
                color: "#ff5252",
                width: 1.25
              };
            default:
              return null;
          }
        }
      },
      type: "line"
    }
  ]
};
```