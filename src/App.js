import React from 'react'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarTitle,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent,
  List,
  ListItem,
  Icon,
  Select,
  Grid,
  GridCell,
  LinearProgress
} from 'rmwc'
import deviceType from './deviceType'
import 'material-components-web/dist/material-components-web.min.css'
import './App.css'
import axios from 'axios'
import supportVersion from './versions'
const iPhone5base = [
  '7.0',
  '7.0.2',
  '7.0.3',
  '7.0.4',
  '7.0.6'
]
const { ipcRenderer } = window.require('electron')

// Thanks to https://meetup.toast.com/posts/160
class changeQueue {
  constructor () {
    this.list = []
    this.index = 0
  }

  enqueue (c) {
    this.list.push(c)
  }

  dequeue () {
    const o = this.list[this.index]
    this.index++

    return o
  }

  get isEmpty () {
    return this.list.length - this.index === 0
  }
}

const NotPlugged = () => {
  return (
    <>
      <h1>No idevices are detected.</h1>
      <p>Make sure it's plugged in.</p>
    </>
  )
}

const Plugged = (props) => {
  // TODO: Clean these codes up for Contributer
  const progressChange = new changeQueue()
  let supportDevices = props.idevices.filter(element => element.type === deviceType.default.SUPPORTED)
  let noSupportDevice = supportDevices.length === 0
  const [deviceIndex, setIndexDevice] = React.useState(0)
  const [iOSVersions, setIOSVersions] = React.useState([])
  const [iOSVersionIndex, setIOSVersionIndex] = React.useState(0)
  const [baseIOSVersions, setBaseIOSVersions] = React.useState([])
  const [baseIOSIndex, setBaseIOSIndex] = React.useState(0)
  const [versionChanged, setVersionChanged] = React.useState(false)
  const [patchingIPSW, setPatchingIPSW] = React.useState(false)
  const [IPSWpatched, setIPSWpatched] = React.useState(false)
  const [IPSWPercentage, setIPSWPercentage] = React.useState(undefined)
  const patchIPSW = () => {
    if (typeof iOSVersions[iOSVersionIndex] !== 'undefined'
    && (supportDevices[deviceIndex].productType === 'iPhone3,1'
      || typeof baseIOSVersions[baseIOSIndex] !== 'undefined')
    ) {
      ipcRenderer.send('ipsw-patch', {
        IPSWurl: iOSVersions[iOSVersionIndex].url,
        product: supportDevices[deviceIndex].productType,
        base: supportDevices[deviceIndex].productType === 'iPhone3,1'
        ? '7.1.2'
        : baseIOSVersions[baseIOSIndex].version
      })
      ipcRenderer.once('ipsw-patch-start', (sender, arg) => {
        setPatchingIPSW(true)
      })
      ipcRenderer.once('ipsw-patch-done', (sender, arg) => {
        setPatchingIPSW(false)
        setIPSWpatched(true)
      })
    }
  }
  React.useEffect(() => {
    if (typeof supportDevices[deviceIndex] !== 'undefined') {
      let product = supportDevices[deviceIndex].productType
      const getVersions = async () => {
        let { data } = await axios(`https://api.ipsw.me/v4/device/${product}?type=ipsw`)
        data = data.firmwares
        setIOSVersions(data.filter(version => supportVersion[product].includes(version.buildid)))
        if (product !== 'iPhone3,1') {
          setBaseIOSVersions(data.filter(version => iPhone5base.includes(version.version)))
          setBaseIOSIndex(0)
        }
        setIOSVersionIndex(0)
      }
      getVersions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceIndex])
  // TODO: Make another file for this shits
  React.useEffect(() => {
    if (typeof iOSVersions[iOSVersionIndex] !== 'undefined'
    && (supportDevices[deviceIndex].productType === 'iPhone3,1'
      || typeof baseIOSVersions[baseIOSIndex] !== 'undefined')
    ) {
      setVersionChanged(true)
      ipcRenderer.send(
        'ipsw-download',
        [
          iOSVersions[iOSVersionIndex].url,
          supportDevices[deviceIndex].productType === 'iPhone3,1'
          ? (iOSVersions.filter(version => version.version === '7.1.2'))[0].url : baseIOSVersions[baseIOSIndex].url
        ]
      )
      const onGetChunkLength = (sender, arg) => {
        progressChange.enqueue({
          execute: () => {
            const now = Date.now()
            while (Date.now() < now + 15) {
            /* do nothing; this will exit once it reached the time limit */
            /* if you want you could do something and exit*/
            /* mostly I prefer to use this */
            }
            setIPSWPercentage(arg)
          }
        })
      }
      const processChanges = (deadline) => {
        while (deadline.timeRemaining() > 0 && !(progressChange.isEmpty)) {
          const c = progressChange.dequeue()

          if (c) {
            c.execute()
          }
        }

        if (!(progressChange.isEmpty)) {
          requestIdleCallback(processChanges)
        }
      }
      ipcRenderer.once('ipsw-download-start', (sender, arg) => {
        ipcRenderer.prependListener('ipsw-download-current', onGetChunkLength)
        ipcRenderer.once('ipsw-download-current', () => requestIdleCallback(processChanges))
      })
      ipcRenderer.once('ipsw-download-done', () => {
        ipcRenderer.off('ipsw-download-current', onGetChunkLength)
        setVersionChanged(false)
        setIPSWPercentage(undefined)
        patchIPSW()
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iOSVersionIndex, baseIOSIndex])
  if (noSupportDevice) {
    return (
      <>
        <h1>No supported iDevices found.</h1>
        <p>Make sure you plugged the supported device. (iPhone 4, iPhone 5)</p>
      </>
    )
  }
  return (
    <>
      <h1>s0meiyoshino</h1>
      <p>Please select your device.</p>
      <Grid>
        <GridCell>
          <Select
            label='Device'
            enhanced
            required
            disabled={supportDevices.length === 1}
            options={supportDevices.map((device, i) => {
              return {
                label: device.productType,
                value: i.toString()
              }
            })}
            value={deviceIndex.toString()}
            defaultValue='0'
            onChange={event => setIndexDevice(parseInt(event.currentTarget.value))}
          />
        </GridCell>
        <GridCell>
          <Select
            label='Target'
            enhanced
            required
            disabled={typeof supportDevices[deviceIndex] === 'undefined'}
            options={iOSVersions.map((version, i) => {
              return {
                label: version.version,
                value: i.toString()
              }
            })}
            value={iOSVersionIndex.toString()}
            defaultValue='0'
            onChange={event => setIOSVersionIndex(parseInt(event.currentTarget.value))}
          />
        </GridCell>
        {typeof supportDevices[deviceIndex] !== 'undefined'
        && supportDevices[deviceIndex].productType !== 'iPhone3,1'
        ? (
          <GridCell>
            <Select
              label='Target'
              enhanced
              required
              disabled={typeof supportDevices[deviceIndex] === 'undefined'}
              options={baseIOSVersions.map((version, i) => {
                return {
                  label: version.version,
                  value: i.toString()
                }
              })}
              value={baseIOSIndex.toString()}
              defaultValue='0'
              onChange={event => setBaseIOSIndex(parseInt(event.currentTarget.value))}
            />
          </GridCell>
        ) : null}
        {/* TODO: Make a buttons for browse IPSW or download */}
      </Grid>
      {versionChanged
        ? <>
          <p>Downloading IPSW(s)...</p>
          <LinearProgress progress={IPSWPercentage}/>
        </> : null}
      {patchingIPSW
        ? <>
          <p>Patching IPSW...</p>
          <LinearProgress />
        </> : null}
    </>
  )
}

const App = () => {
  const [drawerOpened, setDrawerOpened] = React.useState(false)
  const [ideviceStatus, setIdeviceStatus] = React.useState([{ type: deviceType.default.NOT_PLUGGED }])
  React.useEffect(() => {
    ipcRenderer.on('ideviceStatus', (event, arg) => {
      setIdeviceStatus(arg)
    })
  }, [])
  return (
    <React.Fragment>
      <Drawer modal open={drawerOpened} onClose={() => setDrawerOpened(false)}>
        <DrawerHeader>
          <DrawerTitle>s0meiyoshino electron</DrawerTitle>
          <DrawerSubtitle>Made <span role='img' aria-label='heart'>❤️</span> with Helloyunho</DrawerSubtitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <ListItem>
              <Icon icon='home' />Homf
            </ListItem>
            <ListItem>
              <Icon icon='info' />Info
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>

      <TopAppBar short>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarNavigationIcon icon='menu' onClick={() => setDrawerOpened(true)} />
            <TopAppBarTitle>s0meiyoshino electron</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <div className='main'>
        {(ideviceStatus[0].type === deviceType.default.NOT_PLUGGED) ? <NotPlugged /> : <Plugged idevices={ideviceStatus} />}
      </div> 
    </React.Fragment>
  )
}

export default App
