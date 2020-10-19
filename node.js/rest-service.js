/*
  A 'client' node
*/

// Change these constants to fit your environment.
const MASTER_MULTIADDR = '/ip4/127.0.0.1/tcp/5004/p2p/'
const MASTER_IPFS_ID = 'Qma7XadmQ2LwVi6jkFtZJEBxDaNQwbyjj1TBQiUGxjeKrR'

const CHAT_ADDR =
  '/ip4/138.68.212.34/tcp/4002/ipfs/QmaUW4oCVPUFLRqeSjvhHwGFJHGWrYWLBEt7WxnexDm3Xa'
const BOOTSTRAP_ADDR =
  '/ip4/116.203.193.74/tcp/4001/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL'

const ROOM_NAME = 'trout'
const MNEMONIC =
  'creek caution crouch bid route gold prepare need above movie broom denial'

// Global npm libraries
// const Room = require('ipfs-pubsub-room')
const IPFS = require('ipfs')

// Local libraries
const Signing = require('../../lib/signing')
const Messages = require('../../lib/messages')
const MsgFilter = require('../../lib/msg-filter')
const Peer = require('../../lib/peer')

let msgLib
const msgFilter = new MsgFilter()
let ipfsId // Used to track the IPFS ID of this node.
let peers = [] // Used to hold instances of the Peer class.
let ipfs // instance of IPFS for this node.

// Ipfs Options
const ipfsOptions = {
  repo: './chatdata',
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/5104',
        '/ip4/190.198.70.169/tcp/5105/ws',
        // Chat bootstrap server:
        CHAT_ADDR,
        BOOTSTRAP_ADDR,

        // Local destop node:
        '/ip4/127.0.0.1/tcp/4001/p2p/QmSgDzV1GeTg1tx4wU5WKjxMvT692xvt8FS14JdoDEgFjj'
      ],
      API: '/ip4/127.0.0.1/tcp/5106',
      Gateway: '/ip4/127.0.0.1/tcp/5107',
      Delegates: []
    }
  },
  relay: {
    enabled: true, // enable circuit relay dialer and listener
    hop: {
      enabled: true // enable circuit relay HOP (make this node a relay)
    }
  },
  pubsub: true
}

async function startClientNode () {
  try {
    // Starting ipfs node
    console.log('Starting...')
    ipfs = await IPFS.create(ipfsOptions)
    console.log('... IPFS is ready.\n')

    // Connect to the master node.
    await ipfs.swarm.connect(CHAT_ADDR)
    await ipfs.swarm.connect(BOOTSTRAP_ADDR)
    console.log('Connected to bootstrap servers\n')

    // console.log('ipfs: ', ipfs)

    // Create a BCH wallet
    // console.log('BCH and SLP addresses:')
    // const wallet = new Signing(MNEMONIC)
    // await wallet.isReady // Wait for wallet to initialize.
    // console.log(' ')

    // Get the IPFS ID for this node.
    ipfsId = await ipfs.config.get('Identity')
    ipfsId = ipfsId.PeerID

    // Get the local addresses this node is listening to.
    const localAddrs = await ipfs.swarm.localAddrs()
    console.log(`localAddrs: ${JSON.stringify(localAddrs, null, 2)}`)

    await ipfs.pubsub.subscribe(ROOM_NAME, msg => {
      console.log(msg.data.toString())
    })
    console.log(`Subscribed to pubsub room ${ROOM_NAME}`)

    setInterval(async function () {
      const now = new Date()

      const msgStr = `Message from node.js app @ ${now.toLocaleString()}`
      const msgBuf = Buffer.from(msgStr)

      await ipfs.pubsub.publish(ROOM_NAME, msgBuf)

      console.log(`Published message to ${ROOM_NAME}`)
    }, 10000)

    setInterval(async function () {
      await ipfs.swarm.connect(CHAT_ADDR)
      await ipfs.swarm.connect(BOOTSTRAP_ADDR)

      // const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/p2p/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
      const connectStr = `${BOOTSTRAP_ADDR}/p2p-circuit/ipfs/QmUqWUQrPHJtu9YKGuuvgJEuAjb4RcZo5ysymppRsxGzu1`
      await ipfs.swarm.connect(connectStr)

      console.log('Reconnected to bootstrap servers\n')
    }, 30000)
  } catch (err) {
    console.error('Error: ', err)
  }
}
startClientNode()

// A router for handling pubsub events.
function eventRouter (room) {
  room.on('peer joined', async peer => {
    console.log('Peer joined the room:', peer)

    await sleep(2000)

    if (peer !== ipfsId) {
      // Connect directly to the new peer.
      await ipfs.swarm.connect(`${MASTER_MULTIADDR}/${peer}`)

      // room.sendTo() NOT WORKING
      // Send connection information to new peers as the enter the room.
      // await room.sendTo(peer, msgLib.announce())
    }
  })

  room.on('peer left', peer => {
    console.log('Peer left...', peer)

    // Filter out the peer that just left from the list of peers.
    const newPeers = peers.filter(x => x.ipfsId !== peer)
    peers = newPeers
  })

  // now started to listen to room
  room.on('subscribed', () => {
    console.log('Now connected!')
  })

  // Event triggers on new messages.
  room.on('message', async message => {
    // console.log(`${message.from}: ${message.data}`)
    const data = msgFilter.parse(message)

    // If the data is noise and can not be parsed, ignore it.
    if (!data) return

    // If the message was not sourced from this node.
    // Ensures this node ignores its own messages.
    if (data.ipfsId !== ipfsId) {
      console.log(`message data: ${JSON.stringify(data, null, 2)}`)

      // If the message is a new peer joining the network, create a new peer
      // instance.
      if (data.msgData.msgType === 'announce') {
        const id = data.ipfsId

        // Create a new Peer object.
        const newPeer = new Peer(data.msgData)

        const existingPeer = peers.filter(x => x.ipfsId === id)
        if (existingPeer.length === 0) {
          // Add the peer to the array for tracking peers.
          peers.push(newPeer)
          console.log(`Peer ${id} added to peers array.`)
          console.log(`peers array: ${JSON.stringify(peers, null, 2)}`)
        }
      }
    }
  })
}

// Promise based sleep function:
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
