'use strict';

const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  description: 'An order',

  fields: () => ({
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    total: { type: GraphQLString },
    balanceDue: {
      type: GraphQLString,
      resolve: (order) => order.balance_due,
    },
  }),
});

module.exports = OrderType;
