const initialState = {
  message: 'hello world',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ACTION_TYPE':
      return 
    default:
      return state
  }
}