const jwt = require('jsonwebtoken');

exports.token = (req,res,next) => {

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
    {
        return res.status(400).send({
            status : "Failed",
            message : "Access Denied",
        });
    }

    try {
        
        const verified = jwt.verify(token,process.env.TOKEN_KEY);
        req.user = verified;
        next();
        
    } catch (error) {

        console.log(error);
        res.send({
            message : "Invalid Token"
        });
        
    }

}