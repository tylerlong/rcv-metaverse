import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Spin} from 'antd';
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
            <Button onClick={() => store.logout()}>Logout</Button>
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
