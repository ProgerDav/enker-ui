import React from 'react';
import PropTypes from 'prop-types';
import Socket from '../../socket';

import { LinkContainer } from 'react-router-bootstrap';

import { Container, Form, Button, Col, Row, InputGroup, ListGroup, Badge, Tab } from 'react-bootstrap';

/**
 * React component to render search page
 */
class Search extends React.Component {
  constructor(props) {
    //TODO: set default state of list of users, and text search, event handler and socket connect 
    super(props)
    this.state = {
      textSearch: '',
      studentsList: []
    };
    this.query = this.query.bind(this);
  }
  componentDidMount() {
    this.onStudentLoggedIn();
    this.query();
  }
  handleSubmit(event) {
    event.preventDefault();
    this.query(this.state.textSearch);
  }
  onStudentLoggedIn() {
    // TODO: Socket event handler if user logged in - run query
    Socket.connect(users => {
      users.on('user_login', user => {
        console.log(user);
        this.query(this.state.textSearch);
      });
    });
  }
  onStudentLoggedOut() {
    // TODO: Socket event handler if user logged out - run query
  }
  onstartChat(withUser) {
    // TODO: event to invoke start-chat action via Socket, redirect to /network page
  }
  query(textSearch) {
    Socket.connect(users => {
      users.emit('search', textSearch, result => {
        this.setState({studentsList: result});
      });
    });
  }
  render() {
    return (
      <Container className="mt-5">
        <Row>
          <Col lg={8} md={10} sm={12}>
            <Form onSubmit={e => this.handleSubmit(e)}>
              <Form.Group>
                <InputGroup size="lg" className="mb-3">
                  <Form.Control onChange={e => this.setState({textSearch: e.target.value})} value={this.state.textSearch}  aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                  <InputGroup.Append>
                    <Button type='submit' variant='outline-primary'>Search</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col lg={6} sm={12}>
            <Tab.Container id='students' defaultActiveKey='#user0'>
              <ListGroup>
                {this.state.studentsList.length > 0 ? this.state.studentsList.map(
                  (e, index) => <ListGroup.Item as='button' eventKey={`#user${index}`} key={e.id}>{e.firstName} {e.lastName} {e.loggedIn && <Badge variant="success">Online</Badge>}</ListGroup.Item>
                  ) : ''}
              </ListGroup>
            </Tab.Container>  
          </Col>
          <Col lg={6} sm={12}>
            <Tab.Content>
              {this.state.studentsList.map((user, index) => (
                  <Tab.Pane eventKey={`#user${index}`}>
                    <div>Name: {user.firstName} {user.lastName}</div>
                    <div>Email: {user.email}</div>
                    <div>Learning Targets: {user.learningTargets.join(', ')}</div>
                    <div>Location: {user.location}</div>
                    <Button className="mt-3" onClick={(e) => { e.preventDefault(); this.onstartChat(user)}}>Start Chat</Button>
                  </Tab.Pane>
                ))}
              <LinkContainer to='/network'><Button variant='primary'>Start Chat</Button></LinkContainer>
            </Tab.Content>  
          </Col>
        </Row>
      </Container>
    )
  }
}

Search.propTypes = {
  startChat: PropTypes.func,
  currentUser: PropTypes.object,
};
export default Search;