import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

import pic11 from '../assets/images/pic11.jpg'

import IPFS from 'ipfs'
// const Room = require('ipfs-pubsub-room')

let ipfs
const CHAT_ADDR = `/dns4/wss.psfoundation.cash/tcp/443/wss/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa`
const BOOTSTRAP_ADDR = `/dns4/wss.fullstack.cash/tcp/443/wss/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL`
// const LOCAL_COORDINATOR = `/dns4/wss.psfoundation.cash/tcp/443/wss/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa/p2p-circuit/p2p/Qma7XadmQ2LwVi6jkFtZJEBxDaNQwbyjj1TBQiUGxjeKrR`

const ROOM_NAME = 'trout'
// let room

// const Generic = (props) => (
class IPFSPage extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  async initIpfs() {
    ipfs = await ipfs
    await ipfs.swarm.connect(CHAT_ADDR)
    await ipfs.swarm.connect(BOOTSTRAP_ADDR)
  }

  async componentDidMount() {
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

    // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
    // issues in the browser console.
    if (typeof window !== 'undefined') window.ipfs = ipfs

    await this.initIpfs()

    console.log('...IPFS node created.')

    setInterval(async function() {
      await ipfs.swarm.connect(CHAT_ADDR)
      await ipfs.swarm.connect(BOOTSTRAP_ADDR)

      // try {
      //   await ipfs.swarm.connect(LOCAL_COORDINATOR)
      // } catch (err) {
      //   console.error('Could not dial circuit-relay node.')
      // }

      console.log('Connected to bootstrap nodes.')
    }, 20000)

    await this.connectToPubSub()

    console.log('Pubsub room has been setup.')
  }

  async connectToPubSub() {
    try {
      // // Join the pubsub room.
      // room = new Room(ipfs, ROOM_NAME)
      //
      // if (typeof window !== 'undefined') window.room = room
      //
      // room.on('peer joined', async peer => {
      //   console.log('Peer joined the room:', peer)
      //
      //   // await sleep(2000)
      //   //
      //   // if (peer !== ipfsId) {
      //   //   // Connect directly to the new peer.
      //   //   await ipfs.swarm.connect(`${MASTER_MULTIADDR}/${peer}`)
      //   //
      //   //   // room.sendTo() NOT WORKING
      //   //   // Send connection information to new peers as the enter the room.
      //   //   // await room.sendTo(peer, msgLib.announce())
      //   // }
      // })
      //
      // room.on('peer left', peer => {
      //   console.log('Peer left...', peer)
      //
      //   // Filter out the peer that just left from the list of peers.
      //   // const newPeers = peers.filter(x => x.ipfsId !== peer)
      //   // peers = newPeers
      // })
      //
      // // now started to listen to room
      // room.on('subscribed', () => {
      //   console.log('Now connected!')
      // })
      //
      // // Event triggers on new messages.
      // room.on('message', async message => {
      //   console.log(`New message: ${JSON.stringify(message, null, 2)}`)
      // })

      await ipfs.pubsub.subscribe(ROOM_NAME, msg => {
        console.log(msg.data.toString())
      })
      console.log(`Subscribed to pubsub room ${ROOM_NAME}`)

      setInterval(async function() {
        const now = new Date()

        const msgStr = `Message from browser app @ ${now.toLocaleString()}`
        const msgBuf = Buffer.from(msgStr)

        // const tmp = msgBuf.toString()
        // console.log(`tmp: ${tmp}`)

        await ipfs.pubsub.publish(ROOM_NAME, msgBuf)

        console.log(`Published message to ${ROOM_NAME}`)
      }, 10000)
    } catch (err) {
      console.error(`Error in connectToPubSub()`)
      throw err
    }
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
