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
const { ipcRenderer } = window.require('electron')

const NotPlugged = () => {
  return (
    <>
      <h1>No idevices are detected.</h1>
      <p>Make sure it's plugged in.</p>
    </>
  )
}

const Plugged = (props) => {
  let supportDevices = props.idevices.filter(element => element.type === deviceType.default.SUPPORTED)
  let noSupportDevice = supportDevices.length === 0
  const [deviceIndex, setIndexDevice] = React.useState(0)
  const [iOSVersions, setIOSVersions] = React.useState([])
  const [iOSVersionIndex, setIOSVersionIndex] = React.useState(0)
  const [versionChanged, setVersionChanged] = React.useState(false)
  React.useEffect(() => {
    if (typeof deviceIndex !== 'undefined') {
      let product = supportDevices[deviceIndex].productType
      const getVersions = async () => {
        let { data } = await axios(`https://api.ipsw.me/v4/device/${product}?type=ipsw`)
        data = data.firmwares
        setIOSVersions(data.filter(version => supportVersion[product].includes(version.buildid)))
      }
      getVersions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceIndex])
  React.useEffect(() => {
    setVersionChanged(true)
  }, [iOSVersionIndex])
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
            label='Version'
            enhanced
            required
            disabled={typeof deviceIndex === 'undefined'}
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
      </Grid>
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
