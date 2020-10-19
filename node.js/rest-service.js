/*
  A node.js IPFS node. This could represent a REST API server.
*/

// Relay nodes.
const CHAT_ADDR =
  "/ip4/138.68.212.34/tcp/4002/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa";
const BOOTSTRAP_ADDR =
  "/ip4/116.203.193.74/tcp/4001/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL";

// Pubsub room.
const ROOM_NAME = "customPubsubRoom123";

// Global npm libraries
const IPFS = require("ipfs");

let ipfsId; // Used to track the IPFS ID of this node.
let ipfs; // instance of IPFS for this node.

// Ipfs Options
const ipfsOptions = {
  repo: "./chatdata",
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    relay: {
      enabled: true, // enable circuit relay dialer and listener
      hop: {
        enabled: true // enable circuit relay HOP (make this node a relay)
      }
    },
    pubsub: true // enable pubsub
  }
};

async function startClientNode() {
  try {
    // Starting ipfs node
    console.log("Starting...");
    ipfs = await IPFS.create(ipfsOptions);
    console.log("... IPFS is ready.\n");
    console.log("1. IPFS node created.");

    // Get the IPFS ID for this node.
    ipfsId = await ipfs.config.get("Identity");
    ipfsId = ipfsId.PeerID;
    console.log(`This nodes peer ID: ${ipfsId}`);

    // Get the local addresses this node is listening to.
    const localAddrs = await ipfs.swarm.localAddrs();
    console.log(
      `listening on these addresses: ${JSON.stringify(localAddrs, null, 2)}\n`
    );

    // Connect to the first bootstrap server
    try {
      console.log(`Attemping connection to Relay node: ${CHAT_ADDR}`);
      await ipfs.swarm.connect(CHAT_ADDR);
      console.log("2. Connected to first relay server.\n");
    } catch (err) {
      console.log("2. Could not connect to first relay server.\n");
    }

    // Connect to the second bootstrap server
    try {
      console.log(`Attemping connection to Relay node: ${BOOTSTRAP_ADDR}`);
      await ipfs.swarm.connect(BOOTSTRAP_ADDR);
      console.log("3. Connected to second relay server.\n");
    } catch (err) {
      console.log("3. Could not connect to second bootstrap server.\n");
    }

    // Subscribe to the pubsub room.
    await ipfs.pubsub.subscribe(ROOM_NAME, msg => {
      // print out any messages recieved.
      console.log(msg.data.toString());
    });
    console.log(`4. Subscribed to pubsub room ${ROOM_NAME}`);

    // Periodically publish connection information to the pubsub channel.
    setInterval(async function() {
      const now = new Date();

      // Date-stamped connection information.
      const connectionInfo = {
        date: now.toLocaleString(),
        ipfsId: ipfsId,
        message: `Message from node.js app @ ${now.toLocaleString()}`
      };

      const msgBuf = Buffer.from(JSON.stringify(connectionInfo));

      // Publish the message to the pubsub channel.
      await ipfs.pubsub.publish(ROOM_NAME, msgBuf);

      console.log(`5. Published message to ${ROOM_NAME}\n`);
    }, 10000);

    // Periodically refresh the connection to the Relay servers.
    setInterval(async function() {
      await ipfs.swarm.connect(CHAT_ADDR);
      await ipfs.swarm.connect(BOOTSTRAP_ADDR);

      // const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/p2p/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
      // const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/ipfs/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
      // await ipfs.swarm.connect(connectStr)

      console.log("Reconnected to Relay servers\n");
    }, 30000);
  } catch (err) {
    console.error("Error: ", err);
  }
}
startClientNode();

// Promise based sleep function:
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
