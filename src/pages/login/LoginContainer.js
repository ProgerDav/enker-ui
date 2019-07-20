import { connect } from 'react-redux'

import Login from './Login';

import { loginUser } from './../../redux/actions';

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    loginUser: ({email, password}) => {
      dispatch(loginUser(email, password));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
