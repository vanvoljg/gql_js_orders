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

const { OrderType, PaymentType } = require('./models/types.js');
const resolvers = require('./pgResolvers.js');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: {
    orders: {
      description: 'Get all orders, unpaginated',
      type: GraphQLList(GraphQLNonNull(OrderType)),
      resolve: () => resolvers.getOrders(),
    },
    orderById: {
      description: 'Get a specific order by ID',
      type: GraphQLList(GraphQLNonNull(OrderType)),
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, args) => resolvers.getOrderById(args.id),
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
      },
      resolve: (_root, args) => resolvers.createOrder(args),
    },
    applyPayment: {
      description: 'Apply a payment to an order',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentType))),
      args: {
        amount: { type: GraphQLNonNull(GraphQLFloat) },
        note: { type: GraphQLString },
        orderId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, args) => resolvers.applyPayment(args),
    },
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
