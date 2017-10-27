const cheerio = require("cheerio");
const axios = require("axios");

const productScrape = async asin => {
  const response = await axios({
    url: "http://www.amazon.com/dp/" + asin,
    header: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    },
    method: "get"
  });

  var $ = cheerio.load(response.data);
  var price;

  if ($("#priceblock_ourprice").length) {
    price = parseFloat(
      $("#priceblock_ourprice")
        .text()
        .substring(1)
    );
  } else if ($("#priceblock_saleprice").length) {
    price = parseFloat(
      $("#priceblock_saleprice")
        .text()
        .substring(1)
    );
  } else {
    price = 0.0;
  }

  var alsoBought = $("div#session-sims-feature-1").length ? $("div#p13n-m-purchase-sims-feature-1") : $("div#p13n-m-purchase-sims-feature-2")

  const result = {
    title: $("#productTitle")
      .text()
      .trim(),
    ASIN: $("#averageCustomerReviews").attr("data-asin"),
    reviewCount: parseInt(
      $("#acrCustomerReviewText")
        .text()
        .replace(/(^\d+)(.+$)/i, "$1")
    ),
    averageReviewPoint: parseFloat(
      $("#acrPopover")
        .text()
        .trim()
        .substring(0, 3)
    ),
    price: price,
    brandName: $("#bylineInfo").text(),
    merchantInfo: $("#merchant-info")
      .children()
      .first()
      .text(),
    featureBullets: $("#feature-bullets li")
      .map(function() {
        return $(this)
          .text()
          .replace(/[\n\t\r]/g, "")
          .trim();
      })
      .toArray()
      .splice(1).length,
    imageCount: $("#altImages li.a-spacing-small.item").length,
    rank: $("th:contains('Best Sellers Rank')")
      .next()
      .children()
      .children()
      .map(function() {
        if ($(this).text() !== "") {
          return {
            Rank: $(this)
              .text()
              .substring(1)
              .replace(/,/g, "")
              .replace(/ *\([^)]*\) */g, "")
              .replace(/(^\d+)(.+$)/i, "$1"),
            Category: $(this)
              .text()
              .substring(1)
              .replace(/,/g, "")
              .replace(/ *\([^)]*\) */g, "")
              .replace(/^([^ ]+ ){2}/, "")
          };
        }
      })
      .toArray(),
    sponsored: $("div#sp_detail")
      .attr("data-a-carousel-options")
      .split('\\"')
      .filter(el => el.length === 10 && el[0] === "B"),
    sponsored2: $("div#sp_detail2")
      .attr("data-a-carousel-options")
      .split('\\"')
      .filter(el => el.length === 10 && el[0] === "B"),
    alsoBought: alsoBought
      .children()
      .children()
      .next()
      .children()
      .attr("data-a-carousel-options")
      .split('"')
      .filter(el => el.length === 10 && el[0] === "B"),
  }
  return result
};

module.exports = { productScrape };
