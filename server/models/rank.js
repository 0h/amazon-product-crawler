module.exports = (sequelize, DataTypes) => {
  const Rank = sequelize.define("Rank", {
    rank: {
      type: DataTypes.INTEGER
    },
    category: {
      type: DataTypes.TEXT
    },
    updated_at: DataTypes.DATE
  });

  Rank.associate = function(models) {
    Rank.belongsTo(models.Product, { foreignKey: "ASIN" });
  }

  return Rank;
};
