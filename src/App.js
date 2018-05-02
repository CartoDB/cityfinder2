import React, { Component } from 'react';
import Welcome from './components/Welcome';
import City from './components/City';
import Map from './components/Map';
import ScoreBoard from './components/ScoreBoard';
import { connect } from "react-redux";
import "./App.css"

const mapStateToProps = state => {
  return { city: state.city.name };
};

class App extends Component {
  render() {
    if (this.props.city) {
      return (
        <div className="grid-container">
          <div className="grid-item hints">
            <City />
          </div>
          <div className="grid-item map">
            <Map />
          </div>
          <div className="grid-item scoreboard">
            <ScoreBoard />
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid-container">
          <div className="grid-item welcome">
            <Welcome />
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(App);
