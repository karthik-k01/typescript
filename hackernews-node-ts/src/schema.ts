import { makeExecutableSchema } from '@graphql-tools/schema'
import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
// import { Plugin, handleStreamOrSingleExecutionResult } from '@envelop/types'
// import type { Link } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
// import type { User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import _ from 'lodash';
import { appendFile } from 'fs';
import { Request } from "express";  
import { useCORS } from 'graphql-yoga/typings/plugins/useCORS';
const prisma = new PrismaClient()

const SECRET = 'ajhdiuwj[vk[qk0789yf4o2lijopihof2yup9'




type Link = {
  id: number;
  shortcut: string;
  url: string
}

type User = {
  id: number;
  email: string;
  password: string;
  links?: Link[]
}

type AuthTokenPayload = {
  token: string;
  users?: User[];
}


const builder = new SchemaBuilder<{
  Objects: {
    User: User,
    Link: Link
    AuthTokenPayload: AuthTokenPayload
  },
}>({
});

// const myPlugin = ():contez Plugin => {
//   return {
//     onExecute({ args }) {
//       return {
//         onExecuteDone(payload) {
//           return handleStreamOrSingleExecutionResult(payload, ({ result, setResult }) => {
//             // Here you can access the result, and modify it with setResult if needed
//           })
//         }
//       }
//     }
//   }
// }

builder.objectType("Link", {
  fields: t => ({
    id: t.exposeID("id"),
    shorcut: t.exposeString("shortcut"),
    url: t.exposeString("url")
  })
})

builder.objectType("User", {
  fields: t => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    links: t.field({
      type: ["Link"],
      resolve: async (user) => {
        return await prisma.link.findMany({
          where: {
            postedById : user.id
          }
        })
      }
    })
  })
});


builder.queryType({
  fields: (t) => ({
    users: t.field({
      type: ["User"],
      args: {},
      resolve: () => {
        return prisma.user.findMany()
      },
    }),
    getUrl: t.field({
      type: "Link",
      args: {
        email: t.arg.string({
          required: true
        }),
        shortcut: t.arg.string({
          required: true
        })
      },
      resolve: async (parent, args, contextValue) => {
        
        const user = await prisma.user.findUnique({
          where: {
            email: args.email
          }
        })

        if(!user){
          throw new GraphQLError("User not found!")
        }

        const shorcutIsPresent = await prisma.link.findFirstOrThrow({
          where: {
            id: user.id,
            shortcut: args.shortcut,
            
          }
        })

        if(!shorcutIsPresent){
          throw new GraphQLError("Shortcut not found")
        }

        return shorcutIsPresent
      }
    })
  }),
});

