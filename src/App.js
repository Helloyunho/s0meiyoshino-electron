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
  Icon
} from 'rmwc'
import deviceType from './deviceType'
import 'material-components-web/dist/material-components-web.min.css'
import './App.css'
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
  if (supportDevices.length === 0) {
    return (
      <>
        <h1>No supported iDevices found.</h1>
        <p>Make sure you plugged the supported device. (iPhone 4, iPhone 5)</p>
      </>
    )
  } else {
    return (
      <>
        <h1>Found a device!</h1>
        <p>Great!</p>
      </>
    )
  }
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
