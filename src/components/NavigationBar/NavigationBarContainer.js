import { connect } from 'react-redux'
import { withRouter } from "react-router";

import NavigationBar from './NavigationBar';

const mapStateToProps = state => ({
  user: state.user  
})

const mapDispatchToProps = dispatch => {
  // TODO: Provide logout to user
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationBar));
