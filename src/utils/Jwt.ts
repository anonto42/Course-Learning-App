import jwt, { JwtPayload } from "jsonwebtoken";

export interface SignType { 
    id: string;
    userType: string;
}

const jwtSecret = process.env.JWT_SECRET || "";

export function JWT_SIGN (value: SignType){ 
    const JWT = jwt.sign(value, jwtSecret,{expiresIn:"3d"});
    return JWT
}

export function JWT_DECODE(inCodedValue: string): JwtPayload {
    const decode = jwt.verify(inCodedValue,jwtSecret)
    return decode as JwtPayload
}