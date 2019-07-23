import { connect } from 'react-redux'

import Search from './Search';

const mapStateToProps = state => ({
    user: state.user.data,
})

const mapDispatchToProps = dispatch => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);