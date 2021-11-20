const { users } = require('../../models');

const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req,res) => {

    // Create Validation
    const schema = Joi.object({
        email : Joi.required(),
        password : Joi.required()
    });

    const {error} = schema.validate(req.body);

    if(error)
    {
        return res.status(400).send({
            status : "Failed",
            message : error.details[0].message
        });
    }

    try {

        // Check Email
        const emailExists = await users.findOne({
            where : {
                email : req.body.email
            }
        });

        if(!emailExists){
            return res.status(400).send({
                status : "Failed",
                message : "Email And Password Not Match"
            })
        }

        // Check Password
        const passwordMatch = await bcrypt.compare(req.body.password,emailExists.password);

        if(!passwordMatch)
        {
            return res.status(400).send({
                status : "Failed",
                message : "Email And Password Not Match"
            })
        }

        let user = await users.findOne({
            where : {
                email : emailExists.email
            },
            attributes : {
                exclude : ['password','createdAt','updatedAt']
            }
        })

        const token = jwt.sign({ id : emailExists.id }, process.env.TOKEN_KEY);

        user = {
            ...user.dataValues,
            token
        }

        res.send({
            status : "Success",
            data : {
                user
            }
        })
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        })

    }

}