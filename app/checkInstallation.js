const fs = require('fs')
const path = require('path')
const del = require('del')
const childProcess = require('child_process')
const neededDirectory = [
  'shsh',
  'src/iPhone3,1/11D257',
  'src/iPhone5,2',
  'src/iPhone5,2/11B554a',
  'src/iPhone5,2/BB',
  'src/iPhone5,1',
  'src/iPhone5,1/11B554a',
  'src/iPhone5,1/BB'
]
const getPath = (...files) => path.resolve(__dirname, '../assets/s0meiyoshino/', ...files)
const checkExist = (...files) => fs.existsSync(path.resolve(__dirname, '../assets/s0meiyoshino/', ...files))
const { dialog } = require('electron')
const runFirstLaunchedDialog = (win) => {
  dialog.showMessageBox(win, {
    type: 'info',
    title: 'Info',
    detail: 'This program is preparing for first launch. If it\'s done, It\'ll automaticlly start the program. And also this may take few minute. So please get some rest.',
    buttons: ['OK']
  })
}
const runCommand = (command, win) => {
  try {
    childProcess.execSync(command)
  } catch (e) {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Info',
      detail: 'If you get an installation window, click Install.',
      buttons: ['OK']
    })
    try {
      childProcess.execSync(command)
    } catch (e) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: e.stack,
        buttons: ['OK']
      })
      process.exit()
    }
  }
}

