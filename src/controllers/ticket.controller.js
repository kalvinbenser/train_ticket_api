const moment = require('moment')
const _ = require('lodash')
const db = require("../db");
const Book = db.book



exports.getAllAvailableSeats = async (req, res) => {
    try {
        const data = await getAllSeats();
        const a = moment();
        const b = moment('1995-12-17', 'YYYY');
        const age = a.diff(b, 'years');
        const gender = 2;
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
            seats_per_coach_array.map((s) => ({
                date: today_date,
                coach: c,
                seat: s,
            }))
        );
        const reservedSeats = await Book.findAll({
            where: {
                isReserved: true,
                date: today_date
            },
            raw: true
        })
        const total_reserved = _.map(reservedSeats, function (l) {
            return _.pick(l, ["date", "coach", "seat"])
        });


        const data = _.filter(total_available_seats, function (a) {
            return !_.find(total_reserved, function (b) {
                return (a.date === b.date && a.coach === b.coach && a.seat === b.seat)
            })
        })

        if (data) {
            resolve(data)
        } else {
            reject("get All seats retriew failiure")

        }
    })
}


exports.bookReserveSeat = async (req, res) => {
    try {
        const data = {
            date: req.body.date,
            coach: req.body.coach,
            seat: req.body.seat,
            user_id: req.body.user_id
        }
        const result = await Book.create(data)
        res.send({
            "success": true,
            "message": "reserve seat book successfully",
            "data": result
        })

    } catch (e) {
        res.send({
            "success": false,
            "message": e
        })
    }
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
                id: book_id
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