builder.mutationType({
  fields: (t) => ({
    signUp: t.field({
      type: "User",
      args: {
        email: t.arg.string({
          required: true
        }),
        password: t.arg.string({
          required: true
        })
      },
      resolve: async (parent, args) => {
        const userIsPresent = await prisma.user.findFirst({
          where: {
            email: args.email
          }
        })

        if(userIsPresent){
          throw new GraphQLError("User already exists")
        }
        const data = args

        data.password = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
          data: {
            email: args.email,
            password: data.password
          }
        })

        return user
      }
    }),

    addShortcut: t.field({
      type: "Link",
      args: {
        email: t.arg.string({
          required:true
        }),
        shortcut: t.arg.string({
          required:true
        }),
        url: t.arg.string({
          required:true
        })
      },
      resolve: async (parent, args) => {
         
        
        const user = await prisma.user.findUnique({
          where: {
            email: args.email
          }
        })

        if(!user){
          throw new GraphQLError("User is not present with your mail ID")
        }

        const shortcutIsPresent = await prisma.link.findUnique({
          where: {
            shortcut: args.shortcut
          }
        })

        if(shortcutIsPresent){
          throw new GraphQLError("Shortcut already present!")
        }

        return await prisma.link.create({
          data: {
            shortcut: args.shortcut,
            url: args.url,
            postedById: user.id
          }
        })
      }
    }),
    deleteShortcut: t.field({
      type:"Link",
      args: {
        email: t.arg.string({
          required: true
        }),
        shortcut: t.arg.string({
          required:true
        })
      },
      resolve: async (parent, args) => {
        const user = await prisma.user.findUnique({
          where: {
            email: args.email
          }
        })

        if(!user){
          throw new GraphQLError("User does not exists")
        }

        const shorcutIsPresent = await prisma.link.findUnique({
          where: {
            shortcut: args.shortcut
          }
        })

        if(!shorcutIsPresent){
          throw new GraphQLError("Shortcut is not present")
        }

        return await prisma.link.delete({
          where:{
            shortcut: args.shortcut
          }
        })
      }
    }),

    updateShortcut: t.field({
      type:"Link",
      args: {
        email: t.arg.string({
          required: true
        }),
        shortcut: t.arg.string({
          required: true
        }),
        url: t.arg.string({
          required: true
        })
      },
      resolve: async (parent, args) => {
        const user = await prisma.user.findUnique({
          where: {
            email: args.email
          }
        })

        if(!user){
          throw new GraphQLError("User does not exists")
        }

        const shorcutIsPresent = await prisma.link.findUnique({
          where: {
            shortcut: args.shortcut
          }
        })

        if(!shorcutIsPresent){
          throw new GraphQLError("Shortcut is not present")
        }

        return await prisma.link.update({
          where: {
            id: shorcutIsPresent.id
          },
          data: {
            url: args.url
          }
        })
      }
    }),

    login: t.field({
      type: "String",
      args: {
        email: t.arg.string({
          required: true
        }),
        password: t.arg.string({
          required:true
        })
      },
      resolve: async (parent, args) => {
        const user = await prisma.user.findFirst({
          where: {
            email: args.email
          }
        })

        if(!user){
          throw new GraphQLError("No user found")
        }

        const valid = await bcrypt.compare(args.password, user.password)

        if(!valid){
          throw new GraphQLError("Incorrect Password")
        }

        const token = jwt.sign({
          user: _.pick(user, ['id', 'email'])
        },
        SECRET,
        {
          expiresIn: '1y'
        })

        return token
      }
    })
  })
})
// builder.mutationType({
//   fields: (t) => ({
//     postLink: t.field({
//       type: Link,
//       args: {
//         url: t.arg.string({ required: true }),
//         shortcut: t.arg.string({ required: true })
//       },
//       resolve: (parent, args, Link) => {
//         const newLink = prisma.link.create({
//           data: {
//             url: args.url,
//             shortcut: args.shortcut
//           }
//         })
//         return newLink
//       }
//     }),
//     deleteLink: t.field({
//       type: Link,
//       args: {
//         shortcut: t.arg.string({ required: true })
//       },
//       resolve: (parent, args, Link) => {
//         const newLink = prisma.link.delete({
//           where: {
//             shortcut: args.shortcut
//           }
//         })
//         return newLink
//       }
//     }),
//     updateShortcut: t.field({
//       type: Link,
//       args: {
//         shortcut1: t.arg.string({ required: true }),
//         shortcut2: t.arg.string({ required: true })
//       },
//       resolve: (parent, args, Link) => {
//         const newLink = prisma.link.update({
//           where: {
//             shortcut: args.shortcut1
//           },
//           data: {
//             shortcut: args.shortcut2
//           }
//         })
//         return newLink
//       }
//     })
//   })
// })

export interface Context {
  prisma: PrismaClient;
  userId?: number;  // 1
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload { // 2
  const token = authHeader.replace("Bearer ", "");  // 3

  if (!token) {
      throw new Error("No token found");
  }
  return jwt.verify(token, SECRET) as AuthTokenPayload;  // 4
}

export const context = ({ req }: { req: Request }): Context => {   // 2
  const token =
      req && req.headers.authorization
          ? decodeAuthHeader(req.headers.authorization)
          : null;

  return {  
      prisma
  };
};



export {SECRET};
export const schema = builder.toSchema();