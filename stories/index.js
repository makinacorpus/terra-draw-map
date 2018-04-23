import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line
import { action } from '@storybook/addon-actions'; // eslint-disable-line
import TerraDrawMap from '../src/TerraDrawMap';

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

storiesOf('Map', module)
  .add('Polygon', () => (
    <div style={{ height: '100vh', width: '100vw' }}>
      <TerraDrawMap
        config={{ layers: [polygon] }}
        maxBounds={[[48.815575, 2.224122], [48.902157, 2.46976]]}
        center={[48.856840, 2.351239]}
        zoom={11}
        getDataOnDraw={action('Data On Draw')}
        getDataOnClick={action('Data On Click')}
      />
    </div>
  )).add('Line', () => (
    <div style={{ height: '100vh', width: '100vw' }}>
      <TerraDrawMap
        config={{ layers: [line] }}
        maxBounds={[[48.815575, 2.224122], [48.902157, 2.46976]]}
        center={[48.856840, 2.351239]}
        zoom={11}
        getDataOnDraw={action('Data On Draw')}
        getDataOnClick={action('Data On Click')}
      />
    </div>
  )).add('Polygon and Line', () => (
    <div style={{ height: '100vh', width: '100vw' }}>
      <TerraDrawMap
        config={{ layers: [polygon, line] }}
        maxBounds={[[48.815575, 2.224122], [48.902157, 2.46976]]}
        center={[48.856840, 2.351239]}
        zoom={11}
        getDataOnDraw={action('Data On Draw')}
        getDataOnClick={action('Data On Click')}
      />
    </div>
  ));
