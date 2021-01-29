/*
  This library contains the logic around the browser-based IPFS full node.
*/

import IPFS from "ipfs";

// CHANGE THESE VARIABLES
// Run the node.js app first and get it's IPFS ID.
const NODE_ID = "QmQ8bn8FL9RYaTdWTBSGSx3VzhhRunno11nfcnFdbcnKH5";
// Pubsub channel that nodes will use to coordinate.
const ROOM_NAME = "customPubsubRoom123";

// Known IPFS nodes to connect to for bootstrapping.
const BOOTSTRAP_NODES = [
  {
    name: "wss.fullstack.cash",
    multiaddr: `/dns4/wss.fullstack.cash/tcp/443/wss/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL`,
    hasConnected: false
  }
];

let _this;

class AppIpfs {
  constructor(ipfsConfig) {
    this.handleLog = ipfsConfig.handleLog;

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

      // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
      // issues in the browser console.
      if (typeof window !== "undefined") window.ipfs = this.ipfs;

      await this.initIpfs();

      // Get this nodes IPFS ID
      const id = await this.ipfs.id();
      this.ipfsId = id.id;
      this.handleLog(`This IPFS node ID: ${this.ipfsId}`);

      console.log("IPFS node setup complete.");
      this.handleLog("IPFS node setup complete.");
      this.handleLog(" ");

      // Subscribe to the pubsub room.
      await this.ipfs.pubsub.subscribe(ROOM_NAME, msg => {
        // print out any messages recieved.
        console.log(msg.data.toString());
      });
      this.handleLog(`Subscribed to pubsub room ${ROOM_NAME}`);

      // Periodically broadcast identity on the pubsub channel
      setInterval(async function() {
        await _this.broadcastMyInfo();
      }, 45000);

      // Periodically renew connections to other pubsub channel peers
      setInterval(async function() {
        await _this.connectToPeers();
      }, 30000);
    } catch (err) {
      console.error("Error in startIpfs(): ", err);
      this.handleLog("Error trying to initialize IPFS node!");
    }
  }

  // Initialize the IPFS node and try to connect to the PSF bootstrap node.
  async initIpfs() {
    try {
      this.ipfs = await this.ipfs;
      this.handleLog("IPFS node is ready.");

      // Periodically renew connection to the bootstrap nodes.
      const intervalHandle = setInterval(function() {
        _this.connectToBootstrapNodes();
      }, 15000);
      // Also connect to bootstrap nodes immediately.
      await this.connectToBootstrapNodes();

      return intervalHandle;
    } catch (err) {
      console.error("Error in initIpfs()");
      throw err;
    }
  }

  // Attempt to connect to the bootstrap nodes. Cycles through each node in the
  // BOOTSTRAP_NODES array.
  async connectToBootstrapNodes() {
    try {
      const now = new Date();

      for (let i = 0; i < BOOTSTRAP_NODES.length; i++) {
        const name = BOOTSTRAP_NODES[i].name;
        const multiaddr = BOOTSTRAP_NODES[i].multiaddr;

        try {
          await this.ipfs.swarm.connect(multiaddr);
          // this.handleLog('...IPFS node connected PSF node!')
          console.log(
            `${now.toLocaleString()} - Successfully connected to ${name}`
          );
          BOOTSTRAP_NODES[i].hasConnected = true;
        } catch (err) {
          console.log(
            `${now.toLocaleString()} - Failed to connect to ${name} - ${multiaddr}`
          );
          BOOTSTRAP_NODES[i].hasConnected = false;
        }
      }
    } catch (err) {
      console.error("Error in connectToBootstrapNodes()");
      throw err;
    }
  }

  // Broadcast the connection information for this IPFS node.
  async broadcastMyInfo() {
    try {
      const now = new Date();

      // Date-stamped connection information.
      const connectionInfo = {
        date: now.toLocaleString(),
        ipfsId: this.ipfsId,
        message: `Message from browser app @ ${now.toLocaleString()}`
      };

      const msgBuf = Buffer.from(JSON.stringify(connectionInfo));

      // Publish the message to the pubsub channel.
      await this.ipfs.pubsub.publish(ROOM_NAME, msgBuf);

      console.log(`Published message to ${ROOM_NAME}\n`);
    } catch (err) {
      console.error("Error in broadcastMyInfo()");
      throw err;
    }
  }

  // Renew connections to pubsub room peers.
  async connectToPeers() {
    try {
      // TODO: In the future this should use an array of objects to cycle through
      // any new peers that connect to the pubsub channel.

      // Find a circuit relay that has successfully connected.
      const circuitRelay = BOOTSTRAP_NODES.filter(elem => elem.hasConnected)

      await this.ipfs.swarm.connect(
        `${circuitRelay[0].multiaddr}/p2p-circuit/p2p/${NODE_ID}`
      );
      console.log("Connected to node.js IPFS node");
    } catch (err) {
      console.error("Error in connectToPeers()");
      throw err;
    }
  }
}

// module.exports = AppIpfs
export default AppIpfs;