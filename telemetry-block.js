
const scraper = require('./scrape.js')
const models = require('./models.js')

var lastHeight = 1137222

const processModels = models => Promise.all(
  models.map(model => processLinks(model, model.urls))
).then(
  block => {
      var stringHeight = (block[0][0].abv[0]);
      var height = stringHeight.match(/\d/g);
      var height = parseInt(height.join(""));
      if (height > lastHeight) {
        console.log(height);
      } else {
        console.log(0);
      }
      
  }
)

const processLinks = (model, urls) => Promise.all(
  urls.map(url => scraper(model, url))
)

processModels(models)
