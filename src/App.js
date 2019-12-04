import React, { Fragment } from 'react';
import GlobalStyle from './globalStyle';
import store from './store';
import { Provider } from 'react-redux';
import { Slides } from './slides';
import { SlideContent } from './style'

function App() {
  return (
    <Fragment>
      <Provider store={store}>
      <GlobalStyle />
      <Slides minWidth="600px" >
        <SlideContent>1</SlideContent>
        <SlideContent>2</SlideContent>
        <SlideContent>3</SlideContent>
        <SlideContent>4</SlideContent>
        <SlideContent>5</SlideContent>
      </Slides> 
      </Provider>
    </Fragment>
  );
}

export default App;
