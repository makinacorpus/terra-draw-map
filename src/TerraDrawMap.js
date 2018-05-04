import React, { Component } from "react";
import PropTypes from "prop-types";
import ol from "openlayers";
import "openlayers/dist/ol.css";

class TerraDrawMap extends Component {
  componentDidMount() {
    const sourceLayer = new ol.layer.Tile({
      source: new ol.source.OSM(this.props.osmSource)
    });
    this.sourceDraw = new ol.source.Vector({ wrapX: false });
    const vectorDraw = new ol.layer.Vector({
      source: this.sourceDraw
    });
    let vectorLayers = [];
    this.props.config.vectorLayers.forEach(layer => {
      const vectorLayer = new ol.layer.VectorTile({
        name: layer.name,
        maxResolution: 156543.03392804097 / Math.pow(2, layer.minZoom - 1),
        source: new ol.source.VectorTile({
          format: new ol.format.MVT(),
          url: layer.url,
          renderMode: "hybrid"
        }),
        style: (feature, resolution) => {
          if (layer.type === "line") {
            return new ol.style.Style({
              stroke: new ol.style.Stroke(
                layer.style.draw(feature.get(layer.style.property))
              )
            });
          }
        }
      });

      vectorLayers.push(vectorLayer);
    });

    const view = new ol.View({
      center: ol.proj.fromLonLat(this.props.center),
      zoom: this.props.zoom,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      extent: [
        ol.proj.fromLonLat(this.props.maxBounds[0]),
        ol.proj.fromLonLat(this.props.maxBounds[1])
      ]
        .toString()
        .split(",")
    });

    this.map = new ol.Map({
      controls: ol.control
        .defaults({
          attributionOptions: {
            collapsible: false
          }
        })
        .extend([]),
      target: this.mapContainer,
      layers: [sourceLayer, vectorDraw, ...vectorLayers],
      view
    });

    if (this.props.getDataOnHover) {
      this.map.on("pointermove", e => this.onHover(e));
    }

    if (this.props.getDataOnClick) {
      this.map.on("click", e => this.onClick(e));
    }

    this.sourceDraw.on("addfeature", event => {
      if (this.props.getGeometryOnDrawEnd) {
        this.props.getGeometryOnDrawEnd(
          event.feature.getGeometry().getCoordinates()
        );
      }
    });
  }

  startDrawPolygon() {
    this.stopDraw();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: "Polygon"
    });

    this.map.addInteraction(this.draw);
  }

  startDrawLine() {
    this.stopDraw();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: "LineString"
    });

    this.map.addInteraction(this.draw);
  }

  stopDraw() {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }
  }

  onHover(event) {
    const features = this.map.getFeaturesAtPixel(event.pixel, {
      layerFilter: e =>
        this.props.config.vectorLayers
          .map(a => a.name)
          .indexOf(e.get("name")) !== -1
    });

    if (features) {
      this.props.getDataOnHover(features[0].getProperties());
    }
  }

  onClick(event) {
    const features = this.map.getFeaturesAtPixel(event.pixel, {
      layerFilter: e =>
        this.props.config.vectorLayers
          .map(a => a.name)
          .indexOf(e.get("name")) !== -1
    });

    if (features) {
      this.props.getDataOnClick(features[0].getProperties());
    }
  }

  render() {
    return (
      <div
        style={{ height: "100%", width: "100%" }}
        ref={el => {
          this.mapContainer = el;
        }}
      />
    );
  }
}

TerraDrawMap.propTypes = {
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  getGeometryOnDrawEnd: PropTypes.func,
  getDataOnClick: PropTypes.func,
  getDataOnHover: PropTypes.func
};

TerraDrawMap.defaultProps = {
  config: {
    vectorLayers: []
  },
  minZoom: 11,
  maxZoom: 20,
  zoom: 11,
  center: [2.62322, 48.40813],
  maxBounds: [[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]],
  osmSource: ""
};

export default TerraDrawMap;
