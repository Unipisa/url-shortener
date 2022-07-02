const crypto = require('crypto')
// Include user model
const Url = require('../models/url')

// settings from environment variables
const SETTINGS = {
  URL_REGEX: process.env.URL_SHORTENER_URL_REGEX || "^https?:\/\/.*",
  URL_ERROR_MESSAGE: process.env.URL_SHORTENER_URL_ERROR_MESSAGE || "url must start with http://... or https://...",
  QR_WIDTH: parseInt(process.env.URL_SHORTENER_QR_WIDTH || "300"),
  QR_HEIGHT: parseInt(process.env.URL_SHORTENER_QR_HEIGHT || "300"),
  QR_TYPE: process.env.URL_SHORTENER_QR_TYPE || "svg",
  QR_IMAGE_MARGIN: parseInt(process.env.URL_SHORTENER_QR_IMAGE_MARGIN || "10"),
  QR_DOTS_COLOR: process.env.URL_SHORTENER_QR_DOTS_COLOR || "#4267b2" ,
  QR_DOTS_TYPE: process.env.URL_SHORTENER_QR_DOTS_TYPE || "rounded",
  QR_BG_COLOR: process.env.URL_SHORTENER_QR_BG_COLOR || "#e9ebee",
  QR_IMAGE: process.env.URL_SHORTENER_QR_IMAGE || "https://upload.wikimedia.org/wikipedia/commons/1/1b/Font_Awesome_5_solid_link.svg",
// "/images/cherubino_pant541.png"
}

module.exports = {
  SETTINGS,
  getHome: (req, res) => {
    res.render('index', { SETTINGS })
  },
  getShortened: async (req, res) => {
    const inputUrl = req.query.url
    try {
      // Add server side validation
      console.log(`checking regexp ${SETTINGS.URL_REGEX} against url "${inputUrl}"`)
      if (!inputUrl || (!inputUrl.match(new RegExp(SETTINGS.URL_REGEX)))) {
        console.log("BAD URL REQUEST");
        res.json({ ok: false, error: SETTINGS.URL_ERROR_MESSAGE });
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