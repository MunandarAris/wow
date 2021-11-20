const { users } = require("../../models");

exports.getUsers = async (req,res) => {

    try {

        const usersData = await users.findAll({
            attributes : {
                exclude : ["password","role","createdAt","updatedAt"]
            }
        });

        res.send({
            status : "Success",
            data : {
                users : usersData
            }
        })
        
    } catch (error) {

        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        });

    }

};

exports.deleteUser = async (req,res) => {

    try {

        const {id} = req.params;

        const dataUser = await users.findOne({
            where : {
                id
            }
        });

        if(!dataUser)
        {
            return res.status(400).send({
                status : "Failed",
                message : "User Not Found"
            });
        }

        await users.destroy({
            where : {
                id
            }
        });

        res.send({
            status : "Success",
            data : {
                id
            }
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        })
    }

}