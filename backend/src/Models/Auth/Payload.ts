export default class Payload {
    id: number;
    uuid: string;
    iat: number;
    exp: number;
}

export interface IPayload {
    id: number;
    uuid: string;
}
