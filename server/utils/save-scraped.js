var models = require("./../models"),
  sequelize = models.sequelize,
  Sequelize = models.Sequelize;

const saveExtractedData = data => {
  models.Product
    .findOrCreate({
      where: {
        ASIN: data.ASIN
      },
      defaults: {
        title: data.title,
        ASIN: data.ASIN,
        reviewCount: data.reviewCount,
        averageReviewPoint: data.averageReviewPoint,
        price: data.price,
        brandName: data.brandName,
        merchantInfo: data.merchantInfo,
        featureBullets: data.featureBullets,
        imageCount: data.imageCount
      }
    })
    .spread((item, created) => {
      if (!created) {
        console.log("Product already exists");
      } else {
        console.log("Product created successfully");
        console.log("Creating ranks for categories...");

        data.rank.forEach(rank => {
          models.Rank.create({
            rank: rank.Rank,
            category: rank.Category,
            ASIN: data.ASIN
          });
          console.log("Rank created for new product");
        });
      }
    })
    .then(asin => {
      var flattenedASIN = [
        data.sponsored,
        data.sponsored2,
        data.alsoBought
      ].reduce(function(a, b) {
        return a.concat(b);
      });

      flattenedASIN.forEach(asin => {
        models.ASINList
          .findOrCreate({
            where: {
              ASIN: asin
            },
            defaults: {
              ASIN: asin,
              completed: 0
            }
          })
          .spread((item, created) => {
            if (!created) {
              process.stdout.write("-");
            } else {
              process.stdout.write("+");
            }
          });
      });
    })
    .catch(e => {
      console.log(e);
    });
};

module.exports = { saveExtractedData };
