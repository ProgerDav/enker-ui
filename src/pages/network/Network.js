import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';


import VideoChat from './VideoChat';
import './network.css';
import Socket from '../../socket';

import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

//import logo from './../logo.svg';

/**
 * Main React Component for the networking page (WYSIWIG, Chat, Video, Canvas)
 */
class NetworkPage extends Component {
  constructor(props) {
    //TODO: set state and handlers for chat message and WYSIWIG
    super(props);
    this.state = {
      messages: [],
    };
  }
  handleNewUserMessage = (newMessage) => {
    // console.log(`New message incoming! ${newMessage}`);
    Socket.connect(user => {
      user.emit('message', newMessage, this.props.withUser);
    });
  }
  componentDidMount() {
    // TODO: connect to socket and emit/recieve messages for chat and editor
    addResponseMessage("Connected Successfully!");
    Socket.connect(user => {
      user.on('new message', msg => {
        addResponseMessage(msg);
        // this.setState({messages: this.state.messages.push(msg)});
      });
    });
  }
  componentWillUnmount() {
    // TODO: cleanup listeners for chat/editor sockets
    Socket.connect(user => {
      user.removeListener('message');
    });
  }
  render() {
    return (
      <Container fluid={true} className="p-0">
        { 
          // TODO: Add chat widget 
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            //profileAvatar={logo}
            title="TUMO Friends - Communicate And Create!"
            subtitle={`Chat with ${this.props.withUser && this.props.withUser.firstName}`}
          />
        } 
        <Row noGutters={true}>
          <Col>
            <span>TODO: add tabs for Canvas and WYSIWIG</span>
            { 
              // TODO: add tabs for Canvas and WYSIWIG }
            }
          </Col>
          <Col>
            <div>
                <VideoChat 
                  user={this.props.user}
                  caller={this.props.receiver ? this.props.withUser : this.props.user} 
                  receiver={this.props.receiver ? this.props.user : this.props.withUser}
                >
                </VideoChat>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default NetworkPage;
