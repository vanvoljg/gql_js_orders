# GraphQL Order Endpoint

A GraphQL order and payment management endpoint with data persistence.

Based on the `graphql`, `express-graphql`, `express`, and `pg` JavaScript libraries

## Deployment and setup

### Dependencies

This application depends on the following system dependencies:

- PostgreSQL >= v9.6
- Node >= v8.0 (async/await support required)

### Environment variable/.env Requirements

- `PORT` The port to run the server on. MUST BE SET, NO DEFAULT.
- `DATABASE_URL` The database URL to the PostgreSQL database to use. MUST BE SET, NO DEFAULT.
- `DATABASE_MAX_CONNECTIONS` The max number of connections in the PostgreSQL connection pool. Default: 10
- `DATABASE_IDLE_TIMEOUT_MILLIS` The timeout for an idle connection. Default: 10000 (10 seconds)
- `DATABASE_CONNECTION_TIMEOUT_MILLIS` The timeout for an active connection's operation. Default: 0 (no timeout)
- `NODE_ENV` The environment to run the app in. Set to `production` for production use. Default: `development`

### Local deployment

(The below instructions use `yarn` as a package management tool. You may substitute `npm` if you prefer.)

- Clone the repository, check out the `develop` branch, and install node dependencies:

  ```
  $ git clone https://github.com/vanvoljg/gql_js_orders.git
  $ cd gql_js_orders
  $ git checkout master
  $ yarn install
  ```

- Prepare the database for use:

  ```
  $ createdb gql_orders
  $ psql -f ./src/data/schema.sql -d gql_orders
  ```

  This assumes your database is to be named `gql_orders`. If you desire a different database name, use that instead.

- run `yarn start`

### Endpoint

- `/graphql` exposes the GraphQL endpoint
- `/graphql/graphiql` exposes the GraphiQL environment (only in `development` or `test` environments)

### Queries

- `orders`: `[OrderType]!`
- `orderById(id: ID!)`: `[OrderType]!`

### Mutations

- `createOrder(description: String!, total: Float!, balanceDue: Float!)`: `[OrderType!]!`
- `applyPayment(amount: Float!, orderId: ID!, note: String!): [PaymentType!]!`

### Types

- ```
  OrderType {
    id: ID!
    description: String!
    total: Float!
    paymentsApplied: [PaymentType]!
  }
  ```

- ```
  PaymentType {
    id: ID!
    amount: Float!
    note: String
    appliedAt: String!
    order: [OrderType!]!
  }
  ```
