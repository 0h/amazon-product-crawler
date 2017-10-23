const { saveExtractedData } = require("./utils/save-scraped");
const { productScrape } = require("./utils/product-scraper");

const startPointASIN = "B01M0J0JAI";
const scrapedProduct = productScrape(startPointASIN);
saveExtractedData(scrapedProduct);


