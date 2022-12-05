import { Plugin } from "@envelop/core";
import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken"
import {SECRET} from './schema'
const authPlugin: Plugin = {
    onExecute({ args: {contextValue, operationName}, setResultAndStopExecution}) {
        if (['login', 'signUp'].includes(operationName)) return;
        // @ts-ignore
        const token = contextValue.req.headers

        if(!token){
            setResultAndStopExecution({
                errors: [new GraphQLError('No token provided')]
            })
        }

        if(!jwt.verify(token, SECRET)){
            setResultAndStopExecution({
                errors: [new GraphQLError('Provide a valid token')]
            })
        }
        // @ts-ignore
        contextValue.req.userId = jwt.verify(token, SECRET).userId
    }
}

export {authPlugin}