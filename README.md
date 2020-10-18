# ipfs-pubsub-prototype

This is a demonstration prototype I created for myself ([Chris Troutner](https://github.com/christroutner)) to record the lessons I spent over a day, teaching myself how to connect a web browser to a node.js service via an IPFS circuit-relay node and communicating via pubsub channel. This prototype is a building block for a future project for building an uncensorable REST API accessible from a browser.

There are two directories:
- [browser](browser/) is a Gatsby site forked from [gatsby-ipfs-template](https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-template). This is a browser-based web app that runs an IPFS node inside the browser. Also, running `npm run build` will compile the site for delivery over an IPFS Gateway. More details can be found at [UncensorablePublishing.com](https://uncensorablepublishing.com).<br /><br />
- [node.js](node.js/) is a node.js application that is also running an IPFS node. This is a placeholder app that *could be* a REST API like this [koa-api-boilerplate](https://github.com/christroutner/koa-api-boilerplate). If the REST API was delivered over IPFS, instead of conventional HTTP, it would be much harder to censor.<br /><br />
- There is a third IPFS circuit-relay node that is depended upon by the above two pieces of software. Here are the different multiaddrs to connect to this node:
  - From the web browser:<br /> `/dns4/wss.fullstack.cash/tcp/443/wss/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL`
  - From the node.js app:<br /> `/ip4/116.203.193.74/tcp/4001/ipfs/QmNZktxkfScScnHCFSGKELH3YRqdxHQ3Le9rAoRLhZ6vgL`

Because IPFS is still in 'alpha' release, and has been changing for the last few years, there is a lot of stale information on the internet. [This example page](https://github.com/ipfs/js-ipfs/tree/master/examples/circuit-relaying) on circuit relaying was the most accurate information I could find.

## Installation
Enter each directory and run `npm install` to install dependencies. Both apps can be started with `npm start`.

## License
[MIT](./LICENSE.md)
