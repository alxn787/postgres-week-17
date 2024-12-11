"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgCLient = new pg_1.Client("postgresql://todoooo_owner:D9VYwHUZj8lt@ep-cold-meadow-a11nvitw.ap-southeast-1.aws.neon.tech/todoooo?sslmode=require");
pgCLient.connect();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    try {
        const userinsertquery = `INSERT INTO users(username,email, password) VALUES ($1,$2,$3) RETURNING id`;
        const addressinsertquery = `INSERT INTO addresses(user_id,city,country,street) VALUES ($1, $2, $3, $4)`;
        yield pgCLient.query('BEGIN');
        const userResponse = yield pgCLient.query(userinsertquery, [username, email, password]);
        const user_id = userResponse.rows[0].id;
        const addressResponse = yield pgCLient.query(addressinsertquery, [user_id, city, country, street]);
        yield pgCLient.query('COMMIT');
        res.json({
            message: "signed up"
        });
    }
    catch (e) {
        res.json({
            message: "error while signing up"
        });
    }
}));
app.get("/metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const query = 'SELECT users.id, users.username,users.email,addresses.city,addresses.country,addresses.street FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id=$1';
        const response = yield pgCLient.query(query, [id]);
        res.json({
            response: response.rows
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            message: "error occured"
        });
    }
}));
app.listen(3000);
