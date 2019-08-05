'use strict';

const { GraphQLObjectType, GraphQLString } = require('graphql');

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  description: 'A payment',

  fields: () => ({
    id: { type: GraphQLString },
    amount: { type: GraphQLString },
    appliedAt: {
      type: GraphQLString,
      resolve: (payment) => payment.applied_at,
    },
    orderId: {
      type: GraphQLString,
      resolve: (payment) => payment.order_id,
    },
  }),
});

module.exports = PaymentType;
