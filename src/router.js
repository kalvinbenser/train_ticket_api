const router = require("express").Router()
// const isAuthenticated = require('./auth');


const userController = require('./controllers/user.controller')
const ticketController = require('./controllers/ticket.controller')





//users

router.get("/getAllUsers", userController.getAllUsers)
router.post("/createUser",userController.createUser)
router.post("/userLogin", userController.userLogin)
router.put("/updateUser", userController.updateUser)
router.delete("/deleteUser", userController.deleteUser)

//seats
router.get("/getAllAvailableSeats", ticketController.getAllAvailableSeats)
router.get("/getAllReservedSeats", ticketController.getAllReservedSeats)

router.post("/bookReserveSeat", ticketController.bookReserveSeat)
router.post("/cancelReserveSeat", ticketController.cancelReserveSeat)










module.exports = router