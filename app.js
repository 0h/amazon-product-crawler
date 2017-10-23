var models = require("./models"),
        sequelize = models.sequelize,
        Sequelize = models.Sequelize;

const { saveExtractedData } = require("./utils/save-scraped");
const { productScrape } = require("./utils/product-scraper");

const startPointASIN = "B072PRMXMF";
const scrapedProduct = productScrape(startPointASIN);

// saveExtractedData(scrapedProduct)

const start = () => {
  models.ASINList.findOne({
    where: {
      completed:0
    }
  }).then((item) => {
    var ASIN = item.toJSON().ASIN
    var newProduct = productScrape(ASIN)
    saveExtractedData(newProduct)
    item.completed = 1
    item.save()
  })
}

setInterval(start, 30000); 
