# GraphQL Order Endpoint

A GraphQL order and payment management endpoint with data persistence.

## Deployment and setup

### Dependencies

This application depends on the following:

- PostgreSQL >= v9.6
- Node >= v7.6 (async/await support required)

### .env Requirements

- `PORT` The port to run the server on
- `DATABASE_URL` The database URL to the PostgreSQL database to use
- `DATABASE_MAX_CONNECTIONS` The max number of connections in the PostgreSQL connection pool
- `DATABASE_IDLE_TIMEOUT_MILLIS` The timeout for an idle connection
- `DATABASE_CONNECTION_TIMEOUT_MILLIS` The timeout for an active connection's operation
- `NODE_ENV` The environment to run the app in. Unset, defaults to using `development`. Set to `production` for production use

### Local deployment

(The below instructions use `yarn` as a package management tool. You may substitute `npm` if you prefer.)

- Clone the repository, check out the `develop` branch, and install node dependencies:
  ```
  git clone https://github.com/vanvoljg/peek_orders.git
  cd peek_orders
  git checkout develop
  yarn install
  ```
- Prepare the database for use:
  ```
  psql -f ./src/data/schema.sql -d peek_orders
  ```
  This assumes your database is named `peek_orders`. If your database is named differently, use that name instead.
- run `yarn start`

### Endpoint

`/graphql` exposes the GraphQL endpoint

### Queries

- `orders`: `[OrderType!]!`
- `orderById(id: ID!)`: `[OrderType!]!`

### Mutations

- `createOrder(description: String!, total: Float!, balanceDue: Float!)`: `[OrderType!]!`
- `applyPayment(amount: Float!, orderId: ID!, note: String!): [PaymentType!]!`

### Types

- ```
  OrderType {
    id: ID!
    description: String!
    total: Float!
    balanceDue: Float!
    paymentsApplied: [PaymentType!]!
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
