import jwt, { JwtPayload } from "jsonwebtoken";

export interface SignType { 
    id: string;
    userType: string;
}

export function JWT_SIGN (value: SignType){ 
    const JWT = jwt.sign(value, process.env.JWT_SECRET!);
    return JWT
}

export function JWT_DECODE(inCodedValue: string): JwtPayload {
    const decode = jwt.verify(inCodedValue,process.env.JWT_SECRET!)
    return decode as JwtPayload
}