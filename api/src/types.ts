import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>// Easy way to get type of a variable
  upvoteLoader: ReturnType<typeof createUpvoteLoader>// Easy way to get type of a variable

};