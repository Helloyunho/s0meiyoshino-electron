import React from 'react'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarTitle
} from 'rmwc'
import 'material-components-web/dist/material-components-web.min.css'

const App = () => {
  return (
    <div className='App'>
      <TopAppBar short>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarNavigationIcon icon='menu' />
            <TopAppBarTitle>asdfasdf</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    </div>
  )
}

export default App
