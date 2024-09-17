import { IPayload } from "src/Models/Auth/Payload";

declare global {
    namespace Express {
        interface Request {
            user?: IPayload;
        }
    }
}

export { };