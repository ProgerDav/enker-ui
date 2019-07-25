import React from 'react';
import PropTypes from 'prop-types';
import Socket from '../../socket';


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
    this.onStudentLoggedIn = this.onStudentLoggedIn.bind(this);
    this.onStudentLoggedOut = this.onStudentLoggedOut.bind(this)
  }
  componentDidMount() {
    this.onStudentLoggedIn();
    this.onStudentLoggedOut();
    if (this.props.currentUser) this.query();
  }
  componentWillReceiveProps(nextProps) {
    this.query();
  }
  handleSubmit(event) {
    event.preventDefault();
    this.query(this.state.textSearch);
  }
  handleChange(e) {
    if (e.target.value.length === 0) {
      this.query();
    }
    this.setState({ textSearch: e.target.value });
  }
  onStudentLoggedIn() {
    // TODO: Socket event handler if user logged in - run query
    Socket.connect(users => {
      console.log('connected');
      users.on('user_login', user => {
        console.log('test_login');
        this.query();
      })
    });
  }
  onStudentLoggedOut() {
    // TODO: Socket event handler if user logged out - run query
    Socket.connect(users => users.on('user_logout', user => {
      this.query(this.state.textSearch);
    }));
  }
  onstartChat(withUser) {
    // TODO: event to invoke start-chat action via Socket, redirect to /network page
    this.props.startChat(withUser);
    Socket.users.emit('start-chat', withUser, this.props.currentUser);
    console.log('start-chat with user', withUser);
    this.props.history.push('/network');
  }
  query(textSearch) {
    console.log('query')
    Socket.connect(users => {
      users.emit('search', textSearch, result => {
        const { currentUser } = this.props;
        if (currentUser) {
          result = result.filter(e => e.email !== currentUser.email);
        }
        this.setState({ studentsList: result });
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
                  <Form.Control onChange={e => this.handleChange(e)} value={this.state.textSearch} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                  <InputGroup.Append>
                    <Button type='submit' variant='outline-primary'>Search</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Tab.Container id="search-results" defaultActiveKey="#user0">
            <Col>
              <ListGroup>
                {this.state.studentsList.map((user, index) => (
                  <ListGroup.Item
                    eventKey={`#user${index}`}
                    as="button"
                  >
                    <span>{user.firstName} {user.lastName}</span>
                    {user.loggedIn ? <Badge className="ml-2" variant="success">Online</Badge> : null}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                {this.state.studentsList.map((user, index) => (
                  <Tab.Pane eventKey={`#user${index}`}>
                    <div>Name: {user.firstName} {user.lastName}</div>
                    <div>Email: {user.email}</div>
                    <div>Learning Targets: {user.learningTargets.join(', ')}</div>
                    <div>Location: {user.location}</div>
                    <Button className="mt-3" onClick={(e) => { e.preventDefault(); this.onstartChat(user) }}>Start Chat</Button>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Tab.Container>
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