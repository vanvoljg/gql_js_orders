'use strict';

const {
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
    amount: { type: GraphQLNonNull(GraphQLString) },
    appliedAt: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.applied_at,
    },
    note: { type: GraphQLNonNull(GraphQLString) },
    orderId: {
      type: GraphQLNonNull(GraphQLID),
      resolve: (payment) => payment.order_id,
    },
  },
});

module.exports = PaymentType;
