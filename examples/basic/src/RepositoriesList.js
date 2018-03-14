import React, { Component } from 'react';
import { withData } from 'querier';
import { getRepositoriesForCompany } from './queries';
import { QuerierState } from 'querier';

class RepositoriesList extends Component {

  render() {
    // states and results props injected by withData HOC
    const { states, results } = this.props;
    if (states.repos && states.repos.state === QuerierState.Active) {
      return <h1>Loading {this.props.company} repositories, hold on...</h1>
    }

    return results.repos && (
      <ul className="RepositoriesList-list">
        {
           results.repos.map((repo, i) => {
            return (
              <li className="RepositoriesList-link" key={i}>
                <span>{repo.name}</span>
                <a  href={repo.html_url} target="_blank">
                  View on Github →
                </a>
              </li>
            )
          })
        }
      </ul>
    );
  }
}

const repositoriesListDataDependencies = {
  inputQueries: {
    repos: {
      query: getRepositoriesForCompany
    }
  }
}

export default withData(repositoriesListDataDependencies)(RepositoriesList);
