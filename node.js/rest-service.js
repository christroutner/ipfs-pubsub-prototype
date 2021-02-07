/*
  A node.js IPFS node. This could represent a REST API server.
*/

// Relay nodes.
// const CHAT_ADDR =
//   "/ip4/138.68.212.34/tcp/4002/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa";
// const BOOTSTRAP_ADDR =
//   "/ip4/116.203.193.74/tcp/4001/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL";

// Pubsub room.
const CHAT_ROOM_NAME = 'psf-ipfs-chat-001';

// Global npm libraries
const IPFS = require("ipfs");
// const IpfsCoord = require("ipfs-coord")
const IpfsCoord = require('../../ipfs-coord/index')

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
    ipfsCoord = new IpfsCoord({ipfs, type: 'node.js'})
    await ipfsCoord.isReady()
    console.log('IPFS coordination is ready.')


    // subscribe to the 'chat' chatroom.
    await ipfsCoord.ipfs.pubsub.subscribeToPubsubChannel(CHAT_ROOM_NAME, handleChat)

    // Send a chat message to the chat room.
    setInterval(async function() {
      const now = new Date()
      const msg = `Message from node.js at ${now.toLocaleString()}`
      const handle = 'test node'
      const chatObj = {
        message: msg,
        handle: handle
      }

      // Add the chat data to the schema.
      const chatData = ipfsCoord.ipfs.schema.chat(chatObj)

      // Convert the chat JSON object into a string.
      const chatDataStr = JSON.stringify(chatData)

      // Publish the stringified chat object to the pubsub channel.
      await ipfsCoord.ipfs.pubsub.publishToPubsubChannel(CHAT_ROOM_NAME, chatDataStr)
    }, 10000)

    // Get the IPFS ID for this node.
    // ipfsId = await ipfs.config.get("Identity");
    // ipfsId = ipfsId.PeerID;
    // console.log(`This nodes peer ID: ${ipfsId}`);

    // Get the local addresses this node is listening to.
    // const localAddrs = await ipfs.swarm.localAddrs();
    // console.log(
    //   `listening on these addresses: ${JSON.stringify(localAddrs, null, 2)}\n`
    // );

    // Connect to the first bootstrap server
    // try {
    //   console.log(`Attemping connection to Relay node: ${CHAT_ADDR}`);
    //   await ipfs.swarm.connect(CHAT_ADDR);
    //   console.log("2. Connected to first relay server.\n");
    // } catch (err) {
    //   console.log("2. Could not connect to first relay server.\n");
    // }

    // Connect to the second bootstrap server
    // try {
    //   console.log(`Attemping connection to Relay node: ${BOOTSTRAP_ADDR}`);
    //   await ipfs.swarm.connect(BOOTSTRAP_ADDR);
    //   console.log("3. Connected to second relay server.\n");
    // } catch (err) {
    //   console.log("3. Could not connect to second bootstrap server.\n");
    // }

    // Subscribe to the pubsub room.
    // await ipfs.pubsub.subscribe(ROOM_NAME, msg => {
    //   // print out any messages recieved.
    //   console.log(msg.data.toString());
    // });
    // console.log(`4. Subscribed to pubsub room ${ROOM_NAME}`);

    // Periodically publish connection information to the pubsub channel.
    // setInterval(async function() {
    //   const now = new Date();
    //
    //   // Date-stamped connection information.
    //   const connectionInfo = {
    //     date: now.toLocaleString(),
    //     ipfsId: ipfsId,
    //     message: `Message from node.js app @ ${now.toLocaleString()}`
    //   };
    //
    //   const msgBuf = Buffer.from(JSON.stringify(connectionInfo));
    //
    //   // Publish the message to the pubsub channel.
    //   await ipfs.pubsub.publish(ROOM_NAME, msgBuf);
    //
    //   console.log(`5. Published message to ${ROOM_NAME}\n`);
    // }, 10000);

    // Periodically refresh the connection to the Relay servers.
    // setInterval(async function() {
    //   await ipfs.swarm.connect(CHAT_ADDR);
    //   await ipfs.swarm.connect(BOOTSTRAP_ADDR);
    //
    //   // const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/p2p/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
    //   // const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/ipfs/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
    //   // await ipfs.swarm.connect(connectStr)
    //
    //   console.log("Reconnected to Relay servers\n");
    // }, 30000);
  } catch (err) {
    console.error("Error: ", err);
  }
}
startClientNode();

function handleChat(msgData) {
  // console.log('msgData: ', msgData)

  let from = msgData.from
  if(msgData.data.data.handle)
    from = msgData.data.data.handle

  console.log(`Peer ${from} says: ${msgData.data.data.message}`)
}

// Promise based sleep function:
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
