const fs = require('fs')
const path = require('path')
const getPath = (...files) => path.resolve(__dirname, '../assets/s0meiyoshino/', ...files)
const checkExist = (...files) => fs.existsSync(path.resolve(__dirname, '../assets/s0meiyoshino/', ...files))
const getPatchedName = (name) => path.parse(name).name.replace('Restore', 'Custom') + '.ipsw'
const url = require('url')
const axios = require('axios')
const errorType = require('../src/errorType')
const EventEmitter = require('events')
const iPhone5base = {
  '7.0': {
    BaseFWVer: '7.0',
    BaseFWBuild: '11A465'
  },
  '7.0.2': {
    BaseFWVer: '7.0.2',
    BaseFWBuild: '11A501'
  },
  '7.0.3': {
    BaseFWVer: '7.0.3',
    BaseFWBuild: '11B511'
  },
  '7.0.4': {
    BaseFWVer: '7.0.4',
    BaseFWBuild: '11B554a'
  },
  '7.0.6': {
    BaseFWVer: '7.0.6',
    BaseFWBuild: '11B651'
  }
}

module.exports = {
  getIPSW: async (targetIPSWurl, baseIPSWurl, sender) => {
    const pathFromTargetURL = path.parse(url.parse(targetIPSWurl).pathname).base
    const pathFromBaseURL = path.parse(url.parse(baseIPSWurl).pathname).base
    const targetPathDontExist = !(checkExist(pathFromTargetURL)) && !(checkExist(getPatchedName(pathFromTargetURL)))
    let basePathDontExist = !(checkExist(pathFromBaseURL)) && !(checkExist(getPatchedName(pathFromBaseURL)))
    if (targetIPSWurl === baseIPSWurl) {
      basePathDontExist = false
    }
    const works = targetPathDontExist && basePathDontExist
    ? 2 : (targetPathDontExist || basePathDontExist
    ? 1 : 0)
    let firstDone = false
    const checkStatus = new EventEmitter()
    const onDone = () => {
      if (targetPathDontExist && basePathDontExist) {
        if (firstDone) {
          sender.reply('ipsw-download-done')
          checkStatus.off('done', onDone)
        } else {
          firstDone = true
        }
      } else {
        sender.reply('ipsw-download-done')
      }
    }
    checkStatus.on('done', onDone)
    if (works !== 0) {
      let totalChunk = 0
      let lengthFile = 0
      if (targetPathDontExist) {
        axios({
          method: 'get',
          url: targetIPSWurl,
          responseType: 'stream'
        }).then(res => {
          lengthFile += parseInt(res.headers['content-length'])
          const IPSWstream = fs.createWriteStream(getPath(pathFromTargetURL))
          sender.reply('ipsw-download-start')
          res.data.on('data', (chunk) => {
            totalChunk += chunk.length
            const percentage = (totalChunk / lengthFile) / works
            sender.reply('ipsw-download-current', percentage.toFixed(4))
          })
          IPSWstream.on('finish', () => {
            checkStatus.emit('done')
          })
          res.data.pipe(IPSWstream)
        })
      }
      if (basePathDontExist) {
        axios({
          method: 'get',
          url: baseIPSWurl,
          responseType: 'stream'
        }).then(res => {
          lengthFile += parseInt(res.headers['content-length'])
          const IPSWstream = fs.createWriteStream(getPath(pathFromBaseURL))
          if (!targetPathDontExist) {
            sender.reply('ipsw-download-start')
          }
          res.data.on('data', (chunk) => {
            totalChunk += chunk.length
            const percentage = (totalChunk / lengthFile) / works
            sender.reply('ipsw-download-current', percentage.toFixed(4))
          })
          IPSWstream.on('finish', () => {
            checkStatus.emit('done')
          })
          res.data.pipe(IPSWstream)
        })
      }
    } else {
      sender.reply('ipsw-download-done')
    }
  },
  patchIPSW: (sender, arg) => {
    const pathFromURL = path.parse(url.parse(arg.IPSWurl).pathname).base
    if (!(checkExist(getPatchedName(pathFromURL)))) {
      let Identifier
      let InternalName
      let iBootInternalName
      let SoC
      let Image
      let BaseFWVer
      let BaseFWBuild
      let Size
      let Chip
      if (arg.product === 'iPhone3,1') {
        Identifier='iPhone3,1'
        InternalName='n90ap'
        iBootInternalName='n90ap'
        SoC='s5l8930x'
        Image='2x~iphone-30pin'
        BaseFWVer='7.1.2'
        BaseFWBuild='11D257'
        Size='2x'
        Chip='A4'
      }
      if (arg.product === 'iPhone5,2') {
        Identifier='iPhone5,2'
        InternalName='n42ap'
        iBootInternalName='n42ap'
        SoC='s5l8950x'
        Image='1136~iphone-lightning'
        Size='1136'
        Chip='A6'
        if (Object.keys(iPhone5base).includes(arg.base)) {
          BaseFWVer = iPhone5base[arg.base].BaseFWVer
          BaseFWBuild = iPhone5base[arg.base].BaseFWBuild
        } else {
          sender.reply('ipsw-patch-error', {
            error: errorType.IPSW_PATCH_BASE_VERSION
          })
        }
      }
      if (arg.product === 'iPhone5,1') {
        Identifier='iPhone5,1'
        InternalName='n41ap'
        iBootInternalName='n41ap'
        SoC='s5l8950x'
        Image='1136~iphone-lightning'
        Size='1136'
        Chip='A6'
        if (Object.keys(iPhone5base).includes(arg.base)) {
          BaseFWVer = iPhone5base[arg.base].BaseFWVer
          BaseFWBuild = iPhone5base[arg.base].BaseFWBuild
        } else {
          sender.reply('ipsw-patch-error', {
            error: errorType.IPSW_PATCH_BASE_VERSION
          })
        }
      }
      if (!checkExist(`${Identifier}_${BaseFWVer}_${BaseFWBuild}_Restore.ipsw`)) {
        sender.reply('ipsw-patch-error', {
          error: errorType.IPSW_PATCH_BASE_NOT_FOUND
        })
      }
    }
  }
}
