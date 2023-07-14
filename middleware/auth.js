const jwt = require('jsonwebtoken')

const config = process.env

const authenticateJWT = (req,res,next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1];
        //console.log(config.API_SECRET);
        jwt.verify(token,config.API_SECRET,(err,data)=>{
            if(err){
                return res.sendStatus(403);
            }
            //console.log(data)
        });
        //console.log(token);
        next();
    }else{
        return res.sendStatus(401);
    }
}

module.exports = authenticateJWT