const { profile, users } = require('../../models');

const Joi = require('joi');

const fs = require('fs');

exports.updateProfile = async (req,res) => {

    // Create Validation
    const schema = Joi.object({
        gender : Joi.string().required(),
        mobilePhone : Joi.number().required(),
        address : Joi.string().required(),
    });

    const {error} = schema.validate(req.body);

    if(error)
    {
        return res.status(400).send({
            status : "Failed",
            message : error.details[0].message
        });
    }

    const idUser = req.user.id;

    const profileUser = await profile.findOne({
        where : {
            idUser
        }
    });

    if(Object.keys(req.files).length === 0)
    {
        await profile.update({
            gender : req.body.gender,
            mobilePhone : req.body.mobilePhone,
            address : req.body.address
        },{
            where : {
                idUser
            }
        });
    }
    else 
    {
        if(profileUser.image === "default.svg")
        {
            await profile.update({
                gender : req.body.gender,
                mobilePhone : req.body.mobilePhone,
                address : req.body.address,
                image : req.files.image[0].filename
            },{
                where : {
                    idUser
                }
            });
        }
        else 
        {
            fs.unlinkSync("uploads/" + profileUser.image);

            await profile.update({
                gender : req.body.gender,
                mobilePhone : req.body.mobilePhone,
                address : req.body.address,
                image : req.files.image[0].filename
            },{
                where : {
                    idUser
                }
            });
        }
    }

    let dataUser = await profile.findOne({
        where : {
            idUser
        },
        include : {
            model : users,
            as : "users",
            attributes : {
                exclude : ["email","password","role","createdAt","updatedAt"]
            }
        },
        attributes : {
            exclude : ["idUser","createdAt","updatedAt"]
        }
    });

    dataUser = {
        ...dataUser.dataValues,
        image : process.env.PATH_FILE + dataUser.dataValues.image
    }

    try {

        res.send({
            status : "Success",
            data : {
                profileUser : dataUser
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        });

    }

}

exports.getProfile = async (req,res) => {

    const idUser = req.user.id;
    
    try {

        let dataUser = await profile.findOne({
            where : {
                idUser
            },
            include : {
                model : users,
                as : "users",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            attributes : {
                exclude : ["idUser","createdAt","updatedAt"]
            }
        });
    
        dataUser = {
            ...dataUser.dataValues,
            image : process.env.PATH_FILE + dataUser.dataValues.image
        }

        res.send({
            status : "Success",
            data : {
                profileUser : dataUser
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Error",
            message : "Server Error"
        });

    }

}