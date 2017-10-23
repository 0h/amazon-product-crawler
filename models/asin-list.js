module.exports = (sequelize, DataTypes) => {
  const ASINList = sequelize.define("ASINList", {
    ASIN: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    completed: {
      type: DataTypes.BOOLEAN
    }
  });
  return ASINList;
};
