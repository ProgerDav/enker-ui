
import Socket from '../socket';

const apiHost = process.env.REACT_APP_API_HOST || 'http://localhost:3001';
const axios = require('axios');

export const createUser = (email, password, firstName, lastName, learningTargets, location) => {
  return dispatch => {
    const user = {
      email,
      password,
      firstName,
      lastName,
      learningTargets,
      location
    };
    axios.post(`${apiHost}/students`, user)
      .then(response => {
        dispatch({
          type: 'CREATE_USER',
          payload: response
        })
      })
      .catch(err => {
        dispatch({
          type: 'CREATE_USER_ERROR',
          payload: getErrorMessage(err)
        })
      })
  }
}

export const loginUser = (email, password) => {
  return dispatch => {
    axios.get(`${apiHost}/students/${email}`, { auth: { username: email, password: password } })
      .then(response => {
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('password', password);
        Socket.connect(user => {
          user.emit('login', { email, password });
          // user.on('user_login', data => console.log(data));
          user.on('start-chat', fromUser => {
            console.log('start-chat', fromUser);
            startChat(fromUser)(dispatch);
            dispatch(imReceiver());
          });
          return dispatch({ type: 'LOGIN_USER', payload: response.data })
        });
      })
      .catch(err => {
        return dispatch({ type: 'LOGIN_USER_ERROR', payload: getErrorMessage(err) })
      });
  }
}

export const updateUser = () => {
  return dispatch => {
    /**
     * TODO: Update User action
     * 1. Call Update User API
     * 2. Dispatch action
     */
  }
}

export const logoutUser = (user) => {
  return dispatch => {
    Socket.connect(users => users.emit('logout', user));
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    dispatch({ type: 'LOGOUT_USER', payload: null });
  }
}

export const imReceiver = () => ({
  type: 'IM_THE_RECEIVER',
})

export const startChat = (withUser) => {
  return dispatch => {
    dispatch({
      type: 'START_CHAT',
      withUser,
    });
  };
}

export const stopChat = () => {
  return dispatch => {
    dispatch({
      type: 'STOP_CHAT'
    });
  }
}

// Use helper function to parse error message from API
function getErrorMessage(err) {
  let message = null;
  if (err.response) {
    message = err.response.data.error || err.response.data;
  } else if (err.request) {
    message = "No response from backend service.";
  } else {
    message = err.message;
  }
  console.log(err);
  return message;
}
