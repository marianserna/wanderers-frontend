import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';

import MapGL from '../components/MapGL';
import BuddyForm from '../components/BuddyForm';
import SearchMap from '../components/SearchMap';
import Chat from '../components/Chat';

import { ChatBuddyList, ChatBuddyListItem } from '../elements/chat';
import { VideoContainer, VideoTag, VideoBtn } from '../elements/video';
import { TriggerChat, TriggerBuddy } from '../elements/triggers';

import Peer from 'peerjs';

// for now localhost only
const enablePeer = window.location.host.indexOf('localhost') >= 0;

@inject('WanderersStore', 'UiStore')
@observer
export default class ShowTrip extends Component {
  constructor(props) {
    super(props);

    if (enablePeer) {
      this.peer = new Peer(this.props.WanderersStore.user.id, {
        key: 'rfgj72lpk6fg8pvi'
      });
    }

    this.call = null;
  }

  componentDidMount() {
    // person who receives call
    if (enablePeer) {
      this.peer.on('call', call => {
        this.call = call;
        this.props.UiStore.showAnswerCall = true;
      });
    }

    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        this.props.UiStore.showBuddyForm = false;
        this.props.UiStore.showChat = false;
      }
    });
  }

  answerCall = e => {
    e.preventDefault();

    this.props.UiStore.callInProgress = true;
    this.props.UiStore.showAnswerCall = false;

    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        this.stream = stream;
        this.localVideo.srcObject = stream;
        this.call.answer(stream);

        // Answer the call with an A/V stream.
        this.call.on('stream', remoteStream => {
          this.remoteVideo.srcObject = remoteStream;
        });
      },
      function(err) {
        console.log('Failed to get local stream', err);
      }
    );
  };

  stopCall = e => {
    e.preventDefault();

    this.call.close();

    this.localVideo.srcObject = null;
    this.props.UiStore.callInProgress = false;

    this.stream.getTracks().forEach(track => {
      track.stop();
    });
  };

  startChat = (e, userId) => {
    e.preventDefault();

    // person who calls
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        this.call = this.peer.call(userId, stream);
        this.stream = stream;
        this.localVideo.srcObject = stream;
        this.props.UiStore.callInProgress = true;

        this.call.on('stream', remoteStream => {
          this.remoteVideo.srcObject = remoteStream;
        });
      },
      err => {
        console.log('Failed to get local stream', err);
      }
    );
  };

  render() {
    const { WanderersStore, UiStore } = this.props;
    const trip = WanderersStore.trip;

    if (!trip) {
      return '🤘';
    }

    return (
      <div>
        <ChatBuddyList>
          {WanderersStore.buddies.map(buddy => (
            <ChatBuddyListItem key={buddy.id}>
              <p>{buddy.name} </p>
              {enablePeer && buddy.user_id !== WanderersStore.user.id ? (
                <img
                  src="/videoChat.svg"
                  className="videoIcon"
                  alt="chat icon"
                  onClick={e => this.startChat(e, buddy.user_id)}
                />
              ) : (
                ''
              )}
            </ChatBuddyListItem>
          ))}
        </ChatBuddyList>
        <SearchMap />
        {UiStore.showBuddyForm ? (
          <BuddyForm />
        ) : (
          <TriggerBuddy
            className="btn"
            onClick={e => {
              e.preventDefault();
              UiStore.showBuddyForm = true;
            }}
          >
            INVITE BUDDY
          </TriggerBuddy>
        )}

        <VideoContainer
          style={{
            display:
              this.props.UiStore.callInProgress ||
              this.props.UiStore.showAnswerCall
                ? 'block'
                : 'none'
          }}
        >
          <VideoTag
            innerRef={video => {
              this.localVideo = video;
            }}
            autoPlay
            muted
          />
          <VideoTag
            innerRef={video => {
              this.remoteVideo = video;
            }}
            autoPlay
          />

          {this.props.UiStore.showAnswerCall ? (
            <VideoBtn onClick={e => this.answerCall(e)}>Answer Call</VideoBtn>
          ) : (
            <VideoBtn onClick={e => this.stopCall(e)}>Hang up</VideoBtn>
          )}
        </VideoContainer>

        {UiStore.showChat ? (
          <Chat />
        ) : (
          <TriggerChat
            className="btn"
            onClick={e => {
              e.preventDefault();
              UiStore.showChat = true;
            }}
          >
            CHAT
          </TriggerChat>
        )}

        <MapGL />
      </div>
    );
  }
}
