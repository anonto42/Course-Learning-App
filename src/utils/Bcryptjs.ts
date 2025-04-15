import bcrypt from "bcryptjs"

class Bcryptjs {
    static async hash(password: string):Promise<string> {
        return await bcrypt.hash(password, 10);
    };
    static async compare(givenPassword: string, userPassword: string):Promise<boolean> {
        return await bcrypt.compare(givenPassword, userPassword)
    };
};

export default Bcryptjs;