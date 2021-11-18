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
        <h1>RCV Metaverse!</h1>
        {store.ready ? (
          store.hasToken ? (
            'You have logged in. But this website is still under construction.'
          ) : (
            <Button
              type="primary"
              onClick={() => window.location.replace(store.loginUrl)}
            >
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
