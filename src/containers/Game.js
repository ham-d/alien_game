import { connect } from 'react-redux';

import App from '../App';
import { moveObjects, startGame, leaderboardLoaded, loggedIn, shoot } from '../actions/index';

const mapStateToProps = (state, ownProps) => {
  return {
    angle: state.angle,
    gameState: state.gameState,
    currentPlayer: state.currentPlayer,
    players: state.players,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    moveObjects: (mousePosition) => {
      dispatch(moveObjects(mousePosition))
    },
    startGame: () => {
      dispatch(startGame())
    },
    leaderboardLoaded: (players) => {
      dispatch(leaderboardLoaded(players))
    },
    loggedIn: (player) => {
      dispatch(loggedIn(player))
    },
    shoot: (mousePosition) => {
      dispatch(shoot(mousePosition))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)