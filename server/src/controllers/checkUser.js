const { users } = require("../../models")

exports.checkUser = async (req,res) => {

    const id = req.user.id;

    const userExists = await users.findOne({
        where : {
            id
        },
        attributes : {
            exclude : ['password','createdAt','updatedAt']
        }
    });

    try {
        
        if(!userExists)
        {
            return res.status(400).send({
                status : "Failed",
                message : "User Not Found"
            });
        }

        res.send({
            status : "Success",
            data : {
                user : userExists
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