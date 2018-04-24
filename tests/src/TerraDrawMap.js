/* eslint no-underscore-dangle:off */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import flatten from '@turf/flatten';
import { polygon, lineString } from '@turf/helpers';
import booleanIntersects from '@turf/boolean-intersects';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

export default class TerraDrawMap extends Component {
  constructor () {
    super();
    this.state = {
      drawObjects: [],
    };
  }

  componentDidMount () {
    const editableLayers = new L.FeatureGroup();

    this.map = L.map(this.mapContainer, {
      center: this.props.center,
      zoom: this.props.zoom,
      maxBounds: this.props.maxBounds,
      renderer: L.canvas(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.addLayer(editableLayers);

    const options = {
      position: 'topright',
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: "<strong>Oh snap!<strong> you can't draw that!",
          },
          shapeOptions: {
            color: 'red',
          },
        },
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false,
      },
      edit: {
        featureGroup: editableLayers,
        remove: true,
      },
    };

    const drawControl = new L.Control.Draw(options);

    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, createData => this.onDrawCreate(createData, editableLayers));

    this.map.on(L.Draw.Event.EDITED, updatedData => this.onDrawUpdate(updatedData));

    this.map.on(L.Draw.Event.DELETED, deletedData => this.onDrawDelete(deletedData));

    if (this.props.config &&
      Object.prototype.hasOwnProperty.call(this.props.config, 'layers') &&
      this.props.config.layers.length
    ) {
      this.setState({ config: this.addData(this.props.config, this.props.getDataOnClick) }); // eslint-disable-line
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (
      !nextState.config &&
        Object.prototype.hasOwnProperty.call(nextProps.config, 'layers') &&
        nextProps.config.layers.length &&
        nextProps.config !== nextState.config &&
        this.map
    ) {
      this.setState({ config: this.addData(nextProps.config, nextProps.getDataOnClick) });
      return true;
    }
    return false;
  }

  onDrawUpdate (updatedObjects) {
    let currentForm;
    const drawObjects = { ...this.state.drawObjects };

    [Object.keys(updatedObjects.layers._layers)][0].forEach(updatedLayer => {
      const intersectsObject = [];

      const drawbbox = polygon(updatedObjects.layers._layers[updatedLayer]
        .toGeoJSON().geometry.coordinates);

      this.state.config.layers.forEach(layer => {
        if (layer.display) {
          layer.data.features.forEach(feature => {
            try {
              currentForm =
                feature.geometry.type === 'LineString'
                  ? lineString(feature.geometry.coordinates)
                  : polygon(feature.geometry.coordinates);
              if (booleanIntersects(currentForm, drawbbox)) {
                intersectsObject.push(feature);
              }
            } catch (e) {
              console.error('error', e, feature); // eslint-disable-line no-console
            }
          });
        }
      });

      drawObjects[updatedLayer] = intersectsObject;
    });

    this.setState({ drawObjects });
    this.props.getDataOnDraw(drawObjects);
  }

  onDrawCreate (drawObject, editableLayers) {
    this.map.addLayer(drawObject.layer);
    const intersectsObject = [];
    let currentForm;
    const drawbbox = polygon(drawObject.layer.toGeoJSON().geometry.coordinates);

    this.state.config.layers.forEach(layer => {
      if (layer.display) {
        layer.data.features.forEach(feature => {
          try {
            currentForm =
              feature.geometry.type === 'LineString'
                ? lineString(feature.geometry.coordinates)
                : polygon(feature.geometry.coordinates);
            if (booleanIntersects(currentForm, drawbbox)) {
              intersectsObject.push(feature);
            }
          } catch (e) {
            console.error('error', e, feature); // eslint-disable-line no-console
          }
        });
      }
    });

    const drawObjects = { ...this.state.drawObjects };
    drawObjects[drawObject.layer._leaflet_id] = intersectsObject;

    editableLayers.addLayer(drawObject.layer);

    this.setState({ drawObjects });
    this.props.getDataOnDraw(drawObjects);
  }

  onDrawDelete (deletedObjects) {
    const drawObjects = { ...this.state.drawObjects };

    [Object.keys(deletedObjects.layers._layers)][0].forEach(layer => {
      delete drawObjects[Number(layer)];
    });

    this.setState({ drawObjects });
    this.props.getDataOnDraw(drawObjects);
  }

  addData (data, getDataOnClick) {
    const flattenConfig = { ...data.config };
    flattenConfig.layers = data.layers
      .map(layer => ({ ...layer, data: flatten(layer.data) }));
    const newLayers = [];
    // Remove source and layer before add if exist
    flattenConfig.layers.forEach(layer => {
      if (layer.display && layer.paint) {
        const newLayer = L.geoJSON(layer.data, {
          style: feature => layer.paint(feature),
        }).addTo(this.map);
        newLayers.push(newLayer);
      }
    });
    if (getDataOnClick) {
      newLayers.forEach(currentLayer => {
        currentLayer.on('click', layerData => {
          getDataOnClick(layerData.layer);
        });
      });
    }
    return flattenConfig;
  }

  render () {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
        ref={el => { this.mapContainer = el; }}
      />
    );
  }
}

TerraDrawMap.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  getDataOnDraw: PropTypes.func,
  getDataOnClick: PropTypes.func,
  config: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.any,
    display: PropTypes.bool,
    type: PropTypes.string,
    paint: PropTypes.shape({}),
    data: PropTypes.shape({}),
  }).isRequired,
};

TerraDrawMap.defaultProps = {
  zoom: 11,
  center: [48.40813, 2.62322],
  maxBounds: [
    [48.1867854393, 2.2917527636],
    [48.6260818006, 3.1004132613],
  ],
  getDataOnDraw: () => {},
  getDataOnClick: () => {},
};
