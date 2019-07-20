import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';

/**
 * Component for Login Page
 */
export default class Login extends Component {
  constructor(props) {
    //set state and form handlers
    super(props);
    this.state = {
      email: 'davit@gmail.com',
      password: 'password'
    }
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.loginUser(this.state);
  }
  handleChange(type, value){
    this.setState({
      [type]: value
    });
  }
  render() {
    // TODO: use to redirect if user not logged in
    if (this.props.user) {
      return (
        <Redirect to={{
          pathname: '/profile',
        }} />
      )
    }
    return (
      <Container className="mt-3">
        <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text onChange={e => this.handleChange('email', e.target.value)} value={() => this.state.email} className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={e => this.handleChange('password', e.target.value)} type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
      </Container>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func,
  user: PropTypes.object,
  userError: PropTypes.string,
}
