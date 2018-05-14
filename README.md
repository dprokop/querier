
# Querier
Simple declarative data layer for React applications

[![Build Status](https://travis-ci.org/dprokop/querier.svg?branch=master)](https://travis-ci.org/dprokop/querier)

# Table of Content
  * [What is Querier?](#what-is-querier)
  * [Querier gist](#querier-gist)
  * [Getting data in and out from component](#queries)
    * [Input queries](#input-queries)
    * [Action queries](#action-queries)
    * [Data dependencies definition](#data-dependencies-definition)
  * [Handling query statuses](#handling-query-statuses)
  * [Caching](#caching)
  * [Server-side rendering](#server-side-rendering)
  * [API](#server-side-rendering)
  * [Known limitations](#known-limitations)

## What is Querier?
Querier is a tool that helps you get remote and async data into React app effortlessly.

With simple, declarative API, you don't have to worry about handling async state or errors. All you have to do is decorate component that requires async data using [`withData`](#withdata) higher-order component. Results, states and possible errors will be injected into the component as props.

Querier is implemented and tested in TypeScript.

## What is a declarative data layer?
Simply, it is a way to supply data to your components. You declare component's data requirements, and the whole logic for fetching it, supplying status and results is handled by Querier itself. To achieve that, you implement `queries`. Queries are simply **async functions**. They can either communicate with remote source or resolve async data in whatever way you imagine.

## Querier Gist

**First**, define your queries:
```js
// queries.js

export const getRepository = async ({id}) => {
  const results = await octokit.repos.getById({
    id
  });
  return results.data;
};

export const starRepository = async (owner, repo) => {
  const results = await octokit.activity.starRepo({
    owner,
    repo,
  });
  return results.data;
};
```

**Second**, make your component use the queries:
```jsx
import { getRepository, starRepository } from 'queries.js';
import {  withData, QuerierState } from 'querier';

// Define component that will require async data
class RepositoryDetails extends React.Component {
  handleRepositoryStar() {
    const { repository } = this.props.results;

    if(repository) {
      // action queries are available via actionQueries prop
      this.props.actionQueries.starRepository(
        repository.owner.login,
        repository.name
      );
    }
  }

  render () {
    const { name } = this.props.results.respository;
    const { states: { repository: { state } } } = this.props;

    return state === QuerierState.Success ? (
      <div>
        <h1>Respository name: {name}</h1>
        <button onClick={this.handleRepositoryStar}>Star repo</button>
      </div>
    ) : null;
  }
}

// Define RepositoryDetails data requirements (vide queries)
const repositoryDetailsQueries = {
  inputQueries: {
    repository: {
      query: getRepository
    }
  },
  actionQueries: {
    starRepository: {
      query: starRepository
    }
  }
};

// Decorate your component using withData HOC
export default withData(repositoryDetailsQueries)(RepositoryDetails);
```

For examples take a look into `examples` directory.
## Queries
---
Queries gives you ability to get data *in* and *out* of React component. They are the most important part of Querier.

To supply data into component you use [`inputQueries`](#input-queries). To perform async operations (e.g. submittng a form) you use [`actionQueries`](#action-queries).

### Input queries
Here's an example of a simple input query:

```ts
// queries.ts

export const getRepository = async ({ id }: { id: number }): Promise<RepositoryType> => {
    return await octokit.repos.getById({
      id: id.toString()
    }).data
  };
```

To make `getRepository` query supply data to your component, you need to decorate your component using `withData` HOC:
```ts
// YourComponent.tsx

// First, define data dependencies definition
const repositoryDetailsQueries = {
  inputQueries: {
    /**
     * You declare that your component will use getRepository query.
     * Query result will be available in props as this.props.results.repository
     * Query status will be available in props as this.props.states.repository
     **/
    repository: {
      query: getRepository
    }
  }
}

// Second, use withData HOC
export default withData(repositoryDetailsQueries)(YourComponent);
```
#### Input queries key notes
- Input queries are fired when component mounts
- **Input queries always receive component's full set of props** as argument
- Input queries are being reinvoked when component's props change
- Input query results are **cached** by default. See [Caching](#caching) for more details.

### Action queries
Action queries are similiar to input queries. The main difference is that thay are not being invoked automatically.

The purpose of action query is to perform async operation as a result of user interaction, e.g. submitting a form.

Here's an example of action query usage:
```tsx
// queries.ts

export const findUser = async (userName: string): Promise<SearchOrgResults> => {
    const results = await octokit.search.users({
      q: userName,
    });

    return results.data;
  };
```
```ts
// SearchComponent.tsx

type SearchComponentActionQueries = {
  findUser: SearchResults;
}

class SearchComponent extends React.Component<WithDataProps<{}, {} , SearchComponentActionQueries>> {
  handleSubmit(userName: string) {
    this.props.actionQueries.findUser(userName);
  }

  render () {
    const {
      results: { findUser },
      states
    } = this.props

    // Use findUser and states.findUser to render ...
  }
}

const searchComponentQueries = {
  actionQueries: {
    findUser: {
      query: searchQuery
    }
  }
}
export default withData(searchComponentQueries)(SearchComponent);
```

#### Action queries key notes
- Results of the action query **will be passed back to the component**. Thanks to that you can declaratively perform e.g. navigation using React Router.
- Action queries results are **cached** by default. See [Caching]() for more details.

### Data dependencies definition
In order to perform queries you need to define them and pass to `withData` HOC. Data dependency definition is a simple JSON object describing queries your component will use:

```ts
import { getRepository } from 'app/queries';

type RepositoryDetailsOwnProps = {  id: number }
type RepositorDetailsInputQueries = {  repository: RepositoryType }
type RepositorDetailsActionQueries = {  starRepository: RepositoryType }
type RepositoryDetailsProps = WithDataProps<
  RepositoryDetailsOwnProps,
  RepositoryDetailsInputQueries,
  RepositorDetailsActionQueries
>;


const repositoryDetailsQueries: DataDependencyDefinition<
  RepositoryDetailsProps,
  RepositoryDetailsInputQueries,
  RepositoryDetailsActionQueries
> = {
  inputQueries: {
    repository: {
      query: getRepository
    }
  },
  actionQueries: {
    starRepository: starRepository,
    hot: true
  }
};
```

Data dependency definition is described by type `DataDependencyDefinition<TProps, TInputQueries, TActionQueries>`:

```ts
type DataDependencyDefinition<TProps, TInputQueries, TActionQueries> = {
  inputQueries?: InputQueriesDefinition<TProps, TInputQueries>;
  actionQueries?: ActionQueriesDefinition<TActionQueries>;
};
```

Input and action queries are defined separately, and each query definition accepts following options:

```ts
{
  query: InputQuery<TProps, TQueryResult> | ActionQuery<TQueryResult>;
  hot?: boolean;
  resultActions?: ResultActions<TQueryResult>;
}
```

#### Query defintion options
- `hot?: boolean` - when set to `true` makes the query not cacheable. See [Caching](#caching) for more information
- `resultActions?: Array<ActionFunction1<TQueryResult, Action<TQueryResult>>>` - array of Redux action creators. When defined, these actions will be performed when query succeedes. Use it e.g. when you want to store your query result in Redux store.


## Handling query statuses
  When decorating your component using `withData` HOC all your queries statuses are passed to the component in `states` prop. Each query state is represented by `QueryStateType`:
```ts
enum QuerierState {
  Pending = 0,
  Active,
  Success,
  Error
}

type QueryStateType = {
  state: QuerierState;
  error?: {};
};
```
Let's assume you declared, that your component will use `getUsers` input query result as `users` prop. This means, that the `states` prop will look like this:
```ts
{
  users: {
    state: // QuerierState ...
    error: // when state === QuerierState.Error
  }
}
```

Having this knowledge you can start building UI abstractions over this API to display e.g. feedback indicators to your users. Or, in case of action queries, you can for example redirect user to a new page when action query suceedes.

Also, there is a [`combineStates(states: StatesType): QueryStateType`](./src/utils/combineStates.ts) utility that will calculate derived status of multiple query states.

## Caching
By default, all **input** queries executed by Querier are cached. However, there are cases, when you want your queries to be executed every time instead of served from cache. To do so you need to declare your query as `hot` in your data dependencies definition passed to `withData` HOC:

```ts
const searchComponentQueries = {
  actionQueries: {
    findUser: {
      query: searchQuery,
      hot: true
    }
  }
}
```

For action queriers set `hot: false` to make them cacheable.

Querier cache is not persistent - you need to take care of this by yourself. `QuerierProvider` component accepts `querier: QuerierType` property that can be initialised using querier store that you have cached in e.g. local storage.

## Server-side rendering
For SSR example please take a look at [example repository](https://github.com/dprokop/querier-ssr-example)

## API

### `Querier`
`Querier(store?: QuerierStoreType, dispatch?: Dispatch<{}>)` is the core part of the tool. It's responsibility is to perform queries, cache and pass them back to components.

#### Arguments
- `store` is an object, when performed queries are stored. It keeps queries ids, states, results, and reasons(components that caused the query invocation). You can initialise Querier using store you have e.g. build during server-side rendering or store in local storage.
- `dispatch` is Redux's dispatch function. Initialise Querier with `dispatch` if you want to perform `resultActions` on your queries. See [Query defintion options](#query-defintion-options) for more details

### `QuerierProvider`
`<QuerierProvider querier>`
Makes querier available to components decorated with `withData` HOC. `QuerierProvider` should be the topmost component in your React tree.

#### Props
- `querier?: QuerierType` - pass `querier` prop if you have e.g. built your Querier store during server-side rendering.

### `withData`
`withData(dependencies)` return HOC that connects your component to Querier.

#### Arguments
- `dependencies: DataDependencyDefinition<TProps, TInputQueries, TActionQueries>` - please refer to [Data dependencies definition](#data-dependencies-definition) for details


 ## Known limitations
### Action queries arguments typings
Action queries arguments are not typed at the moment

### Anonymous query function exports in TypeScript when `module: 'commonjs'` set is problematic

Query keys in Querier cache are based on query function name and params passed to the query. When using `module: 'commonjs'` Typescript turns this :

`export const someQuery = () => 1`

into this:

```js
exports.someQuery = function (_ref) { ...
```

`someQuery.name` will return empty string for such export, meaning, that if your component rely on multiple input queries, or multiple queries rely on the same set or props, then all off them will resolve with data stored in cache for **first query that finished execution**. This of course leads to invalid data :(

To avoid this situation you can either set `module` to `esnext` or define your queries as non-anonymous functions or functions assigned to a `const` end exported later:

```ts
// This will work:
export async function someQuery() { ... }

// This will work as well:
const someQuery = async () => ...
export someQuery;
```
