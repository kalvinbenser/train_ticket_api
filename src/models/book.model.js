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
        start: {
            type: Sequelize.STRING,
            allowNull: false,
            comment:"S1-station1,S2-station2,S3-station3,S4-station4"
        },
        end: {
            type: Sequelize.STRING,
            allowNull: false,
            comment:"S1-station1,S2-station2,S3-station3,S4-station4"
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