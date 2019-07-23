import { connect } from 'react-redux'

import Profile from './Profile';

const mapStateToProps = state => ({
  user: state.user.data,
  userError: state.user.error,
})

const mapDispatchToProps = dispatch => {
  return {
    updateUser: () => console.log('update')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
