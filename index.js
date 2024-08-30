const express = require("express");
const app = express();
const path = require("path")
const PORT = 8001;
const URL = require("./models/url.js")
const {connectToMongodb} = require("./connection")
const cookieParser = require("cookie-parser")
const {checkForAuthentication,restrictTo} = require("./middlewares/auth.js")

const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter.js")
const userRoute = require("./routes/user.js")

connectToMongodb("mongodb://127.0.0.1:27017/short-url")
.then(()=>console.log("MongoDb connected!"))

app.use(express.json()) // middleware
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthentication)

// server side rendering

//without ejs
// app.get("/test",async(req,res)=>{
//     const alllUrls = await URL.find({});
//     res.end(`
//         <html> 
//             <head></head>
//             <body>
//                 <ol>
//                     ${alllUrls.map(url => `<li>${url.shortId} -  ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
//                 </ol>
//             </body>
//         </html>
//     `)
// })

// with ejs
app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

// app.get("/test",async(req,res)=>{
//     const alllUrls = await URL.find({});
//     res.render("home",{
//         urls : alllUrls,
//     })
// })

 
app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRoute);
app.use("/",staticRoute);
app.use("/user",userRoute);


app.listen(PORT,()=>console.log(`server started at port : ${PORT}`));