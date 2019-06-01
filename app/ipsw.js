const fs = require('fs')
const path = require('path')
const getPath = (...files) => path.resolve(__dirname, '../assets/s0meiyoshino/', ...files)
const checkExist = (...files) => fs.existsSync(path.resolve(__dirname, '../assets/s0meiyoshino/', ...files))
const url = require('url')
const axios = require('axios')

module.exports = {
  getIPSW: async (IPSWurl, sender) => {
    const pathFromURL = path.parse(url.parse(IPSWurl).pathname).base
    if (!(checkExist(pathFromURL))) {
      axios({
        method: 'get',
        url: IPSWurl,
        responseType: 'stream'
      }).then(res => {
        const lengthFile = parseInt(res.headers['content-length'])
        let totalChunk = 0
        const IPSWstream = fs.createWriteStream(getPath(pathFromURL))
        sender.reply('ipsw-download-start')
        res.data.on('data', (chunk) => {
          totalChunk += chunk.length
          const percentage = totalChunk / lengthFile
          sender.reply('ipsw-download-current', percentage.toFixed(4))
        })
        IPSWstream.on('finish', () => {
          sender.reply('ipsw-download-done')
        })
        res.data.pipe(IPSWstream)
      })
    } else {
      sender.reply('ipsw-download-done')
    }
  }
}
