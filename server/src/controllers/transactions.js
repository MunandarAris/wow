const {transactions,users} = require("../../models");
const cron = require('node-cron');
const midtransClient = require('midtrans-client');
const crypto = require("crypto");

//fitur for user
exports.addTransaction = async (req,res) => {

    const saveData = await transactions.create({
        idUser,
        proofTransaction : req.files.proofTransaction[0].filename,
        remainingActive : 0,
        accountNumber : req.body.accountNumber,
        statusUser : "Not Active",
        statusPayment : "Pending"
    });

    let data = await transactions.findOne({
        where : {
            id : saveData.id
        },
        include : {
            model : users,
            as : "user",
            attributes : {
                exclude : ["email","password","role","createdAt","updatedAt"]
            }
        },
        attributes : {
            exclude : ["idUser","createdAt","updatedAt"]
        }
    });

    data = {
        ...data.dataValues,
        proofTransaction : process.env.PATH_FILE + data.dataValues.proofTransaction
    }

    try {

        res.send({
            status : "Success",
            data : {
                transaction : data
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        });

    }

}

//fitur for admin
exports.updateTransaction = async (req,res) => {

    const {id} = req.params;
    const statusPayment = req.body.statusPayment;

    const statusUserActive = "Active";
    const statusUserNotActive = "Not Active";
    const remainingActive = 30;
    const remainingNotActive = 0;

    const getDateNow = new Date();
    const getHours = getDateNow.getHours();

    try {

        if(statusPayment === "Approve")
        {
            await transactions.update({
                statusPayment,
                statusUser : statusUserActive,
                remainingActive,
                timeApprove : getHours
            },{
                where : {
                    id
                }
            });
        }
        else if(statusPayment === "Cancel")
        {
            await transactions.update({
                statusPayment,
                statusUser : statusUserNotActive,
                remainingActive : remainingNotActive,
                timeApprove : "0"
            },{
                where : {
                    id
                }
            });
        }
        else 
        {
            return res.status(400).send({
                status : "Failed",
                message : "Choice Not Ready"
            })
        }

        let data = await transactions.findOne({
            where : {
                id
            },
            include : {
                model : users,
                as : "user",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            attributes : {
                exclude : ["idUser","createdAt","updatedAt"]
            }
        });

        data = {
            ...data.dataValues,
            proofTransaction : process.env.PATH_FILE + data.dataValues.proofTransaction
        }

        res.send({
            status : "Success",
            data : {
                transaction : data
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        });

    }

}

//fitur for admin
exports.getTransactions = async (req,res) => {

    try {

        let dataTransactions = await transactions.findAll({
            include : {
                model : users,
                as : "user",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            attributes : {
                exclude : ["idUser","createdAt","updatedAt"]
            }
        }); 

        dataTransactions = dataTransactions.map(item => {
            return {
                ...item.dataValues,
                proofTransaction : process.env.PATH_FILE + item.dataValues.proofTransaction
            }
        });

        res.send({
            status : "Success",
            data : {
                transactions : dataTransactions
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

//fitur for admin
exports.getTransaction = async (req,res) => {

    const {id} = req.params;

    try {

        let dataTransactions = await transactions.findOne({
            where : {
                id
            },
            include : {
                model : users,
                as : "user",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            attributes : {
                exclude : ["idUser","createdAt","updatedAt"]
            }
        }); 

        dataTransactions = {
            ...dataTransactions.dataValues,
            proofTransaction : process.env.PATH_FILE + dataTransactions.dataValues.proofTransaction
        }

        res.send({
            status : "Success",
            data : {
                transaction : dataTransactions
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Failed",
            message : "Data Not Found"
        })

    }

}

// Validation Subscribe
exports.validationSubscribe = async (req,res) => {

    const id = req.user.id;

    const checkUser = await transactions.findOne({
        where : {
            idUser : id
        },
        attributes : {
            exclude : ['createdAt','updatedAt']
        }
    });

    if(!checkUser)
    {
        return res.send({
            message : "Error"
        })
    }

    try {

        res.send({
            status : "Success",
            data : {
                validation : checkUser
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

// Payment
exports.payment = async (req,res) => {

    const idUser = req.user.id;

    // Get User For Data Midtrans
    let userLogin = await users.findOne({
        where : {
            id : idUser
        },
        attributes : {
            exclude : ["createdAt","updatedAt","password"]
        }
    });

    try {
        
        // Setup Midtrans
        const randomId = crypto.randomBytes(5).toString('hex');

        // Create Snap
        let snap = new midtransClient.Snap({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY
        });

        // Create Data Payment
        let parameter = {
            transaction_details : {
                order_id : randomId,
                gross_amount : 100000
            },
            credit_card : {
                secure : true
            },
            customer_details : {
                full_name : userLogin.dataValues.fullName,
                email : userLogin.dataValues.email
            }
        }

        // Processing Payment
        const payment = await snap.createTransaction(parameter);

        res.send({
            status : "Success",
            midtransData : payment
        })

    } catch (error) {
        res.send({
            status : "Error",
            message : "Server Error"
        })
    }

}

// Update Remainig Active Users
cron.schedule(' */61 * * * *', async () => {

    try {

        let dataTransactions = await transactions.findAll({
            include : {
                model : users,
                as : "user",
                attributes : {
                    exclude : ["email","password","role","createdAt","updatedAt"]
                }
            },
            attributes : {
                exclude : ["idUser","createdAt","updatedAt"]
            }
        }); 

        const getDateNow = new Date();
        const getHours = getDateNow.getHours();

        dataTransactions = dataTransactions.map(item => {
            if(item.statusUser == "Active" && item.remainingActive > 0)
            {
                if(item.timeApprove == getHours)
                {
                    transactions.update({
                        remainingActive : item.remainingActive - 1
                    },
                    {
                        where : {
                            id : item.id
                        }
                    });
                }
            }

            if(item.statusUser == "Active" && item.remainingActive <= 0)
            {
                transactions.update({
                    statusUser : "Not Active",
                    remainingNotActive : 0
                },
                {
                    where : {
                        id : item.id
                    }
                });
            }

            return {
                ...item.dataValues,
                proofTransaction : process.env.PATH_FILE + item.dataValues.proofTransaction
            }
        });

        res.send({
            status : "Success",
            data : {
                transactions : dataTransactions
            }
        });
        
    } catch (error) {
        
        console.log(error);
        res.send({
            status : "Failed",
            message : "Server Error"
        })

    }

});