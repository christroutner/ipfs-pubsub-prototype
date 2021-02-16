/*
  Handles commands from command terminal.
*/

class CommandRouter {
  // Parse and route a command to the proper handler.
  async route(command, appIpfs) {
    try {
      // console.log(`command: ${command}`)

      // Split the command into an array of words separated by a space
      const words = command.toString().split(" ");
      // console.log(`words: ${JSON.stringify(words, null, 2)}`)

      switch (words[0]) {
        case "help":
          return this.help();
        case "list":
          return await this.list(command, appIpfs);
        default:
          return "";
      }
    } catch (err) {
      console.error("Error in commandRouter()");
      throw err;
    }
  }

  // Display the help
  help() {
    const msg = `
Available commands:
 - help - this help.
 - list peers - list all connected IPFS peers.
 - list relays - list all known circuit relays and their state.
`;

    return msg;
  }

  async list(command, appIpfs) {
    const words = command.toString().split(" ");

    switch (words[1]) {
      case "relays":
        return await this.listRelays(appIpfs);
      default:
        return "";
    }
  }

  // List the relays connected to this IPFS node.
  async listRelays(appIpfs) {
    try {
      // console.log('appIpfs: ', appIpfs)

      const relays = `Known Circuit Relays:\n${JSON.stringify(
        appIpfs.ipfsCoord.ipfs.cr.state.relays,
        null,
        2
      )}`;
      return relays;

      // return "test"
    } catch (err) {
      console.error("Error in listRelays(): ", err);
      return "Error in listRelays()";
    }
  }
}

export default CommandRouter;
