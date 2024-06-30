import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'world',
    password: '2002',
    port: 5432
});

db.connect();

const app = express();
const port = 4001;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
//Sign-up
app.post("/submit",(req,res)=>{
    const user = req.body['username'];
    const pass = req.body['password'];
    console.log(`Username: ${user}, Password: ${pass}`);

    db.query('insert into login (username,password) values($1,$2)',[user, pass],(err,result)=>{
        if(err){
            console.error('Error in extablishing connection',err.stack);
        }else{
            console.log("Connection Successful, Data Inserted!");
            res.redirect("/");
        }
    });
});
//sign-in
app.post("/login",(req,res)=>{
    const user = req.body['username'];
    const pass = req.body['password'];
        
    db.query("Select username, password from login where username = $1 and password = $2",[user, pass],(err,result)=>{
        if(err){
            console.error("Error in Establishing Connection.",err.stack);
            res.status(500).send("Error in Fetching data.");
        }else if(result.rows.length > 0){
            console.log("Login Successful");
            console.log(`Username from database is : ${result.rows[0].username}, Password is : ${result.rows[0].password}`);
            res.render('home.ejs');
        }else{
            console.log("User not found.");
            res.redirect('index.ejs');
        }
    });
   
});
app.get("/signup",(req,res)=>{
    res.render('signup.ejs');
});

app.listen(port,()=>{
    console.log(`Port is active on ${port}`);
});