/*
  A node.js IPFS node. This could represent a REST API server.
*/

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

// Relay nodes.
// const CHAT_ADDR =
//   "/ip4/138.68.212.34/tcp/4002/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa";
// const BOOTSTRAP_ADDR =
//   "/ip4/116.203.193.74/tcp/4001/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL";

// Pubsub room.
const CHAT_ROOM_NAME = "psf-ipfs-chat-001";

// Global npm libraries
const IPFS = require("ipfs");
const IpfsCoord = require("ipfs-coord")
// const IpfsCoord = require("../../ipfs-coord/index");

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

    // Instantiate the IPFS Coordination library.
    ipfsCoord = new IpfsCoord({ ipfs, bchjs, type: "node.js", isCircuitRelay: true });
    await ipfsCoord.isReady();
    console.log("IPFS coordination is ready.");

    // subscribe to the 'chat' chatroom.
    await ipfsCoord.ipfs.pubsub.subscribeToPubsubChannel(
      CHAT_ROOM_NAME,
      handleChat
    );

    // Send a chat message to the chat room.
    setInterval(async function() {
      const now = new Date();
      const msg = `Message from chat bot at ${now.toLocaleString()}`;
      const handle = "chat bot";
      const chatObj = {
        message: msg,
        handle: handle
      };

      // Add the chat data to the schema.
      const chatData = ipfsCoord.ipfs.schema.chat(chatObj);

      // Convert the chat JSON object into a string.
      const chatDataStr = JSON.stringify(chatData);

      // Publish the stringified chat object to the pubsub channel.
      await ipfsCoord.ipfs.pubsub.publishToPubsubChannel(
        CHAT_ROOM_NAME,
        chatDataStr
      );
    }, 60000 * 5); // five minutes
  } catch (err) {
    console.error("Error: ", err);
  }
}
startClientNode();

function handleChat(msgData) {
  // console.log('msgData: ', msgData)

  let from = msgData.from;
  if (msgData.data.data.handle) from = msgData.data.data.handle;

  console.log(`Peer ${from} says: ${msgData.data.data.message}`);
}

// Promise based sleep function:
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
