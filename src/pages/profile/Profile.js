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
      firstName: this.props.user ? this.props.user.firstName : '',
      lastName: this.props.user ? this.props.user.lastName : '',
      location: this.props.user ? this.props.user.location : '',
      learningTargets: this.props.user ? this.props.user.learningTargets : '',
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
        <h2 class="text-secondary">{this.state.firstName}'s Profile</h2>
        <Form onSubmit={this.handleSubmit} className='mt-4'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label> First Name</Form.Label>
            <Form.Control onChange={this.handleChange} type="email" disabled value={this.state.firstName} />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Last Name</Form.Label>
            <Form.Control onChange={this.handleChange} type="email" disabled value={this.state.lastName} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Email</Form.Label>
            <Form.Control onChange={this.handleChange} type="email" disabled value={this.props.user && this.props.user.email} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Learning Targets</Form.Label>
            <Form.Control onChange={this.handleChange} type="email" disabled value={this.state.learningTargets} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Location</Form.Label>
            <Form.Control onChange={this.handleChange} type="email" disabled value={this.state.location} />
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
