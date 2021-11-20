const { users, profile } = require('../../models');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {

    // Validation Request
    const schema = Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
        fullName : Joi.string().required(),
        role : Joi.string().required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(400).send({
            status : "Error",
            message : error.details[0].message
        });
    }

    //Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    try {
        
        // Check email is exsits from table
        const emailExists = await users.findOne({
            where : {
                email : req.body.email
            }
        });

        if(emailExists)
        {
            return res.status(400).send({
                status : "Failed",
                message : "Email Already Exists"
            });
        }

        // Create User
        const dataUser = await users.create({
            email : req.body.email,
            password : hashPassword,
            fullName : req.body.fullName,
            role : req.body.role
        });

        const token = jwt.sign({id : dataUser.id},process.env.TOKEN_KEY)

        await profile.create({
            statusSubscribe : false,
            image : "default.svg",
            idUser : dataUser.id
        });

        

        res.status(200).send({
           status : "Success",
           data : { 
               user : {
                   email : req.body.email,
                   token : token
               }
           }
        });

    } catch (error) {
        
        console.log(error);
        req.send({
            status : "Error",
            message : "Server Error"
        });

    }

}