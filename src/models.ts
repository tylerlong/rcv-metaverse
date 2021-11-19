import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import {TokenInfo} from '@rc-ex/core/lib/definitions';
import localforage from 'localforage';

import {
  CODE,
  CODE_VERIFIER_KEY,
  REDIRECT_URI,
  TOKEN_INFO_KEY,
} from './constants';
import Metaverse from './metaverse';
import rc from './ringcentral';
import {
  Bridge,
  CreateResponse,
  InboundMessage,
  Meeting,
  UpdateResponse,
} from './types';
import WebSocketManager from './websocket-manager';

const baseTime = Date.now();
let req_seq = -1;
let webSocketManager: WebSocketManager;
let metaverse: Metaverse;

const checkSavedToken = async () => {
  const tokenInfo = await localforage.getItem<TokenInfo>(TOKEN_INFO_KEY);
  if (tokenInfo === null) {
    return false;
  }
  rc.token = tokenInfo;
  try {
    await rc.refresh();
    await localforage.setItem(TOKEN_INFO_KEY, rc.token);
  } catch (e) {
    return false;
  }
  return true;
};

export class Store {
  ready = false;
  hasToken = false;
  loginUrl = '';
  meetingId = process.env.RINGCENTRAL_MEETING_ID ?? '';
  inMeeting = false;

  get isMeetingIdValid() {
    return /\b\d{9}\b/.test(this.meetingId);
  }

  // right after page loaded
  async init() {
    if (CODE === null) {
      this.hasToken = await checkSavedToken();
      this.ready = true;
    } else {
      await this.authorize();
      await localforage.setItem(TOKEN_INFO_KEY, rc.token);
      window.location.replace(REDIRECT_URI);
    }
  }

  // user click login button
  async login() {
    if (this.loginUrl === '') {
      const authorizeUriExtension = new AuthorizeUriExtension();
      await rc.installExtension(authorizeUriExtension);
      this.loginUrl = authorizeUriExtension.buildUri({
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
      });
      const codeVerifier = authorizeUriExtension.codeVerifier;
      await localforage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    }
    window.location.replace(this.loginUrl);
  }

  // user click logout button
  async logout() {
    await localforage.removeItem(TOKEN_INFO_KEY);
    window.location.replace(REDIRECT_URI);
  }

  // user redirected back from RC login page
  async authorize() {
    await rc.authorize({
      code: CODE!,
      redirect_uri: REDIRECT_URI,
      code_verifier:
        (await localforage.getItem<string>(CODE_VERIFIER_KEY)) ??
        'fake-code-verifier',
    });
  }

  // click the join meeting button
  async joinMeeting() {
    this.inMeeting = true;
    const shortId = this.meetingId.match(/\b\d{9}\b/)![0];

    // fetch bridge
    let r = await rc.get('/rcvideo/v1/bridges', {shortId});
    const bridge = r.data as Bridge;

    // create meeting session
    r = await rc.post(
      `/rcvideo/v1/bridges/${bridge.id}/meetings`,
      {
        participants: [
          {
            sessions: [
              {
                userAgent: 'rcv/web/0.10',
                operatingSystem: 'macos',
                localMute: false,
                localMuteVideo: false,
              },
            ],
            streams: [{audio: {isActiveIn: false, isActiveOut: false}}],
          },
        ],
      },
      {
        baseStateOnly: '1',
      }
    );
    const meeting = r.data as Meeting;

    // local session
    const participant = meeting.participants[0];
    const session = participant.sessions[0];

    // init the WebSocketManager
    webSocketManager = new WebSocketManager(meeting.wsConnectionUrl);

    // auto respond to message from sfu
    webSocketManager.on(
      WebSocketManager.INBOUND_MESSAGE,
      (inboundMessage: InboundMessage) => {
        if (inboundMessage.event === 'network_status_req') {
          webSocketManager.send({
            req_src: 'sfu',
            req_seq: inboundMessage.req_seq,
            rx_ts: Date.now() - baseTime,
            tx_ts: Date.now() - baseTime,
            success: true,
            event: 'network_status_resp',
            body: {},
            version: 1,
            type: 'session',
            id: session.id,
          });
        } else if (inboundMessage.event === 'as_report_req') {
          webSocketManager.send({
            req_src: 'sfu',
            req_seq: inboundMessage.req_seq,
            rx_ts: Date.now() - baseTime,
            tx_ts: Date.now() - baseTime,
            success: true,
            event: 'as_report_resp',
            body: {},
            version: 1,
            type: 'session',
            id: session.id,
          });
        }
      }
    );

    // join meeting
    await webSocketManager.send({
      req_src: 'webcli',
      req_seq: ++req_seq,
      tx_ts: Date.now() - baseTime,
      event: 'create_req',
      body: {
        max_remote_audio: 100,
        max_remote_video: [
          {
            quality: 1,
            slots: 100,
          },
        ],
        conference_id: '',
        sdp_semantics: 'plan-b',
        token: session.token,
        meta: {
          meeting_id: bridge.shortId,
          user_agent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
          x_user_agent:
            'RCAppRCVWeb/21.3.33.0 (RingCentral; macos/10.15; rev.aaebe132)',
        },
      },
      version: 1,
      type: 'session',
      id: session.id,
    });

    // join meeting response
    const createSeq = req_seq;
    const createResponse =
      await webSocketManager.waitForMessage<CreateResponse>(respMessage => {
        return (
          respMessage.event === 'create_resp' &&
          respMessage.req_seq === createSeq
        );
      });

    // join meeting acknowledge
    await webSocketManager.send({
      req_src: 'webcli',
      req_seq: createSeq,
      rx_ts: Date.now() - baseTime,
      tx_ts: Date.now() - baseTime,
      success: true,
      event: 'create_ack',
      body: {},
      version: 1,
      type: 'session',
      id: session.id,
    });

    // WebRTC peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: createResponse.body.ice_servers,
      sdpSemantics: 'plan-b',
    } as RTCConfiguration);

    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    for (const track of userMedia.getTracks()) {
      peerConnection.addTrack(track, userMedia);
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // send offer
    await webSocketManager.send({
      req_src: 'webcli',
      req_seq: ++req_seq,
      tx_ts: Date.now() - baseTime,
      event: 'update_req',
      body: {
        sdp: peerConnection.localDescription!.sdp,
        streams: [
          {
            id: userMedia.id,
            msid: userMedia.id,
          },
        ],
      },
      version: 1,
      type: 'session',
      id: session.id,
    });

    // send offer response
    const updateSeq = req_seq;
    const updateResponse =
      await webSocketManager.waitForMessage<UpdateResponse>(inboundMessage => {
        return (
          inboundMessage.event === 'update_resp' &&
          inboundMessage.req_seq === updateSeq
        );
      });

    // send offer acknowledge
    await webSocketManager.send({
      req_src: 'webcli',
      req_seq: updateSeq,
      rx_ts: Date.now() - baseTime,
      tx_ts: Date.now() - baseTime,
      success: true,
      event: 'update_ack',
      body: {},
      version: 1,
      type: 'session',
      id: session.id,
    });

    // play the videos
    peerConnection.ontrack = e => {
      if (e.track.kind === 'video') {
        const videoElement = document.createElement(
          'video'
        ) as HTMLVideoElement;
        videoElement.autoplay = true;
        videoElement.setAttribute('width', '400');
        document.body.appendChild(videoElement);
        videoElement.srcObject = e.streams[0];
      }
    };

    // set remote answer
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription({
        type: 'answer',
        sdp: updateResponse.body.sdp,
      })
    );

    metaverse = new Metaverse();
  }
}
