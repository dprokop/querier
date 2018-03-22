import React, { Component } from 'react';
import RepositoriesList from './RepositoriesList';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedCompany: null
    }
  }

  handleCompanySelection(companyName) {
    if (this.state.selectedCompany === companyName) return;

    this.setState({
      selectedCompany: companyName
    })
  }

  renderRepositoriesList() {
    const { selectedCompany } = this.state;
    return <RepositoriesList company={selectedCompany} />
  }

  renderLinks() {
    return (
      <ul className="App-links">
        <li className="App-link" onClick={() => {
          this.handleCompanySelection('facebook')
          }
        }>
          Facebook
        </li>
        <li className="App-link" onClick={() => {
          this.handleCompanySelection('google')
          }
        }>
          Google
        </li>
        <li className="App-link" onClick={() => {
          this.handleCompanySelection('microsoft')
          }
        }>
          Microsoft
        </li>
      </ul>
    )
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Querier basic example</h1>
        </header>

        <p className="App-intro">
          Choose which company repositories to list:
        </p>
        {this.renderLinks()}
        {this.state.selectedCompany && this.renderRepositoriesList()}
      </div>
    );
  }
}

export default App;
