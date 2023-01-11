module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coach: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        seat: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        isReserved: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });

    return Book;
};