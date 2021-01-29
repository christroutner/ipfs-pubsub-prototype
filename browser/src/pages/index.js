import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import AppIpfs from "../lib/ipfs";

// const IPFS = typeof window !== `undefined` ? require('ipfs') : null
// const IPFS = require('ipfs')
// import IPFS from 'ipfs'
// let ipfs;

// const Generic = (props) => (
let _this;
class IPFSPage extends React.Component {
  constructor(props) {
    super(props);

    _this = this;

    this.state = {
      output: "",
      showTerminal: true
    };

    const ipfsConfig = {
      handleLog: _this.handleLog
    };
    this.appIpfs = new AppIpfs(ipfsConfig);
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
    const { output, showTerminal } = _this.state;
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
              <span className="image main">
                {showTerminal && (
                  <textarea
                    id="ipfsTerminal"
                    name="ipfsTerminal"
                    rows="10"
                    cols="50"
                    readOnly
                    value={`${output ? `${output}>` : ">"}`}
                  />
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
}

export default IPFSPage;
