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
  Typography
} from 'rmwc'
import 'material-components-web/dist/material-components-web.min.css'
import './App.css'

const App = () => {
  const [drawerOpened, setDrawerOpened] = React.useState(false)
  return (
    <React.Fragment className='App'>
      <Drawer modal open={drawerOpened} onClose={() => setDrawerOpened(false)}>
        <DrawerHeader>
          <DrawerTitle>s0meiyoshino electron</DrawerTitle>
          <DrawerSubtitle>Made ❤️ with Helloyunho</DrawerSubtitle>
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
            <TopAppBarTitle>asdfasdf</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <div className='main'>
        <h1>FUCK YOU</h1>
      </div>
    </React.Fragment>
  )
}

export default App
