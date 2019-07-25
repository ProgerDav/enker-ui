import React from 'react';

import { Button } from 'react-bootstrap';
import callIcon from './phone-call.png';
import endCallIcon from './end-call-icon.png';
import LioWebRTC from 'liowebrtc';
/**
 * VideoChat - WebRTC Workshop: will contain all the logic to start video chat with peer
 */
class VideoChat extends React.Component {
  constructor(props) {
    // TODO: set logged in user state, room id, flag if call in progress, and video configuration
    super(props);
    this.state = {
      nick: props.user ? props.user.firstName : null,
      roomID: `tumochat${[props.caller.email, props.receiver.email].sort().join()}`,
      muted: true,
      camPaused: false,
      peers: [],
      inCall: false,
    };
    this.videoRef = React.createRef();
    this.remoteVideos = {};
  }
  componentDidMount() {
    // TODO: Initialize webrtc object and event listeners
    // addVideo, removeVideo handlers when adding/removing peers to room
    // handleConnectionError - error handler
    // startCall/stopCall - trigger for joining and leaving a room
    // readyToJoin -- joining a room
    // generateRemotes - video elements of peers
    this.webrtc = new LioWebRTC({
      // The url for your signaling server. Use your own in production!
      url: 'https://sm1.lio.app:443/',
      // The local video ref set within your render function
      localVideoEl: this.localVid,
      // Immediately request camera access
      autoRequestMedia: false,
      // Optional: nickname
      nick: this.state.nick,
      debug: true,
      localVideo: {
        mirror: false,
        muted: true
      },
      stunservers: ['stun1.l.google.com:19302', 'stun2.l.google.com:19302'],
      turnservers: ['ec2-54-213-136-50.us-west-2.compute.amazonaws.com']
    });

    this.webrtc.on('peerStreamAdded', this.addVideo);
    this.webrtc.on('removedPeer', this.removeVideo);
    // this.webrtc.on('ready', this.readyToJoin);
    this.webrtc.on('iceFailed', this.handleConnectionError);
    this.webrtc.on('connectivityError', this.handleConnectionError);
  }
  componentWillUnmount() {
    // TODO: disconnect when removing component
    this.webrtc.disconnect();
  }
  addVideo = (stream, peer) => {
    this.setState({ peers: [...this.state.peers, peer] }, () => {
      this.webrtc.attachStream(stream, this.remoteVideos[peer.id], {mirror: false});
      this.setState({
        inCall: true
      });
    });
  }

  removeVideo = (peer) => {
    this.setState({
      peers: this.state.peers.filter(p => !p.closed)
    });
  }

  handleConnectionError = (peer) => {
    const pc = peer.pc;
    console.log('had local relay candidate', pc.hadLocalRelayCandidate);
    console.log('had remote relay candidate', pc.hadRemoteRelayCandidate);
  }

  startCall() {
    this.webrtc.startLocalVideo();
    this.readyToJoin();
  }
  stopCall() {
    this.webrtc.leaveRoom();
    this.setState({ inCall: false });
  }


  readyToJoin = () => {
    // Starts the process of joining a room.
    this.webrtc.joinRoom(this.state.roomID, (err, desc) => {
    });
  }
  generateRemotes = () => this.state.peers.map((p) => (
    <div key={p.id}>
      <div id={/* The video container needs a special id */ `${this.webrtc.getContainerId(p)}`}>
        <video
          // Important: The video element needs both an id and ref
          id={this.webrtc.getDomId(p)}
          ref={(v) => this.remoteVideos[p.id] = v}
        />
      </div>
      <p>{p.nick}</p>
    </div>
  ));
  render() {
    // TODO: render video element of user and peers
    return (
      <div>
        {this.generateRemotes()}
        <div>
            <video
              // height='auto'
              autoPlay
              controls
              // Important: The local video element needs to have a ref
              ref={(vid) => { this.localVid = vid; }}
            />
            <p>{this.state.nick}</p>
        </div>
        <div className='position-absolute'>
          <Button disabled={this.state.inCall ? true : null} variant='link' onClick={() => this.startCall()}>
            <img width="45px" src={callIcon} alt="Call" />
          </Button>
          <Button disabled={this.state.inCall ? null : true} variant='link' onClick={() => this.stopCall()}>
            <img width="45px" src={endCallIcon} alt="Endcall" />
          </Button>
        </div>
      </div>
    );
  }
}

export default VideoChat;
