import React, { Component } from 'react';
import { Container, Col, Row, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import VideoChat from './VideoChat';
import './network.css';
import Socket from '../../socket';

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import debounce from 'debounce';

import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

import Drawing from './Drawing';

/**
 * Main React Component for the networking page (WYSIWIG, Chat, Video, Canvas)
 */
class NetworkPage extends Component {
  constructor(props) {
    //TODO: set state and handlers for chat message and WYSIWIG
    super(props);
    this.state = {
      chatMessages: [],
      editorText: '',
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);
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
      });
      user.on('editor-message', (fromUser, message) => {
        console.log(message);
        this.setState({
          editorText: message
        })
      });
    });

  }
  handleEditorChange(source, editor) {
    console.log('source', source);
    if (source === 'user') {
      this.emitEditorMessage(editor.getContents());
    }
  }
  emitEditorMessage(message) {
    Socket.users.emit('editor-message', this.props.withUser, this.props.user, message);
  }
  componentWillUnmount() {
    // TODO: cleanup listeners for chat/editor sockets
    Socket.connect(user => {
      user.removeListener('new message');
    });
    Socket.users.removeListener('editor-message');
  }
  render() {
    if (!this.props.withUser) {
      return <Redirect to={{ pathname: '/search' }} />
    }
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
            {/* <span>TODO: add tabs for Canvas and WYSIWIG</span> */}
            <Tabs defaultActiveKey='document'>
              <Tab eventKey="document" title="Document">
                <ReactQuill
                  id="chat"
                  value={this.state.editorText}
                  onChange={(content, delta, source, editor) => { debounce(this.handleEditorChange(source, editor)) }}
                />
              </Tab>
              <Tab eventKey="canvas" title="Canvas">
                <Drawing withUser={this.props.withUser} currentUser={this.props.user} />
              </Tab>
            </Tabs>
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
