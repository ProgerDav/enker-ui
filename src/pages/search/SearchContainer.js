import { connect } from 'react-redux'

import Search from './Search';

import {startChat} from '../../redux/actions';

const mapStateToProps = state => ({
    currentUser: state.user.data,
    userError: state.user.error
})

const mapDispatchToProps = dispatch => ({
    startChat: (withUser) => {
        dispatch(startChat(withUser));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);