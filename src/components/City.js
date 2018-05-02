import React, { Component } from 'react';
import { Title, Button } from '@carto/airship';
import PropTypes from 'prop-types';
import { cartojsClient } from "../backend";
import cartojs from '@carto/carto.js/dist/public/carto.js';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { name: state.city.name, id: state.city.id, distance: state.distance, boundingBoxFilter: state.boundingBoxFilter };
};

class City extends Component {
  constructor(props) {
    super(props);
    this.state = {distance: 0 , hotOrCold: "cold"};
    this.boundingBoxFilterEnabled = false;
    this.averageDistanceDataView = null;
  }

  componentDidMount() {
    const distanceQuery = `SELECT ca.cartodb_id,
                            ca.the_geom,
                            ca.the_geom_webmercator,
                            ca.name,
                            1000 - levenshtein(lower('${this.props.name}'),lower(ca.name)) as distance,
                            round(ST_DistanceSphere(ca.the_geom,co.the_geom) / 10000) as km_distance
                          FROM capitals ca, (
                              SELECT the_geom
                              FROM capitals
                              WHERE cartodb_id = ${this.props.id}
                          ) as co`;

    const jsSource = new cartojs.source.SQL(distanceQuery);
    this.averageDistanceDataView = new cartojs.dataview.Formula(jsSource, 'km_distance', {
      operation: cartojs.operation.AVG
    });
    this.averageDistanceDataView.on('dataChanged', (newData) => {
      if (newData && newData.result) {
        this.setState({distance: newData.result.toFixed(1)});
      }
    });

    cartojsClient.addDataview(this.averageDistanceDataView);
  }

  render() {
    if (!this.boundingBoxFilter && this.props.boundingBoxFilter) {
      this.averageDistanceDataView.addFilter(this.props.boundingBoxFilter);
      this.boundingBoxFilterEnabled = true;
    }

    return (
      <div>
        <Title as="h2" className="city">{ this.props.name }</Title>
        <Title as="h3">You are...</Title>
        <Button secondary>{ this.state.hotOrCold }</Button>
        <Title as="h3">Average distance</Title>
        <Button secondary>{ this.state.distance }km</Button>
      </div>
    )
  }
}

City.propTypes = {
  name: PropTypes.string,
  distance: PropTypes.number,
  id: PropTypes.number,
  boundingBoxFilter: PropTypes.object
};

export default connect(mapStateToProps)(City);
