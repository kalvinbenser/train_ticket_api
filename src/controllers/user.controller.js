const bcrypt = require('bcrypt')
const db = require("../db");
const jwt = require('jsonwebtoken');
const User = db.user


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
      gender: req.body.gender
    };

    const user = await User.create(data)
    const token = await jwt.sign({
      id: user.id
    }, 'ABCD', {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.send({
      "success": true,
      "data": {
        "user_id": user.id,
        "token": token
      },
    })
  } catch (e) {
    res.send({
      "success": false,
      "message": e
    })
  }



};

exports.userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const getUserData = await User.findOne({
      where: {
        email: email
      }
    });

    if (getUserData) {
      const HashPassword = getUserData.password;
      const result = await bcrypt.compare(password, HashPassword)
      if (result) {
        const user_id = getUserData.id
        const token = await jwt.sign({
          id: user_id
        }, 'ABCD', {
          expiresIn: process.env.JWT_EXPIRE,
        });
        res.send({
          "success": true,
          "message": "login successfully",
          "data": {
            "user_id": user_id,
            "token": token
          }
        })
      } else {
        res.send({
          "success": false,
          "message": "incorrect user credentials.try again"
        })

      }

    } else {
      res.send({
        "success": false,
        "message": "user not found"
      })

    }
  } catch (e) {
    res.send({
      "success": false,
      "message": e
    })
  }

};


exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.findAll()
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

exports.updateUser = async (req, res) => {
  try {
    id = req.body.id;
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      phone_number: req.body.phone_number,
      email: req.body.email,
      gender: req.body.gender
    };

    const result = await User.update(data, {
      where: {
        id: id
      }
    })
    res.send({
      "success": true,
      "data": result
    })

  } catch (e) {
    res.send({
      "success": false,
      "message": e
    })
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const id = req.body.id;
    const data = await User.destroy({
      where: {
        id: id
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