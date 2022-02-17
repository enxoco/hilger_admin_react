import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import 'dotenv-safe/config'
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Upvote } from "./entities/Upvote";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { Student } from "./entities/Student";
import { StudentResolver } from "./resolvers/student";
import { Course } from "./entities/Course";
import { CourseResolver } from "./resolvers/course";
const session = require("express-session");

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [Post, User, Upvote, Student, Course],
    migrations: [path.join(__dirname, "./migrations/*")]
  });
  // await Post.delete({})
  if (process.env.RUN_MIGRATIONS === "true") {
    await conn.runMigrations()
  }

  //   const post = orm.em.create(Post, { title: "My First post" });
  //   await orm.em.persistAndFlush(post);
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, StudentResolver, CourseResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),// Batch and cache sql requests
      upvoteLoader: createUpvoteLoader()
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(+process.env.PORT, () => {
    console.log("server started on ");
  });
};

main().catch((err) => {
  console.log(err);
});
