import Express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import connectDB from "./db/connectDB";
import { GlobalError } from "./middleware/global.error.middleware";
import TechersRouter from "./routes/teacher.route";
import corse from "cors";
import StudentRouter from "./routes/student.route";


// Initializing
const app = Express();
const port = process.env.PORT || 3000;
const origin = process.env.ORIGIN || "*"

// Configaration
app.use(cookie())
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(
    corse(
        {
            origin,
            credentials:true
        }
    )
);
dotenv.config(
    {
        path:"./.env"
    }
);


// Api endpoints
app.use("/api/v1",TechersRouter);
app.use("/api/v1",StudentRouter);

// Set global Error Handling
app.use(GlobalError);

//Database connection and app start
;(
    async () => {
        await connectDB()
        .then( response => (
            console.log("Your Database was host on the : "+response.connection.host),
            console.log("Your Database was run on port : "+response.connection.port),
            console.log("Your Database name is : "+response.connection.name)
        ))
        
        // then run the application
        app.listen( port , ()=> {
            console.log("Your server was listing on port : "+port);
        })
    }
)();