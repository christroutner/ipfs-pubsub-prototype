/*
  This library contains the logic around the browser-based IPFS full node.
*/

import IPFS from "ipfs";
import IpfsCoord from "ipfs-coord";

// CHANGE THESE VARIABLES
const CHAT_ROOM_NAME = "psf-ipfs-chat-001";

let _this;

class AppIpfs {
  constructor(ipfsConfig) {
    this.handleLog = ipfsConfig.handleLog;
    this.handleChatLog = ipfsConfig.handleChatLog;

    _this = this;
  }

  // Top level function for controlling the IPFS node. This funciton is called
  // by the componentDidMount() function of the page.
  async startIpfs() {
    try {
      console.log("Setting up instance of IPFS...");
      this.handleLog("Setting up instance  of IPFS...");

      this.ipfs = await IPFS.create();
      this.handleLog("IPFS node created.");

      // Instantiate the IPFS Coordination library.
      this.ipfsCoord = new IpfsCoord({
        ipfs: this.ipfs,
        type: "browser",
        logHandler: this.handleLog
      });
      this.handleLog("ipfs-coord library instantiated.");

      // Wait for the coordination stuff to be setup.
      await this.ipfsCoord.isReady();

      // subscribe to the 'chat' chatroom.
      await this.ipfsCoord.ipfs.pubsub.subscribeToPubsubChannel(
        CHAT_ROOM_NAME,
        this.handleChatLog
      );

      // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
      // issues in the browser console.
      if (typeof window !== "undefined") window.ipfs = this.ipfs;

      // Get this nodes IPFS ID
      const id = await this.ipfs.id();
      this.ipfsId = id.id;
      this.handleLog(`This IPFS node ID: ${this.ipfsId}`);

      console.log("IPFS node setup complete.");
      this.handleLog("IPFS node setup complete.");
      _this.handleLog(" ");

    } catch (err) {
      console.error("Error in startIpfs(): ", err);
      this.handleLog("Error trying to initialize IPFS node!");
    }
  }

  // This funciton handles incoming chat messages.
  handleChatMsg(msg) {
    try {
      console.log("msg: ", msg);
    } catch (err) {
      console.error("Error in handleChatMsg(): ", err);
    }
  }

}

// module.exports = AppIpfs
export default AppIpfs;
