import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Divider, Input, Spin} from 'antd';
import {Component} from '@tylerlong/use-proxy/build/react';

import './index.css';
import {Store} from './models';
import store from './store';

class App extends Component<{store: Store}> {
  render() {
    const {store} = this.props;
    const heading = <h1>RCV Metaverse</h1>;
    if (!store.ready) {
      return (
        <>
          {heading} <Spin size="large" />
        </>
      );
    }
    if (!store.hasToken) {
      return (
        <>
          {heading}
          <Button type="primary" onClick={() => store.login()}>
            Login
          </Button>
        </>
      );
    }
    if (!store.inMeeting) {
      return (
        <>
          {heading}
          <>
            <Button onClick={() => store.logout()} id="logout-btn">
              Logout
            </Button>
            <p>Enter a meeting ID or a meeting link to continue.</p>
            <p>Please make sure that the meeting is currently ongoing.</p>
            <p>
              At least one of the participants turn on video or do screen share.
            </p>
            <Input.Group compact>
              <Input
                style={{width: '20rem'}}
                placeholder="123456789"
                defaultValue={process.env.RINGCENTRAL_MEETING_ID ?? ''}
                onChange={e => (store.meetingId = e.target.value)}
              />
              <Button
                type="primary"
                disabled={!store.isMeetingIdValid}
                onClick={() => store.joinMeeting()}
              >
                Enter RCV Metaverse
              </Button>
            </Input.Group>
            <Divider />
          </>
        </>
      );
    }
    return (
      <>
        {store.streamsReady ? null : <Spin size="large" />}
        <canvas id="metaverse-canvas" />
      </>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App store={store} />, container);
