const puppeteer = require('puppeteer')

module.exports = function(
  model = {},
  url = ''
) {

  return (async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    //const browser = await puppeteer.launch()
    const page = await browser.newPage()
    //const browser = await puppeteer.launch({args: ['--no-sandbox']});
    await page.goto(url, {waitUntil: 'networkidle2'})

    const block = await page.evaluate(
      (model, url) => {
 
        const getValues = selectors => selectors.reduce(
          (acc, selector) => [
            ...acc,
            ...Array.from(
              selector.type === 'css'
              ? document.querySelectorAll(selector.selector)
              : queryXPathAll(selector.selector)
            ).map(
              tag => tag.textContent.replace(/\s(\s+)/g, '').trim()
            ).filter(
              text => text
            )
          ],
          []
        )

        const queryXPathAll = path => {

          const nodes = []
          const xpath = document.evaluate(
            path,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          )

          for (let i = 0; i < xpath.snapshotLength; i++) {

            nodes.push(xpath.snapshotItem(i))

          }

          return nodes

        }

        const output = {}

        output.url = url

        for (let data in model) {

          if (data !== 'domain' && data !== 'urls') {

            output[data] = getValues(model[data])

          }

        }

        return output

      },
      model,
      url
    )

    await browser.close()

    return block

  })()

}
