import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Spin} from 'antd';
import {Component} from '@tylerlong/use-proxy/build/react';

import './index.css';
import {Store} from './models';
import store from './store';

class App extends Component<{store: Store}> {
  render() {
    const {store} = this.props;
    return (
      <>
        <h1>RCV Metaverse</h1>
        {store.ready ? (
          store.hasToken ? (
            <>
              <Button onClick={() => store.logout()} id="logout-btn">
                Logout
              </Button>
              <p>Please enter the 9-digits meeting ID to join the meeting.</p>
              <Input.Group compact>
                <Input
                  style={{width: '12rem'}}
                  placeholder="123456789"
                  onChange={e => (store.meetingId = e.target.value)}
                />
                <Button
                  type="primary"
                  disabled={!store.isMeetingIdValid}
                  onClick={() => store.joinMeeting()}
                >
                  Join Meeting
                </Button>
              </Input.Group>
            </>
          ) : (
            <Button type="primary" onClick={() => store.login()}>
              Login
            </Button>
          )
        ) : (
          <Spin size="large" />
        )}
      </>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App store={store} />, container);
