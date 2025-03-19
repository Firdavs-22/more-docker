import {UserPayload} from "@utils/jwt";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload
    }
}