import React, { Component } from 'react';
import { Title, Text, Input, Button } from '@carto/airship';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updateGameParams } from "../store/actions";
import { sqlClient } from "../backend"

const mapStateToProps = state => {
  return { userName: state.userName };
};

const mapDispatchToProps = dispatch => {
  return {
    updateGameParams: (userName, city) => dispatch(updateGameParams(userName, city))
  };
};

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.handleVamosClick = this.handleVamosClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {userName: ""};
  }

  handleVamosClick(event) {
    event.preventDefault();
    sqlClient.request({
      params: {q: `with r AS (select ceil(random()*202) as value) select cartodb_id, pp.name as name, sov0name, st_x(the_geom) as lon, st_y(the_geom) as lat from capitals pp, r where id = r.value`
      }
    }).then((response) => {
      if (response && response.data) {
        const result = response.data.rows[0];

        this.props.updateGameParams(this.state.userName, {name: result.name, country: result.sov0name, coordinates: [result.lat, result.lon], id: result.cartodb_id});
      } else {
        console.log('Something wrong happened');
      }
    });
  }

  handleChange(event) {
    this.setState({userName: event.target.value});
  }

  render() {
    return (
      <div>
        <Title>City Finder</Title>
        <Title as="h2">How to play</Title>
        <Text as="p">Put your name in the input, then try to navigate to the city mentioned in the minimum number of movements. Use the average distance of the displayed cities and the <tt>hot or cold</tt> description to guide you through the map.</Text>
        <Text as="p">To finish the game you need to zoom in until you see the city labeled. Then the map will block and the number of movements done will be sent to the server.</Text>
        <Title as="h2">Who are you?</Title>
        <div>
          <Input value={this.state.userName} onChange={this.handleChange} htmlFor="username"/>
          <Button onClick={this.handleVamosClick}>¡Vamos!</Button>
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  userName: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
