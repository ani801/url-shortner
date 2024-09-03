const shortid=require("shortid");
const URL=require("../models/url")
async function handleGenerateNewShortUrl(req,res) {
    const body=req.body
    if(!body.url) return res.status(400).json({error:"Url is required"})
    const shortId=shortid()
    await URL.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[]

    })

    return res.render("home",{id:shortId})
}

async function handleGetAnalytis(req,res) {
    const shortId=req.params.shortId
   const rese= await URL.findOne({shortId})
   return res.json({TotalCliks:rese.visitHistory.length,
    Analytics:rese.visitHistory
    
   })
}

module.exports={
    handleGenerateNewShortUrl,
    handleGetAnalytis
}