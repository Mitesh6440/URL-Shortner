const express = require("express")

const router = express.Router();
const {handleGenerateNewShortUrl,handleRedirectToUrlUsingShortID,handleGetAnalytics} = require("../controllers/url")

router.route("/")
.post(handleGenerateNewShortUrl)

router.get("/:shortId",handleRedirectToUrlUsingShortID)

router.get("/analytics/:shortId",handleGetAnalytics)


module.exports = router;