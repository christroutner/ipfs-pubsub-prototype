import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

import pic11 from '../assets/images/pic11.jpg'

import IPFS from 'ipfs'
let ipfs

// Run the node.js app first and get it's IPFS ID.
const NODE_ID = 'QmULpfVPUPnmPctT1Uz2P5fsFBKBnTgZcXtHNf2YdV6cnA'

// Relay servers.
const CHAT_ADDR = `/dns4/wss.psfoundation.cash/tcp/443/wss/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa`
const BOOTSTRAP_ADDR = `/dns4/wss.fullstack.cash/tcp/443/wss/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL`

// Pubsub room
const ROOM_NAME = 'customPubsubRoom123'

// const Generic = (props) => (
class IPFSPage extends React.Component {

  async componentDidMount() {
    let ipfsId = ''

    console.log('Creating instance of IPFS...')

    ipfs = await IPFS.create({
      relay: {
        enabled: true, // enable relay dialer/listener (STOP)
        hop: {
          enabled: true, // make this node a relay (HOP)
        },
      },
      pubsub: true,
    })
    console.log('1. IPFS node created.')

    // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
    // issues in the browser console.
    if (typeof window !== 'undefined') window.ipfs = ipfs

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

    // Periodically reconnect to the Relay servers.
    setInterval(async function() {
      await ipfs.swarm.connect(CHAT_ADDR)
      await ipfs.swarm.connect(BOOTSTRAP_ADDR)

      console.log('Reconnected to Relay nodes.')
    }, 30000)

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
        message: `Message from browser app @ ${now.toLocaleString()}`
      };

      const msgBuf = Buffer.from(JSON.stringify(connectionInfo));

      // Publish the message to the pubsub channel.
      await ipfs.pubsub.publish(ROOM_NAME, msgBuf);

      console.log(`Published message to ${ROOM_NAME}\n`);
    }, 10000);

    // Try to connect to the node.js node.
    setInterval(async function() {
      try {
        await ipfs.swarm.connect(`${BOOTSTRAP_ADDR}/p2p-circuit/p2p/${NODE_ID}`);
        console.log('Connected to node.js IPFS node')
      } catch(err) {
        console.log('Error trying to connect to node.js peer via circuit-relay')
      }
    }, 30000)
  }

  render() {
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
                <img src={pic11} alt="" />
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
    )
  }
}

export default IPFSPage
