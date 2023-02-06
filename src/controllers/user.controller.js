const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const User = db.user;

exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: password,
      date_of_birth: req.body.date_of_birth,
      phone_number: req.body.phone_number,
      email: req.body.email,
      gender: req.body.gender,
    };

    const user = await User.create(data);

    res.send({
      success: true,
      data: {
        user_id: user.id,
      },
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.findAll();
    res.send({
      success: true,
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
