import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLContext } from './context'
import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

const builder = new SchemaBuilder({
  plugins: [SimpleObjectsPlugin],
});

const Link = builder.simpleObject('Link', {
  fields: (t) => ({
    url: t.string({
      nullable: false,
    }),
    shortcut: t.string({
      nullable: false,
    }),
    id: t.id({
      nullable: false,
    })
  }),
});

// const UserType = builder.simpleObject('User', {
//   interfaces: [Node],
//   fields: (t) => ({
//     firstName: t.string(),
//     lastName: t.string(),
//     contactInfo: t.field({
//       type: ContactInfo,
//       nullable: false,
//     }),
//   }),
// });

builder.queryType({
  fields: (t) => ({
    link: t.field({
      type: Link,
      args: {
      },
      resolve: (parent, args, Link) => {
        return {
          id: '1',
          shortcut: 'amzn',
          url: 'www.amazon.co.in'
        };
      },
    }),
  }),
});



export const schema = builder.toSchema();