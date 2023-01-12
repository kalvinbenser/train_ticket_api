const moment = require('moment')
const _ = require('lodash')
const db = require("../db");
const Book = db.book
const User = db.user




exports.getAllAvailableSeats = async (req, res) => {
    try {
        const data = await getAllSeats();
        const user_id = req.user_id;
        const {
            dataValues
        } = await User.findByPk(user_id)
        console.log("date_of_birth", dataValues.date_of_birth)
        const a = moment();
        const b = moment(dataValues.date_of_birth, 'YYYY');
        const age = a.diff(b, 'years');
        const gender = dataValues.gender;
        let filtered_data;
        if (gender === 1 && age >= 18 && age <= 40) {
            filtered_data = _.filter(data, function (d) {
                return _.includes([1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20], d.seat);
            });
            if (_.isEmpty(filtered_data)) {
                filtered_data = _.filter(data, function (d) {
                    return _.includes([6, 7, 8, 9, 10, 11, 12, 13, 14], d.seat);
                });
            }
        } else if (gender === 2) {
            filtered_data = _.filter(data, function (d) {
                return _.includes([6, 7, 8, 9, 10, 11, 12, 13, 14], d.seat);
            });

            if (_.isEmpty(filtered_data)) {
                res.send({
                    "success": false,
                    "message": "no seat available"
                })
            }
        } else {
            filtered_data = data
        }

        res.send({
            "success": true,
            "data": filtered_data,

        })

    } catch (e) {
        res.send({
            "success": false,
            "message": e
        })
    }
}


const getAllSeats = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const today_date = moment().format("YYYY-MM-DD");
        const total_coach = 10
        const seats_per_coach = 20
        const total_coach_array = _.range(1, total_coach + 1)
        const seats_per_coach_array = _.range(1, seats_per_coach + 1)
        const total_available_seats = total_coach_array.flatMap((c) =>
            seats_per_coach_array.map((s) =>

                ({
                    date: today_date,
                    coach: c,
                    seat: s,
                })

            )
        );
        const reservedSeats = await Book.findAll({
            where: {
                isReserved: true,
                date: today_date
            },
            raw: true
        })
        // console.log("reservedSeats", reservedSeats)
        let total_reserved;
        let data;
        let data1 = []
        if (reservedSeats.length > 0) {
         
            for (let i in reservedSeats) {
                if (reservedSeats[i].start === "S1" && reservedSeats[i].end === "S4") {
                    data1.push(reservedSeats[i])
                }
            }
            // console.log("data1", data1)

            if (data1.length > 0) {
                total_reserved = _.map(data1, function (l) {
                    return _.pick(l, ["date", "coach", "seat"])
                });


                data = _.filter(total_available_seats, function (a) {
                    return !_.find(total_reserved, function (b) {
                        return (a.date === b.date && a.coach === b.coach && a.seat === b.seat)
                    })
                })
            } else {
                data = total_available_seats

            }

        } else {
            data = total_available_seats

        }

        if (data) {
            resolve(data)
        } else {
            reject("get All seats retriew failiure")

        }
    })
}


exports.bookReserveSeat = async (req, res) => {
    try {
        const seat_exists = await checkSeatExists(req)
        console.log("seat_exists", seat_exists)
        if (seat_exists) {
            const data = {
                date: req.body.date,
                coach: req.body.coach,
                seat: req.body.seat,
                start: req.body.start,
                end: req.body.end,
                user_id: req.user_id
            }
            const result = await Book.create(data)
            res.send({
                "success": true,
                "message": "reserve seat book successfully",
                "data": result
            })
        } else {
            res.send({
                "success": false,
                "message": "seat not exist",

            })
        }



    } catch (e) {
        res.send({
            "success": false,
            "message": e
        })
    }
}

const checkSeatExists = async (req) => {
    return new Promise(async (resolve) => {
        const date = req.body.date
        const coach = req.body.coach
        const seat = req.body.seat
        const start = req.body.start
        const end = req.body.end
        const exists = await Book.findAll({
            where: {
                date: date,
                coach: coach,
                seat: seat,
                isReserved: true
            }
        })
        // console.log("exists", exists)
        let data = []
        if (exists.length > 0) {
   

            for (let i in exists) {
                if (((exists[i].start === "S1" && exists[i].end === "S2") && (start === "S1" && end === "S2")) || ((exists[i].start === "S1" && exists[i].end === "S3") && (start === "S1" && end === "S3")) || ((exists[i].start === "S1" && exists[i].end === "S4") && (start === "S1" && end === "S4")) || ((exists[i].start === "S2" && exists[i].end === "S3") && (start === "S2" && end === "S3")) || ((exists[i].start === "S2" && exists[i].end === "S4") && (start === "S2" && end === "S4")) || ((exists[i].start === "S3" && exists[i].end === "S4") && (start === "S3" && end === "S4"))) {
            
                    data.length = 0
                    break;
                } 
                else if ((exists[i].start === "S1" && exists[i].end === "S2") && ((start === "S1" && end === "S3") || (start === "S1" && end === "S4")) ) {
                    data.length = 0
                    break;
                } 
                else if ((exists[i].start === "S1" && exists[i].end === "S3") && ((start === "S1" && end === "S2") || (start === "S1" && end === "S4") ||  (start === "S2" && end === "S3") || (start === "S2" && end === "S4")) ) {
                    data.length = 0
                    break;
                }
                else if ((exists[i].start === "S1" && exists[i].end === "S4") && ((start === "S1" && end === "S2") || (start === "S1" && end === "S3") ||  (start === "S2" && end === "S3") || (start === "S2" && end === "S4") || (start === "S3" && end === "S4")) ) {
                    data.length = 0
                    break;
                }
                else if ((exists[i].start === "S2" && exists[i].end === "S3") && ((start === "S1" && end === "S2") || (start === "S1" && end === "S3") ||  (start === "S1" && end === "S4") || (start === "S2" && end === "S4")) ) {
                    data.length = 0
                    break;
                }
                else if ((exists[i].start === "S2" && exists[i].end === "S4") && ((start === "S1" && end === "S3") || (start === "S1" && end === "S4") ||  (start === "S2" && end === "S3") || (start === "S3" && end === "S4")) ) {
                    data.length = 0
                    break;
                }
                else if ((exists[i].start === "S3" && exists[i].end === "S4") && ((start === "S1" && end === "S4") || (start === "S2" && end === "S4") ) ) {
                    data.length = 0
                    break;
                }
                else {
            
                    data.length = 1
            
                }
            
            }
            if (data.length > 0) {
                resolve(true)

            } else {
                resolve(false)

            }

        } else {
            resolve(true)

        }

    })
}

exports.cancelReserveSeat = async (req, res) => {
    try {
        const book_id = req.body.book_id
        console.log("book_id", book_id)
        const data = {
            isReserved: false
        }
        const result = await Book.update(data, {
            where: {
                id: book_id,
                user_id:req.user_id
            }
        })

        res.send({
            "success": true,
            "message": "cancel reserve seat successfully",
            "data": result
        })
      

    } catch (e) {
        res.send({
            "success": false,
            "message": e
        })
    }
}



exports.getAllReservedSeats = async (req, res) => {
    try {
        const today_date = moment().format("YYYY-MM-DD");

        const data = await Book.findAll({
            where: {
                isReserved: true,
                date: today_date
            }
        })
        res.send({
            "success": true,
            "data": data
        })

    } catch (e) {
        res.send({
            "success": false,
            "message": e
        })

    }
}