const router = require("express").Router()
 const isAuthenticated = require('./auth');


const userController = require('./controllers/user.controller')
const ticketController = require('./controllers/ticket.controller')





//users

router.get("/getAllUsers",isAuthenticated, userController.getAllUsers)
router.post("/createUser",userController.createUser)
router.post("/userLogin", userController.userLogin)
router.put("/updateUser",isAuthenticated, userController.updateUser)
router.delete("/deleteUser",isAuthenticated, userController.deleteUser)

//seats
router.get("/getAllAvailableSeats",isAuthenticated,ticketController.getAllAvailableSeats)
router.get("/getAllReservedSeats",isAuthenticated, ticketController.getAllReservedSeats)

router.post("/bookReserveSeat",isAuthenticated, ticketController.bookReserveSeat)
router.post("/cancelReserveSeat",isAuthenticated, ticketController.cancelReserveSeat)










module.exports = router