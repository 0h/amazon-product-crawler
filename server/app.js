var models = require("./models"),
  sequelize = models.sequelize,
  Sequelize = models.Sequelize;

const { saveExtractedData } = require("./utils/save-scraped");
const { productScrape } = require("./utils/product-scraper");

const startPointASIN = "B072PRMXMF";

const start = async () => {
  try {
    await sequelize
    .sync()
    .then(res => {
      console.log("\nDatabase syncronization completed");
      console.log("Fetching product info...");
    })

    const item = await models.ASINList.findOne({
      where: {
        completed: 0
      }
    });

    const scrapedProduct = await productScrape(item.dataValues.ASIN);
    saveExtractedData(scrapedProduct);
    item.completed = 1;
    item.save();
  } catch (e) {
    console.log(e);
  }
};
start();
// setInterval(start, 30000);
