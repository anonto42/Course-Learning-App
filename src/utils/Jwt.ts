import jwt from "jsonwebtoken";

interface imp { 
    id: string;
    userType: string;
}

export function JWT_SIGN (value: imp){
    const jwtSecret = process.env.JWT_SECRET || "";
    const JWT = jwt.sign(value, jwtSecret);
    return JWT
}
