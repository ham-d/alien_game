import { connect } from 'react-redux';

import App from '../App';
import { moveObjects } from '../actions/index';

const mapStateToProps = (state, ownProps) => {
  return {
    angle: state.angle
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    moveObjects: (mousePosition) => {
      dispatch(moveObjects(mousePosition))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)