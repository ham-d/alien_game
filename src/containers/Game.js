import { connect } from 'react-redux';

import App from '../App';
import { moveObjects, startGame } from '../actions/index';

const mapStateToProps = (state, ownProps) => {
  return {
    angle: state.angle,
    gameState: state.gameState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    moveObjects: (mousePosition) => {
      dispatch(moveObjects(mousePosition))
    },
    startGame: () => {
      dispatch(startGame())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)