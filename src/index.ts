import { Client, Query } from "pg";
import  express, { json, query }  from "express";

const app = express();
app.use(express.json());


const pgCLient = new Client("postgresql://todoooo_owner:D9VYwHUZj8lt@ep-cold-meadow-a11nvitw.ap-southeast-1.aws.neon.tech/todoooo?sslmode=require")
pgCLient.connect();

app.post("/signup", async(req, res)=>{

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    

    try { 
        const userinsertquery = `INSERT INTO users(username,email, password) VALUES ($1,$2,$3) RETURNING id`;
        const addressinsertquery = `INSERT INTO addresses(user_id,city,country,street) VALUES ($1, $2, $3, $4)`;
        await pgCLient.query('BEGIN')

        const userResponse = await pgCLient.query(userinsertquery , [username,email,password]);
        const user_id = userResponse.rows[0].id;
        const addressResponse = await pgCLient.query(addressinsertquery, [user_id,city,country,street]);
        await pgCLient.query('COMMIT')
 
        res.json({
            message:"signed up"
        });
    }catch(e){
        res.json({
            message:"error while signing up"
        });
    }    
})

app.get("/metadata", async(req,res)=>{
    const id = req.query.id;
    try{
        const query = 'SELECT users.id, users.username,users.email,addresses.city,addresses.country,addresses.street FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id=$1';
        const response = await pgCLient.query(query,[id]);
        res.json({
           response: response.rows
        })
    }catch(e){
        console.log(e);
        res.json({
            message:"error occured"
        });
    }
   
})

app.listen(3000);


