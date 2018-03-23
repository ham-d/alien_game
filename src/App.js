import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Auth0 from 'auth0-web';

import { getCanvasPosition } from './utils/formulas';
import Canvas from './components/Canvas';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './utils/config';

Auth0.configure({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: 'http://localhost:3000/',
  responseType: 'token id_token',
  scope: 'openid profile manage:points',
});

class App extends Component {
  componentDidMount() {
    const _this = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe((auth) => {
      console.log(auth);
    });

    setInterval(() => {
      _this.props.moveObjects(_this.canvasMousePosition)
    }, 10)
    
    window.onresize = () => {
      const cnvs = document.getElementById('aliens-go-home-canvas');
      cnvs.style.width = `${window.innerWidth}px`
      cnvs.style.height = `${window.innerHeight}px`
    }
    window.onresize();
  }

  trackMouse(event) {
    this.canvasMousePosition = getCanvasPosition(event);
  }

  render() {
    return (
      <Canvas
        angle={this.props.angle}
        gameState={this.props.gameState}
        startGame={this.props.startGame}
        trackMouse={event => (this.trackMouse(event))}
      />
    );
  }
}

App.propTypes = {
  angle: PropTypes.number.isRequired,
  gameState: PropTypes.shape({
    started: PropTypes.bool.isRequired,
    kills: PropTypes.number.isRequired,
    lives: PropTypes.number.isRequired,
    flyingObjects: PropTypes.arrayOf(
      PropTypes.shape({
        position: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        }).isRequired,
        id: PropTypes.number.isRequired,
      })
    ).isRequired
  }).isRequired,
  moveObjects: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
}

export default App;
