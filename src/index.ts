import { Client, Query } from "pg";
import  express, { json, query }  from "express";

const app = express();
app.use(express.json());

const pgCLient = new Client("postgresql://todoooo_owner:D9VYwHUZj8lt@ep-cold-meadow-a11nvitw.ap-southeast-1.aws.neon.tech/todoooo?sslmode=require")
pgCLient.connect();

app.post("/signup", async(req, res)=>{

    try { 
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;


        const response = await pgCLient.query(`INSERT INTO users(username,email, password) VALUES ('${username}','${email}','${password}')`)

        res.json({
            message:"signed up"
        })
    }catch(e){
        res.json({
            message:"error while signing up"
        })
    }    
})

app.listen(3000);


