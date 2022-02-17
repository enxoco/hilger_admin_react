import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache"
import { gql } from 'graphql-tag'
import Router from "next/router"
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from "urql"
import { pipe, tap } from "wonka"
import { DeletePostMutationVariables, DeleteCourseMutationVariables, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from "../generated/graphql"
import betterUpdateQuery from "./betterUpdateQuery"
import { isServer } from "./isServer"


// Global error handling
export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // If the OperationResult has an error send a request to sentry
        if (error) {
          // the error is a CombinedError with networkError and graphqlErrors properties
          if (error?.message.includes("not authenticated")) {
            Router.replace("/login")
          }
        }
      })
    )
  }
  const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
      const { parentKey: entityKey, fieldName } = info;
      const allFields = cache.inspectFields(entityKey);// Get all queries in the cache
      const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
      const size = fieldInfos.length;
      if (size === 0) {
        return undefined;
      }
  
      const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
      const isItInTheCache = cache.resolve(
        cache.resolve(entityKey, fieldKey) as string,
        "courses"
      );
      info.partial = !isItInTheCache;
      let hasMore = true
      const results: string[] = [];
      fieldInfos.forEach((fi) => {// Combine results from subsequent queries into the results returned to client
        // const key = cache.resolve(entityKey, fi.fieldKey) as string;
        // const data = cache.resolve(key, "courses") as string[];
        const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
        const data = cache.resolve(key, "courses") as string[]
        const _hasMore = cache.resolve(key, "hasMore")

        if (!_hasMore) {
          hasMore = _hasMore as boolean;
        }
        results.push(...data);
      });

      return {
        courses: results,
        hasMore,
        __typename: "PaginatedCourses"
      }

    };
  };

function invalidateAllCourses(cache: Cache) {
  const allFields = cache.inspectFields("Query");// Get all queries in the cache
  const fieldInfos = allFields.filter((info) => info.fieldName === 'courses');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'courses', fi.arguments)
  })
}
export const createUrqlClient = (ssrExchange: any, ctx: any) => {

  // Pass logged in users cookie to graphql for ssr requests so we know
  // their status.
  let cookie = ''
  if(isServer()){
    cookie = ctx.req.headers.cookie
  }
  return {
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    headers: cookie ? {cookie} : undefined
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedCourses: () => null,
      },
      resolvers: {// Client side resolvers
        Query: {
          courses: cursorPagination()
        }
      },
      updates: {
        Mutation: {
          deleteCourse: (_result, args, cache, info) => {
            console.log('run me')
            console.log('args.', args)
            cache.invalidate({__typename: "Course", id: (args as DeleteCourseMutationVariables).id})
          },

          createCourse: (_result, args, cache, info) => {// Refetch posts when post is created so that it shows up at top of list.
            invalidateAllCourses(cache)
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user,
                }
              }
            })
            invalidateAllCourses(cache)
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => ({ me: null }))
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user,
                }
              }
            })
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
}
}
