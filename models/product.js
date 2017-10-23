module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      ASIN: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING
      },
      reviewCount: {
        type: DataTypes.INTEGER
      },
      averageReviewPoint: {
        type: DataTypes.FLOAT
      },
      price: {
        type: DataTypes.FLOAT
      },
      brandName: {
        type: DataTypes.STRING
      },
      merchantInfo: {
        type: DataTypes.STRING
      },
      featureBullets: {
        type: DataTypes.INTEGER
      },
      imageCount: {
        type: DataTypes.INTEGER
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE
    },
    {
      paranoid: true,
      underscored: true
    }
  );
  // Product.associate = function(models) {
  //   Product.hasMany(models.Rank, {as: 'rank', foreignKey: 'ASIN'});
  // }
  return Product;
};