module.exports = win => {
  neededDirectory.forEach(dir => {
    if (!checkExist(dir)) {
      fs.mkdirSync(getPath(dir))
    }
  })

  let first = true
  if (!(checkExist('iloader')
    && checkExist('./src/iPhone3,1/11D257/ramdiskH.dmg')
    && checkExist('./src/iPhone5,2/11B554a/ramdiskH.dmg')
    && checkExist('./src/iPhone5,1/11B554a/ramdiskH.dmg'))
  ) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    if (checkExist('iloader')) {
      del.sync(getPath('iloader'))
    }
    runCommand(`git clone https://github.com/dora2-iOS/iloader.git ${getPath('iloader')}`, win)
    fs.copyFileSync(getPath('iloader/iPhone3,1/11D257/ramdiskH.dmg'), getPath('./src/iPhone3,1/11D257/ramdiskH.dmg'))
    fs.copyFileSync(getPath('iloader/iPhone5,2/11B554a/ramdiskH.dmg'), getPath('./src/iPhone5,2/11B554a/ramdiskH.dmg'))
    fs.copyFileSync(getPath('iloader/iPhone5,2/11B554a/ramdiskH.dmg'), getPath('./src/iPhone5,1/11B554a/ramdiskH.dmg'))
    if (!(checkExist('iloader')
      && checkExist('./src/iPhone3,1/11D257/ramdiskH.dmg')
      && checkExist('./src/iPhone5,2/11B554a/ramdiskH.dmg')
      && checkExist('./src/iPhone5,1/11B554a/ramdiskH.dmg'))
    ) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'iloader didn\'t installed correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }

  if (!(checkExist('ipwndfu'))) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`git clone https://github.com/axi0mX/ipwndfu.git ${getPath('ipwndfu')}`, win)
    if (!(checkExist('ipwndfu'))) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'ipwndfu didn\'t installed correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }

  if (!(checkExist('bin/iBoot32Patcher'))) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`git clone https://github.com/dora2-iOS/iBoot32Patcher ${getPath('iBoot32Patcher')}`, win)
    runCommand(`cd ${getPath('iBoot32Patcher')} && clang iBoot32Patcher.c finders.c functions.c patchers.c -Wno-multichar -I. -o ${getPath('bin/iBoot32Patcher')}`, win)
    del.sync(getPath('iBoot32Patcher'))
    if (!(checkExist('bin/iBoot32Patcher'))) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'iBoot32Patcher didn\'t installed correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }
  
  if (!(checkExist('bin/CBPatcher'))) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`git clone https://github.com/dora2-iOS/CBPatcher.git ${getPath('CBPatcher')}`, win)
    runCommand(`cd ${getPath('CBPatcher')} && make`, win)
    fs.renameSync(getPath('CBPatcher/CBPatcher'), getPath('bin/CBPatcher'))
    del.sync(getPath('CBPatcher'))
    if (!(checkExist('bin/CBPatcher'))) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'CBPatcher didn\'t installed correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }

  if (!(checkExist('bin/partialZipBrowser'))) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`curl -L -o ${getPath('partialZipBrowser.zip')} https://github.com/tihmstar/partialZipBrowser/releases/download/v1.0/partialZipBrowser.zip`, win)
    runCommand(`unzip -d ${getPath('bin/')} ${getPath('partialZipBrowser.zip')}`, win)
    fs.unlinkSync(getPath('partialZipBrowser.zip'))
    if (!(checkExist('bin/partialZipBrowser'))) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'partialZipBrowser didn\'t installed correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }

  if (!(checkExist('src/iPhone5,2/BB/Mav5-8.02.00.Release.bbfw')
  && checkExist('src/iPhone5,2/BB/Mav5-8.02.00.Release.plist'))
  ) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`cd ${getPath('.')} && ${getPath('bin/partialZipBrowser')} -g Firmware/Mav5-8.02.00.Release.bbfw http://appldnld.apple.com/ios8.4.1/031-31065-20150812-7518F132-3C8F-11E5-A96A-A11A3A53DB92/iPhone5,2_8.4.1_12H321_Restore.ipsw`, win)
    runCommand(`cd ${getPath('.')} && ${getPath('bin/partialZipBrowser')} -g Firmware/Mav5-8.02.00.Release.plist http://appldnld.apple.com/ios8.4.1/031-31065-20150812-7518F132-3C8F-11E5-A96A-A11A3A53DB92/iPhone5,2_8.4.1_12H321_Restore.ipsw`, win)
    fs.renameSync(getPath('Mav5-8.02.00.Release.bbfw'), getPath('src/iPhone5,2/BB/Mav5-8.02.00.Release.bbfw'))
    fs.renameSync(getPath('Mav5-8.02.00.Release.plist'), getPath('src/iPhone5,2/BB/Mav5-8.02.00.Release.plist'))
    fs.writeFileSync(getPath('src/iPhone5,2/BB/UniqueBuildID'), (new Buffer('ybHEo3Fv0y/6IYp0X45hxqDY7zM=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/APPSDownloadDigest'), (new Buffer('DJiAwPNNOmT4P9RdlHUt3Q2TTHc=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/APPSHashTableDigest'), (new Buffer('x5Xkaqqkc+l3NFLL6s3kAi5P7Sk=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP1DownloadDigest'), (new Buffer('dFi5J+pSSqOfz31fIvmah2GJO+E=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP1HashTableDigest'), (new Buffer('HXUnmGmwIHbVLxkT1rHLm5V6iDM=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP2DownloadDigest'), (new Buffer('qtTu6JED2pyocdNVYT1uWN2Back=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP2HashTableDigest'), (new Buffer('2rQ7whhh/WrHPUPMwT5lcsIkYDA=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP3DownloadDigest'), (new Buffer('MZ1ERfoeFcbe79pFAl/hbWUSYKc=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/DSP3HashTableDigest'), (new Buffer('sKmLhQcjfaOliydm+iwxucr9DGw=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/RPMDownloadDigest'), (new Buffer('051DfVgeFDI3DC9Hw35HGXCmgkM=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/RestoreSBL1PartialDigest'), (new Buffer('fAAAAEAQAgDAcZDeGqmO8LWlCHcYIPVjFqR87A==', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/SBL1PartialDigest'), (new Buffer('ZAAAAIC9AQACxiFAOjelZm4NtrrLc8bPJIRQNA==', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,2/BB/SBL2DownloadDigest'), (new Buffer('LycXsLwawICZf2dMjev2yhZs+ic=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    if (!(checkExist('src/iPhone5,2/BB/Mav5-8.02.00.Release.bbfw')
    && checkExist('src/iPhone5,2/BB/Mav5-8.02.00.Release.plist'))
    ) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'Fetching iPhone 5 firmware didn\'t worked correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }
  if (!(checkExist('src/iPhone5,1/BB/Mav5-8.02.00.Release.bbfw')
  && checkExist('src/iPhone5,1/BB/Mav5-8.02.00.Release.plist'))
  ) {
    if (first) {
      first = false
      runFirstLaunchedDialog(win)
    }
    runCommand(`cd ${getPath('.')} && ${getPath('bin/partialZipBrowser')} -g Firmware/Mav5-8.02.00.Release.bbfw http://appldnld.apple.com/ios8.4.1/031-31186-20150812-751D243C-3C8F-11E5-8E4F-B51A3A53DB92/iPhone5,1_8.4.1_12H321_Restore.ipsw`, win)
    runCommand(`cd ${getPath('.')} && ${getPath('bin/partialZipBrowser')} -g Firmware/Mav5-8.02.00.Release.plist http://appldnld.apple.com/ios8.4.1/031-31186-20150812-751D243C-3C8F-11E5-8E4F-B51A3A53DB92/iPhone5,1_8.4.1_12H321_Restore.ipsw`, win)
    fs.renameSync(getPath('Mav5-8.02.00.Release.bbfw'), getPath('src/iPhone5,1/BB/Mav5-8.02.00.Release.bbfw'))
    fs.renameSync(getPath('Mav5-8.02.00.Release.plist'), getPath('src/iPhone5,1/BB/Mav5-8.02.00.Release.plist'))
    fs.writeFileSync(getPath('src/iPhone5,1/BB/UniqueBuildID'), (new Buffer('Orhpt1ZWgw21W/jf1AjNMiuMcfs=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/APPSDownloadDigest'), (new Buffer('DJiAwPNNOmT4P9RdlHUt3Q2TTHc=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/APPSHashTableDigest'), (new Buffer('x5Xkaqqkc+l3NFLL6s3kAi5P7Sk=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP1DownloadDigest'), (new Buffer('dFi5J+pSSqOfz31fIvmah2GJO+E=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP1HashTableDigest'), (new Buffer('HXUnmGmwIHbVLxkT1rHLm5V6iDM=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP2DownloadDigest'), (new Buffer('qtTu6JED2pyocdNVYT1uWN2Back=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP2HashTableDigest'), (new Buffer('2rQ7whhh/WrHPUPMwT5lcsIkYDA=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP3DownloadDigest'), (new Buffer('MZ1ERfoeFcbe79pFAl/hbWUSYKc=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/DSP3HashTableDigest'), (new Buffer('sKmLhQcjfaOliydm+iwxucr9DGw=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/RPMDownloadDigest'), (new Buffer('051DfVgeFDI3DC9Hw35HGXCmgkM=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/RestoreSBL1PartialDigest'), (new Buffer('fAAAAEAQAgDAcZDeGqmO8LWlCHcYIPVjFqR87A==', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/SBL1PartialDigest'), (new Buffer('ZAAAAIC9AQACxiFAOjelZm4NtrrLc8bPJIRQNA==', 'base64')).toString('ascii'), { encoding: 'ascii' })
    fs.writeFileSync(getPath('src/iPhone5,1/BB/SBL2DownloadDigest'), (new Buffer('LycXsLwawICZf2dMjev2yhZs+ic=', 'base64')).toString('ascii'), { encoding: 'ascii' })
    if (!(checkExist('src/iPhone5,1/BB/Mav5-8.02.00.Release.bbfw')
    && checkExist('src/iPhone5,1/BB/Mav5-8.02.00.Release.plist'))
    ) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        detail: 'Fetching iPhone 5 firmware didn\'t worked correctly.',
        buttons: ['OK']
      })
      process.exit()
    }
  }
}
