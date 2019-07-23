import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

/**
 * React component for Profile page
 */
class Profile extends Component {
  constructor(props) {
    super(props);
    //TODO: set state based on props, drop down values for learningTargets, locations, form event handlers
    // const { email, firstname, lastname } = this.props.user;
    this.state = {
      email: this.props.user ? this.props.user.email : '',
      firstname: this.props.user ? this.props.user.firstname : '',
      lastname: this.props.user ? this.props.user.lastname : '',
    }
  }
  handleSubmit(e) {
    // TODO: EXTRA WORK - handle form submit (if doing updates)
  }
  handleChange(type, value) {
    this.setState({
      [type]: value
    });
  }
  render() {
    // TODO: use to redirect to home page if user not logged in
    if (this.props.user == null) {
      return (
        <Redirect to={{
          pathname: '/',
        }} />
      )
    }
    return (
      <Container className="mt-5">
        <div>TODO: add Profile form page showing logged in user data</div>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder={this.state.email} onChange={e => this.handleChange('email', e.target.value)} value={this.state.email} />
            <Form.Text className="text-muted">
              My email
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="firstname">
            <Form.Label>Firstname</Form.Label>
            <Form.Control type='text' placeholder={this.state.firstname} value={this.state.firstname} onChange={e => this.handleChange('firstname', e.target.value)} />
          </Form.Group>
        </Form>
      </Container>
    )
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  userError: PropTypes.string,
}

export default Profile;
