import { validationRequest,BadRequestError } from '@shanticket/common';
import express, {Request,Response} from 'express';
import { body} from 'express-validator';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Your must suppy a password')
    ],
    validationRequest,
    async (req:Request,res:Response)=>{
        const {email, password} = req.body;
        const existingUser = await User.findOne({email})
        if (!existingUser){
            throw new BadRequestError("Invalid credential");
        }
        const passwordMatch = await Password.compare(existingUser.password,password);
        if (!passwordMatch){
            throw new BadRequestError("Invalid credential");
        }

        //generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        
        },process.env.JWT_KEY!);
        
        //store in server side, sessionId will be stored in cookie and sent to client
        req.session = {
            jwt: userJwt
        };
        
        res.status(200).send(existingUser)
    }
);

export {router as signinRouter};