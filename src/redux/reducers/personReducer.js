const personReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_PERSON':
        return action.payload;
      default:
        return state;
    }
  };
  
//the difference between the personReducer and userReducer is personReducer handles the table while userReducer
//handles the currently logged in user.
  export default personReducer;