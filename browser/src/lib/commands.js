/*
  Handles commands from command terminal.
*/

class CommandRouter {

  // Parse and route a command to the proper handler.
  route(command) {
    try {
      // console.log(`command: ${command}`)

      // Split the command into an array of words separated by a space
      const words = command.toString().split(' ')
      console.log(`words: ${JSON.stringify(words, null, 2)}`)

      switch(words[0]) {
        case 'help':
          return this.help()
        case 'list':
          return this.list()
        default:
          return ""
      }
    } catch(err) {
      console.error('Error in commandRouter()')
      throw err
    }
  }

  // Display the help
  help() {
    const msg = `
Available commands:
 - help - this help.
 - list peers - list all connected IPFS peers.
 - list relays - list all known circuit relays and their state.
`

    return msg
  }

  list(command) {
    const msg = 'list command was selected'

    return msg
  }
}

export default CommandRouter;
