const router = require("express").Router()


const userController = require('./controllers/user.controller')





//users

router.get("/getAllUsers", userController.getAllUsers)
router.post("/createUser",userController.createUser)










module.exports = router