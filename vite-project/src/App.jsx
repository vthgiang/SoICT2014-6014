import React, { Component } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { IntlActions } from "react-redux-multilingual";
import { ToastContainer, toast } from "react-toastify";
import ReactFlow, { ReactFlowProvider } from "reactflow";
import Routes from "./react-routes/routes";
import store from "./redux/store";
import { PinnedPanel } from "./common-components";
import TaskTimesheetLog from "./modules/task/task-perform/component/taskTimesheetLog";

import AuthAlert from "./modules/alert/components/authAlert";
import ServerDisconnectedAlert from "./modules/alert/components/serverDisconnectdAlert";
import { SocketConstants } from "./modules/socket/redux/constants";

import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import { getStorage, setStorage } from "./config";
import firebase from "./firebase";

const history = createBrowserHistory();

const getFCToken = async () => {
  try {
    let fcToken = getStorage("fcToken");
    if (!fcToken) {
      const messaging = firebase.messaging();
      fcToken = await messaging.getToken({
        vapidKey:
          "BLXA7GNvA6Nk3sqs8JP9aSRGI_ZyU03e9C9F3Ue7HpnXD4OWzFvdmENmQoNafmtCDazShrjom0rRLQwRpn0b8Vw",
      });
      console.log("TOken", fcToken);
      setStorage("fcToken", fcToken);
    }

    return fcToken;
  } catch (err) {
    console.log(err);
  }
};
// firebase.analytics();
class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    getFCToken();
    const userId = getStorage("userId");
    if (userId) {
      const { socket } = store.getState();
      if (!socket.connected)
        store.dispatch({ type: SocketConstants.CONNECT_SOCKET_IO });
    }
  }

  render() {
    return (
      <>
        <ServerDisconnectedAlert />
        <AuthAlert />
        <ToastContainer
          enableMultiContainer
          closeOnClick
          draggable={false}
          containerId="toast-notification"
          position={toast.POSITION.TOP_RIGHT}
        />
        <Router history={history}>
          <Routes />
        </Router>
        <PinnedPanel>
          <TaskTimesheetLog />
        </PinnedPanel>
      </>
    );
  }
}

export default App;
