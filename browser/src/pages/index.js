import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import AppIpfs from "../lib/ipfs";
import CommandRouter from "../lib/commands";

let _this;

class IPFSPage extends React.Component {
  constructor(props) {
    super(props);

    _this = this;

    this.state = {
      output: "",
      chatOutput: "",
      chatInput: "",
      commandInput: "",
      commandOutput: "",
      showTerminal: true,
      handle: "browser"
    };

    const ipfsConfig = {
      handleLog: _this.handleLog,
      handleChatLog: _this.handleIncomingChatMsg
    };
    this.appIpfs = new AppIpfs(ipfsConfig);
    this.commandRouter = new CommandRouter();
  }

  async componentDidMount() {
    try {
      await this.appIpfs.startIpfs();
    } catch (err) {
      this.handleLog("Error trying to initialize IPFS node!");
      console.error("Error in componentDidMount(): ", err);
    }
  }

  render() {
    const { output, chatOutput, showTerminal, commandOutput } = _this.state;
    return (
      <Layout>
        <Helmet>
          <title>IPFS Example</title>
          <meta name="description" content="Generic Page" />
        </Helmet>

        <div id="main" className="alt">
          <section id="one">
            <div className="inner">
              <header className="major">
                <h1>IPFS Example</h1>
              </header>

              <label>
                Handle:{" "}
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.handleHandleInput}
                />
              </label>

              <span className="image main">
                <label>
                  Chat Terminal:
                  <textarea
                    id="chatTerminal"
                    name="chatTerminal"
                    rows="10"
                    cols="50"
                    readOnly
                    value={`${chatOutput ? `${chatOutput}>` : ">"}`}
                  />
                  <input
                    type="text"
                    id="chatInput"
                    name="chatInput"
                    value={this.state.chatInput}
                    onChange={this.handleTextInput}
                    onKeyDown={_this.handleChatKeyDown}
                  />
                </label>
              </span>

              <span className="image main">
                <label>
                  Command Terminal:
                  <textarea
                    id="commandTerminal"
                    name="commandTerminal"
                    rows="10"
                    cols="50"
                    readOnly
                    value={`${commandOutput ? `${commandOutput}>` : ">"}`}
                  />
                  <input
                    type="text"
                    id="commandInput"
                    name="commandInput"
                    value={this.state.commandInput}
                    onChange={this.handleTextInput}
                    onKeyDown={_this.handleCommandKeyDown}
                  />
                </label>
              </span>

              <span className="image main">
                {showTerminal && (
                  <label>
                    IPFS Status:
                    <textarea
                      id="ipfsTerminal"
                      name="ipfsTerminal"
                      rows="10"
                      cols="50"
                      readOnly
                      value={`${output ? `${output}>` : ">"}`}
                    />
                  </label>
                )}
              </span>

              <p>
                This page demonstrates how to create an IPFS node in the
                browser. If you open a web console, you can interact with the
                IPFS node by interacting with <code>window.ipfs</code>.
              </p>
              <p>
                Try copying and pasting this instruction into the web console,
                in order to show the peers your browser-based IPFS node is
                connected to:
                <br />
                <code>
                  console.log(JSON.stringify(await window.ipfs.swarm.peers(),
                  null, 2))
                </code>
              </p>
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  // Adds a line to the terminal
  handleLog(str) {
    try {
      _this.setState({
        output: _this.state.output + "   " + str + "\n"
      });
      _this.keepScrolled();
    } catch (error) {
      console.warn(error);
    }
  }

  // Keeps the terminal scrolled to the last line
  keepScrolled() {
    try {
      // Keeps scrolled to the bottom
      var textarea = document.getElementById("ipfsTerminal");
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  // Shows the terminal
  handleShowTerminal() {
    _this.setState({
      showTerminal: true
    });
  }

  // Hides the terminal
  handleHideTerminal() {
    _this.setState({
      showTerminal: false
    });
  }

  // Handles text typed into the input box.
  handleTextInput = event => {
    event.preventDefault();

    const target = event.target;
    const value = target.value;
    const name = target.name;
    // console.log('value: ', value)

    this.setState({
      [name]: value
    });
  };

  /* START chat handling functions */

  handleIncomingChatMsg(msg) {
    try {
      // console.log('msg: ', msg)
      const chatData = msg.data.data.message;
      const chatHandle = msg.data.data.handle;
      const chatMsg = `${chatHandle}: ${chatData}`;

      _this.handleChatLog(chatMsg);

      _this.keepChatScrolled();
    } catch (error) {
      console.warn(error);
    }
  }

  // Keeps the terminal scrolled to the last line
  keepChatScrolled() {
    try {
      // Keeps scrolled to the bottom
      var textarea = document.getElementById("chatTerminal");
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  // Adds a line to the terminal
  handleChatLog(msg) {
    try {
      // console.log("msg: ", msg);

      _this.setState({
        chatOutput: _this.state.chatOutput + "   " + msg + "\n"
      });

      // _this.keepScrolled();
    } catch (error) {
      console.warn(error);
    }
  }

  // Handles when the Enter key is pressed while in the chat input box.
  async handleChatKeyDown(e) {
    if (e.key === "Enter") {
      // _this.submitMsg()
      // console.log("Enter key");

      // Send a chat message to the chat pubsub room.
      // const now = new Date();
      // const msg = `Message from BROWSER at ${now.toLocaleString()}`
      const msg = _this.state.chatInput;
      // console.log(`Sending this message: ${msg}`);

      _this.handleChatLog(`me: ${msg}`);

      const CHAT_ROOM_NAME = "psf-ipfs-chat-001";

      const chatObj = {
        message: msg,
        // handle: "browser"
        handle: _this.state.handle
      };

      const chatData = _this.appIpfs.ipfsCoord.ipfs.schema.chat(chatObj);
      const chatDataStr = JSON.stringify(chatData);
      await _this.appIpfs.ipfsCoord.ipfs.pubsub.publishToPubsubChannel(
        CHAT_ROOM_NAME,
        chatDataStr
      );

      _this.setState({
        chatInput: ""
      });

      _this.keepChatScrolled();
    }
  }
  /* END chat handling functions */

  //
  /* START command handling functions */
  // Handles when the Enter key is pressed while in the chat input box.
  async handleCommandKeyDown(e) {
    if (e.key === "Enter") {
      // _this.submitMsg()
      // console.log("Enter key");

      // Send a chat message to the chat pubsub room.
      // const now = new Date();
      // const msg = `Message from BROWSER at ${now.toLocaleString()}`
      const msg = _this.state.commandInput;
      // console.log(`Sending this message: ${msg}`);

      // _this.handleCommandLog(`me: ${msg}`);

      const outMsg = _this.commandRouter.route(msg);
      _this.handleCommandLog(`\n${outMsg}`);

      // _this.keepCommandScrolled();

      // Clear the input text box.
      _this.setState({
        commandInput: ""
      });
    }
  }

  // Adds a line to the terminal
  async handleCommandLog(msg) {
    try {
      // console.log("msg: ", msg);

      _this.setState({
        commandOutput: _this.state.commandOutput + "   " + msg + "\n"
      });

      await this.sleep(250)

      // _this.keepScrolled();
      _this.keepCommandScrolled();
    } catch (error) {
      console.warn(error);
    }
  }

  // Keeps the terminal scrolled to the last line
  keepCommandScrolled() {
    try {
      // Keeps scrolled to the bottom
      var textarea = document.getElementById("commandTerminal");
      if (textarea) {
        window.textarea = textarea
        console.log(`start: textarea.scrollTop: ${textarea.scrollTop}`)
        console.log(`start: textarea.scrollTopMax: ${textarea.scrollTopMax}`)
        console.log(`start: textarea.scrollHeight: ${textarea.scrollHeight}`)

        textarea.scrollTop = textarea.scrollTopMax;

        console.log(`stop: textarea.scrollTop: ${textarea.scrollTop}`)
        console.log(`stop: textarea.scrollTopMax: ${textarea.scrollTopMax}`)
        console.log(`stop: textarea.scrollHeight: ${textarea.scrollHeight}`)
      }
    } catch (error) {
      console.warn(error);
    }
  }
  /* END command handling functions */

  // Handles text typed into the 'handle' input box.
  handleHandleInput = event => {
    event.preventDefault();

    const target = event.target;
    const value = target.value;
    const name = target.name;
    // console.log('value: ', value)

    this.setState({
      [name]: value
    });
  };

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default IPFSPage;
