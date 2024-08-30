const shortid = require("shortid")
const URL = require("../models/url.js")

async function handleGenerateNewShortUrl(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error : "url is required"})
    const shortId = shortid();
    await URL.create({
        shortId : shortId,
        redirectURL : body.url,
        visitHistory : [],
        createdBy : req.user._id,
    })

    return res.render("home",{id : shortId})
    // return res.json({id : shortId});
}

async function handleRedirectToUrlUsingShortID(req,res){
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },
    {
        $push:{
            visitHistory :{
                timestamp : Date.now()
            }
        },
    });
    res.redirect(entry.redirectURL)
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId})
    res.json({count : result.visitHistory.length})
}

module.exports = {handleGenerateNewShortUrl,handleRedirectToUrlUsingShortID,handleGetAnalytics}