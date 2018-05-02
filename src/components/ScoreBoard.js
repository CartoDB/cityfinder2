import React, { Component } from 'react';
import { Title, Button, Widget, CategoryWidget } from '@carto/airship';
import PropTypes from 'prop-types';
import { cartojsClient } from "../backend";
import cartojs from '@carto/carto.js/dist/public/carto.js';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { numMoves: state.numMoves };
};

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {averageAttempts: {categories: [], max: 0}};
  }

  componentDidMount() {
    const gamesDataset = new cartojs.source.Dataset('games');
    const averageAttemptsDataview = new cartojs.dataview.Category(gamesDataset, 'name', {
      limit: 1000,
      operation: cartojs.operation.AVG,
      operationColumn: 'attempts'
    });

    averageAttemptsDataview.on('dataChanged', (newData) => {
      newData.categories = newData.categories.slice(0, 10);
      this.setState({averageAttempts: newData});
    });
    cartojsClient.addDataview(averageAttemptsDataview);
  }

  render() {
    return (
      <div>
        <Title as="h2">Scoreboard</Title>
        <div className="myScore">
          <Title as="h3"># Moves</Title>
          <Button secondary>{ this.props.numMoves }</Button>
        </div>
        <div className="widgets">
          <Widget>
            <Widget.Title>Games</Widget.Title>
            <CategoryWidget categories={this.state.averageAttempts.categories} max={this.state.averageAttempts.max} />
          </Widget>
        </div>
      </div>
    )
  }
}

ScoreBoard.propTypes = {
  numMoves: PropTypes.number
};

export default connect(mapStateToProps)(ScoreBoard);
