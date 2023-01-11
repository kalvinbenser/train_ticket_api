module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date_of_birth: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "date format yyyy-mm-dd"
        },
        phone_number: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "1-male,2-female"
        }
    });

    return User;
};