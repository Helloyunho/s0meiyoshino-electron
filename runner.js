const net = require('net')
const port = 5000

process.env.DEVELOPING_SERVER = true

const client = new net.Socket()

let startedElectron = false
const tryConnection = () => client.connect({ port }, () => {
  client.end()
  if (!startedElectron) {
    console.log('starting electron')
    startedElectron = true
    const exec = require('child_process').exec
    exec('yarn run electron')
  }
})

tryConnection()

client.on('error', (error) => {
  if (error) {
    console.log('React server is not turned on. Trying again...')
  }
  setTimeout(tryConnection, 1000)
})