import React, { Component } from 'react';
import cartojs from '@carto/carto.js/dist/public/carto.js';
import { updateNumMoves, addBoundingBoxFilter } from "../store/actions";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { mapboxgl, cartovl } from "../backend"
import "./Map.css"

const mapStateToProps = state => {
  return { numMoves: state.numMoves, city: state.city };
};

const mapDispatchToProps = dispatch => {
  return {
    updateNumMoves: (numMoves) => dispatch(updateNumMoves(numMoves)),
    addBoundingBoxFilter: (boundingBoxFilter) => dispatch(addBoundingBoxFilter(boundingBoxFilter))
  };
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.map = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [13, 43],
      zoom: 1,
      minZoom: 1,
      maxZoom: 11
    });

    const distanceQuery = `SELECT ca.cartodb_id,
                            ca.the_geom,
                            ca.the_geom_webmercator,
                            ca.name,
                            1000 - levenshtein(lower('${this.props.city.name}'),lower(ca.name)) as distance,
                            round(ST_DistanceSphere(ca.the_geom,co.the_geom) / 10000) as km_distance
                          FROM capitals ca, (
                              SELECT the_geom
                              FROM capitals
                              WHERE cartodb_id = ${this.props.city.id}
                          ) as co`;  // TODO: check if full query is needed

    const vlSource = new cartovl.source.SQL(distanceQuery);
    const viz = new cartovl.Viz();
    const layer = new cartovl.Layer('cities', vlSource, viz);
    layer.addTo(this.map);

    const boundingBoxFilter = new cartojs.filter.BoundingBox();
    this.props.addBoundingBoxFilter(boundingBoxFilter);

    this.map.on('moveend', event => {
      const mapboxBounds = this.map.getBounds();
      const cartoBounds = {
        west: mapboxBounds.getWest(),
        north: mapboxBounds.getNorth(),
        east: mapboxBounds.getEast(),
        south: mapboxBounds.getSouth(),
      };
      boundingBoxFilter.setBounds(cartoBounds);

      this.props.updateNumMoves(this.props.numMoves + 1);
    });
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}

Map.propTypes = {
  numMoves: PropTypes.number,
  city: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
