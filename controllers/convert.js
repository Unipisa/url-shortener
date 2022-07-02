const crypto = require('crypto')
// Include user model
const Url = require('../models/url')
const URL_REGEX = process.env.URLSHORTENER_URL_REGEX || "^https?:\/\/.*"
const URL_ERROR_MESSAGE = process.env.URLSHORTENER_URL_ERROR_MESSAGE || "url must start with http://... or https://..."

module.exports = {
  URL_REGEX,
  URL_ERROR_MESSAGE,
  getHome: (req, res) => {
    res.render('index', {
      URL_REGEX,
      URL_ERROR_MESSAGE
    })
  },
  getShortened: async (req, res) => {
    const inputUrl = req.query.url
    try {
      // Add server side validation
      console.log(`checking regexp ${URL_REGEX} against url "${inputUrl}"`)
      if (!inputUrl || (!inputUrl.match(new RegExp(URL_REGEX)))) {
        console.log("BAD URL REQUEST");
        res.json({ ok: false, error: URL_ERROR_MESSAGE });
        return;
      }
      // check if url exists in database
      let urlResult = await Url.findOne({ originalUrl: inputUrl })
      // if url already exist
      if (!urlResult) {
        var urlExists = null;
        do {
          // generate shortened url
          shortenedUrl = crypto.randomBytes(Math.ceil((5 * 3) / 4)).toString('base64').replace(/\+/g, '0').replace(/\//g, '0').slice(0, 5)
          shortenedUrl = shortenedUrl.replace('/\//g','@') // don't use '/' in urls... reserved for server pages
          // check if this url is unique
          urlExists = await Url.findOne({ shortenedUrl: shortenedUrl })
        } while(urlExists);

        // create new url document
        urlResult = await Url.create({
          originalUrl: inputUrl,
          shortenedUrl
        })
      }
        // redirect back to landing page
      res.json({ ok: true, url: urlResult.shortenedUrl })
    } catch (error) {
      console.log(error)
    }
  },
  getOriginal: (req, res) => {
    Url.findOne({ shortenedUrl: req.params.shortenedUrl })
      .then(data => {
        // no such url
        if (!data) { return res.redirect('/') }
        // url found, redirect to original url page
        res.redirect(data.originalUrl)
      })
  }
}