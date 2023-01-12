const db = require('./db');
const User=db.user
const jwt = require('jsonwebtoken');
const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            // return next('Please login to access the data');
            return res.status(403).send({
                message: "No token provided!",
              });
        }
        const verify = await jwt.verify(token,'ABCD', (err, decoded) => {
            if (err) {
              return res.status(401).send({
                message: "Unauthorized!",
              });
            }
            req.user_id = decoded.id;
            next();
          });
    
    } catch (error) {
        return res.status(500).send({
            message: "Unauthorized!",
          });
    }
}

module.exports = isAuthenticated;