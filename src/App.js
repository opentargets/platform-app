import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Konami from 'react-konami-code';

import OtUiThemeProvider from './components/OtUiThemeProvider';
import client from './client';
import initLocalStorage from './utils/initLocalStorage';
import theme from './theme';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DiseasePage from './pages/DiseasePage';
import DownloadsPage from './pages/DownloadsPage';
import DrugPage from './pages/DrugPage';
import TargetPage from './pages/TargetPage';
import EvidencePage from './pages/EvidencePage';
import VariantsPage from './pages/VariantsPage';
import NotFoundPage from './pages/NotFoundPage';

import 'typeface-inter';

class App extends Component {
  componentDidMount() {
    initLocalStorage();
  }

  rr = () => {
    window.location.href = 'https://www.youtube.com/watch?v=QtBDL8EiNZo';
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <OtUiThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/downloads" component={DownloadsPage} />
              <Route path="/disease/:efoId" component={DiseasePage} />
              <Route path="/target/:ensgId" component={TargetPage} />
              <Route path="/drug/:chemblId" component={DrugPage} />
              <Route path="/evidence/:ensgId/:efoId" component={EvidencePage} />
              <Route path="/variants" component={VariantsPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </OtUiThemeProvider>
        <Konami action={this.rr} />
      </ApolloProvider>
    );
  }
}

export default App;
