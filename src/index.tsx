import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';

import './index.css';

class App extends React.Component {
  render() {
    return (
      <>
        <h1>RCV Metaverse!</h1>
        <Button>Login</Button>
      </>
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App />, container);
