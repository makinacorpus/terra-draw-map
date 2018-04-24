import 'antd/dist/antd.css';
import { Card } from 'antd';
import React, { Component } from 'react';
import TerraDrawMap from './TerraDrawMap';
import './App.css';

// const urlToFetchDataPolygon = './assets/hors_chemins_p1.geojson';
// const urlToFetchDataLine = './assets/chemins_p1.geojson';

const paintedColors = {
  GRIDCODE: [
    { value: 0, color: '#fad390' },
    { value: 1, color: '#1e3799' },
    { value: 2, color: '#e55039' },
    { value: 3, color: '#eb2f06' },
    { value: 4, color: '#b71540' },
    { value: null, color: '#079992' },
  ],
};

const polygon =
{ id: 'polygon',
  display: true,
  type: 'fill',
  data: {
    type: 'FeatureCollection',
    features: [{ type: 'Feature',
      properties: { GRIDCODE: 1 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [2.3106835819, 48.8440023367],
          [2.3106789052, 48.8726069667],
          [2.3873505196, 48.8726123912],
          [2.3873551963, 48.8440077643],
          [2.3106835819, 48.8440023367],
        ]] } }],
  },
  paint: feature => {
    const color = paintedColors[[Object.keys(paintedColors)][0]].find(dataColor =>
      dataColor.value ===
                feature.properties[[Object.keys(paintedColors)][0]] ||
              dataColor.value === null);
    return { color: color.color };
  } };


const line = { id: 'line',
  display: true,
  type: 'line',
  data: {
    type: 'FeatureCollection',
    features: [{ type: 'Feature',
      properties: { GRIDCODE: 2 },
      geometry: {
        type: 'LineString',
        coordinates: [[2.2106835819, 48.8440023367], [2.2106789052, 48.8726069667]],
      } }],
  },
  paint: feature => {
    const color = paintedColors[[Object.keys(paintedColors)][0]].find(dataColor =>
      dataColor.value ===
      feature.properties[[Object.keys(paintedColors)][0]] ||
    dataColor.value === null);
    return { color: color.color };
  } };
class App extends Component {
  constructor () {
    super();
    this.state = {
      config: { layers: [polygon, line] },
      dataOnClickDisplay: null,
      dataOnDrawDisplay: {},
    };
  }
  componentDidMount () {
    // FETCH EXAMPLE

    // const config = { ...this.state.config };
    // const paintedColors = {
    //   GRIDCODE: [
    //     { value: 0, color: '#fad390' },
    //     { value: 1, color: '#f8c291' },
    //     { value: 2, color: '#e55039' },
    //     { value: 3, color: '#eb2f06' },
    //     { value: 4, color: '#b71540' },
    //     { value: null, color: '#079992' },
    //   ],
    // };
    // fetch(urlToFetchDataPolygon)
    //   .then(response => response.json())
    //   .then(dataPolygon => {
    //     config.layers.push({
    //       id: 'polygon',
    //       display: true,
    //       type: 'fill',
    //       data: dataPolygon,
    //       paint: feature => {
    //         const color = paintedColors[[Object.keys(paintedColors)][0]].find(dataColor =>
    //           dataColor.value ===
    //               feature.properties[[Object.keys(paintedColors)][0]] ||
    //             dataColor.value === null);
    //         return { color: color.color };
    //       },
    //     });
    //     fetch(urlToFetchDataLine)
    //       .then(response => response.json())
    //       .then(dataLine => {
    //         config.layers.push({
    //           id: 'line',
    //           display: true,
    //           type: 'line',
    //           data: dataLine,
    //           paint: feature => {
    //             const color = paintedColors[[Object.keys(paintedColors)][0]].find(dataColor =>
    //               dataColor.value ===
    //                   feature.properties[[Object.keys(paintedColors)][0]] ||
    //                 dataColor.value === null);
    //             return { color: color.color };
    //           },
    //         });
    //         this.setState({ config });
    //       })
    //       .catch(error => {
    //         console.error(error); // eslint-disable-line no-console
    //       });
    //   })
    //   .catch(error => {
    //     console.error(error); // eslint-disable-line no-console
    //   });
  }

  getDataOnClick (data) {
    this.setState({ dataOnClickDisplay: data });
  }

  getDataDraw (data) {
    this.setState({ dataOnDrawDisplay: data });
  }

  render () {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <TerraDrawMap
          config={this.state.config}
          maxBounds={[[48.815575, 2.224122], [48.902157, 2.46976]]}
          center={[48.856840, 2.351239]}
          zoom={11}
          getDataOnClick={data => this.getDataOnClick(data)}
          getDataOnDraw={data => this.getDataDraw(data)}
        />
        {this.state.dataOnClickDisplay && (
          <Card
            title="Features on Click"
            style={{
              width: 300,
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 1000,
            }}
          >
            <p id="click" key={this.state.dataOnClickDisplay.feature.properties.GRIDCODE}>
              {
                this.state.dataOnClickDisplay._leaflet_id // eslint-disable-line
              } &nbsp;:&nbsp;
              {this.state.dataOnClickDisplay.feature.properties.GRIDCODE}
            </p>
          </Card>
        )}

        {Object.keys(this.state.dataOnDrawDisplay).length > 0 && (
          <Card
            title="Features on draw"
            style={{
              width: 300,
              position: 'absolute',
              top: 340,
              left: 20,
              zIndex: 1000,
            }}
          >
            {Object.keys(this.state.dataOnDrawDisplay).map((key, index) => (
              <p id={`draw${index}`} key={key}>
                {key} :
                {[
                  ...new Set(this.state.dataOnDrawDisplay[key].map(o => o.properties.GRIDCODE)),
                ].toString()}
              </p>
            ))}
          </Card>
        )}
      </div>
    );
  }
}

export default App;
