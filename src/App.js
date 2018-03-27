import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Auth0 from 'auth0-web';
import io from 'socket.io-client';

import { getCanvasPosition } from './utils/formulas';
import Canvas from './components/Canvas';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './utils/config';

Auth0.configure({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: 'http://localhost:3000/',
  responseType: 'token id_token',
  scope: 'openid profile manage:points',
  audience: 'https://aliens-go-home.digituz.com.br',
});

class App extends Component {
  constructor(props) {
    super(props);

    this.socket = null;
    this.currentPlayer = null;
  }

  componentDidMount() {
    const _this = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe((auth) => {
      if (!auth) return;

      _this.playerProfile = Auth0.getProfile();
      _this.currentPlayer = {
        id: _this.playerProfile.sub,
        maxScore: 0,
        name: _this.playerProfile.name,
        picture: _this.playerProfile.picture,
      }

      this.props.loggedIn(_this.currentPlayer);

      _this.socket = io('http://localhost:3001', {
        query: `token=${Auth0.getAccessToken()}`,
      })
      _this.socket.on('players', (players) => {
        this.props.leaderboardLoaded(players);

        players.forEach((player) => {
          if (player.id === _this.currentPlayer.id) {
            _this.currentPlayer.maxScore = player.maxScore;
          }
        });
      });
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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.gameState.started && this.props.gameState.started) {
      if (this.currentPlayer.maxScore < this.props.gameState.kills) {
        this.socket.emit('new-max-score', {
          ...this.currentPlayer,
          maxScore: this.props.gameState.kills,
        })
      }
    }
  }

  trackMouse(event) {
    this.canvasMousePosition = getCanvasPosition(event);
  }

  shoot = () => {
    this.props.shoot(this.canvasMousePosition);
  }

  render() {
    return (
      <Canvas
        angle={this.props.angle}
        gameState={this.props.gameState}
        startGame={this.props.startGame}
        trackMouse={event => (this.trackMouse(event))}
        currentPlayer={this.props.currentPlayer}
        players={this.props.players}
        shoot={this.shoot}
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
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  leaderboardLoaded: PropTypes.func.isRequired,
  loggedIn: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  })),
  shoot: PropTypes.func.isRequired,
};

App.defaultProps = {
  currentPlayer: null,
  players: null,
}

export default App;
