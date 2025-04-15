import Express from "express";

const app = Express();

app.get("/",(req,res)=> {
    res.send("Project init successfully")
})

app.listen( 3000, ()=> {
    console.log("server is running on 300")
})