const db = require('./db');
const User=db.user
const jwt = require('jsonwebtoken');
const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return next('Please login to access the data');
        }
        const verify = await jwt.verify(token,'ABCD');
        req.user = await User.findByPk(verify.id);
        next();
    } catch (error) {
       return next(error); 
    }
}

module.exports = isAuthenticated;