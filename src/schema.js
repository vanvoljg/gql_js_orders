'use strict';

const {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');

const OrderType = require('./models/OrderType.js');
const PaymentType = require('./models/PaymentType.js');
const resolvers = require('./pgResolvers.js');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: {
    orders: {
      description: 'Get all orders, unpaginated',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderType))),
      resolve: () => resolvers.getOrders(),
    },
    orderById: {
      description: 'Get a specific order by ID',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderType))),
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (root, args) => resolvers.getOrderById(args.id),
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: '...',

  fields: {
    createOrder: {
      description: 'Create a new order',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderType))),
      args: {
        description: { type: GraphQLNonNull(GraphQLString) },
        total: { type: GraphQLNonNull(GraphQLFloat) },
        balanceDue: { type: GraphQLFloat },
      },
      resolve: (root, args) => resolvers.createOrder(args),
    },
    applyPayment: {
      description: 'Apply a payment to an order',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentType))),
      args: {
        amount: { type: GraphQLNonNull(GraphQLFloat) },
        note: { type: GraphQLString },
        orderId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (root, args) => resolvers.applyPayment(args),
    },
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
