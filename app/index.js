const { app, BrowserWindow, ipcMain } = require('electron')
const libijs = require('libijs')
const meaco = require('meaco')
const checkInstalltion = require('./checkInstallation')
const deviceType = require('../src/deviceType').default
const supportediDevice = [
  'iPhone3,1',
  'iPhone5,1',
  'iPhone5,2'
]
const deasync = require('deasync')
const ipswUtils = require('./ipsw')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  checkInstalltion(win)

  // and load the index.html of the app.
  win.loadURL(process.env.DEVELOPING_SERVER ? 'http://localhost:5000' : 'file://index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win.webContents.once('did-finish-load', () => {
    const deviceManager = libijs.createClient().deviceManager
    const whenEventiDevice = () => {
      if (deviceManager.devices.length === 0) {
        win.webContents.send('ideviceStatus', [{
          type: deviceType.NOT_PLUGGED
        }])
        return
      }
      const devices = []
      deviceManager.devices.forEach(device => {
        let done = false
        meaco(function * () {
          const lockdownClient = yield libijs.lockdownd.getClient(device)
          const productType = yield lockdownClient.getValue(null, 'ProductType')
          if (!(supportediDevice.includes(productType))) {
            devices.push({
              type: deviceType.NOT_SUPPORTED
            })
            return
          }
          const productVersion = yield lockdownClient.getValue(null, 'ProductVersion')
          devices.push({
            type: deviceType.SUPPORTED,
            productType,
            productVersion
          })
        }).done(() => done = true)
        deasync.loopWhile(() => {
          return !done
        })
      })
      win.webContents.send('ideviceStatus', devices)
    }
    deviceManager.ready(whenEventiDevice)

    deviceManager.attached(whenEventiDevice)

    deviceManager.detached(whenEventiDevice)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('ipsw-download', (sender, arg) => {
  ipswUtils.getIPSW(arg[0], arg[1], sender)
})

ipcMain.on('ipsw-patch', (sender, arg) => {
  ipswUtils.patchIPSW(sender, arg)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.