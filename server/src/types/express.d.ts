import type { Request } from "express";
import type { PublicUser } from "@lecal/shared";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export {};