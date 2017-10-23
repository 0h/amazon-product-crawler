var models = require("./../models"),
  sequelize = models.sequelize,
  Sequelize = models.Sequelize;

sequelize
  .sync()
  .then(res => {
    console.log("Database synced");
    console.log("Fetching product info...");
  })
  .catch(e => {
    console.log("Sync failed", e);
  });
  
const saveExtractedData = scrapedData => {
  scrapedData
    .then(data => {
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
            console.log("Product created Successfully, creating ranks");

            data.rank.forEach(rank => {
              models.Rank.create({
                rank: rank.Rank,
                category: rank.Category,
                ASIN: data.ASIN
              });
              console.log("Ranks created successfully");
            });
          }
        })
        .then(asin => {
          var flattenedASIN = [
            data.sponsored,
            data.sponsored2,
            data.alsoBought,
            data.alsoViewed
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
                  console.log("ASIN already exists");
                } else {
                  console.log("ASIN created");
                }
              });
          });
        });
    })
    .catch(e => {
      console.log(e);
    });
};

module.exports = { saveExtractedData };
