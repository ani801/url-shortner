const express=require("express")
const{ connectToMongoDB}=require("./connect")
const URL=require("./models/url")
const {handleGetAnalytis}=require("./controllers/url")
const cookieParser=require("cookie-parser")
const { restrictToLoggedinUserOnly}=require("./middlewares/auth")
//All routes.
const statiRoute=require("./routes/staticRouter")
const urlRoute=require("./routes/url")
const userRoute=require("./routes/user")

const path=require('path')
const app=express();
const PORT=8001;

 //Middlewaer
 app.use(express.urlencoded({extended:true}))  
 app.use(express.json())
 app.use(cookieParser())

app.use("/user",userRoute)
app.use("/url", restrictToLoggedinUserOnly,urlRoute)  
app.use("/",statiRoute) 

 

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));




// app.get("/:shortId",async(req,res)=>{
// const shortId=req.params.shortId
// const entry= await URL.findOneAndUpdate({shortId},{$push:{visitHistory:{timestamp:Date.now()}}})
// res.redirect(entry.redirectURL)
// })

app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        
        // Find the URL entry and update visit history
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
             // Returns the updated document
        );

        if (!entry) {
            // If no entry is found, send a 404 error
            return res.status(404).send('URL not found');
        }

        // Redirect to the original URL
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error handling redirect:", error);
        // Send a 500 internal server error response
        res.status(500).send('Internal Server Error');
    }
});



app.get("/analytics/:shortId",handleGetAnalytis)

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("Mongodb connected")
}).catch((err)=>{
    console.log("Error",err)
})

app.listen(PORT,()=>{console.log(`Server started at port: ${PORT}`)});