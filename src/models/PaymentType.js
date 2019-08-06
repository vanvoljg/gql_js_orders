'use strict';

const {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');
const OrderType = require('./OrderType.js');
const resolvers = require('../pgResolvers.js');

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  description: 'A payment',

  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLNonNull(GraphQLFloat) },
    appliedAt: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.applied_at,
    },
    note: { type: GraphQLNonNull(GraphQLString) },
    orderId: {
      type: GraphQLNonNull(GraphQLID),
      resolve: (payment) => payment.order_id,
    },
    order: {
      type: OrderType,
      args: {
        orderId: {type:GraphQLID}
      },
      resolve: (payment) => resolvers.getOrderById(payment.orderId),
    },
  },
});

module.exports = PaymentType;
