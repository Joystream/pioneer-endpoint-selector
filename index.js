
const scraper = require('./scrape.js')
const models = require('./models.js')

const processModels = models => Promise.all(
  models.map(model => processLinks(model, model.urls))
).then(
  block => console.log((block[0][0].abv[0]))
)

const processLinks = (model, urls) => Promise.all(
  urls.map(url => scraper(model, url))
)

processModels(models)