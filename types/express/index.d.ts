import { IUser } from "../../interfaces/interface.user";

declare global {
    namespace Express {
        interface Request {
            user?: IUser | null
        }
    }
}