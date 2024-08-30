const {getUser} = require("../services/auth")

function checkForAuthentication(req,res,next){
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if(!tokenCookie){
        return next();
    }
    
    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    return next();
}

function restrictTo(roles = []){
    return function(req,res,next){
        if(!req.user) return res.redirect("/login");
        if(!roles.includes(req.user.role)) return res.end("UnAuthorised");
        return next();
    }
}

// stateless authentication using headers
// async function restrictToLoggedinUserOnly(req,res,next){
//     const userUid = req.headers["authorization"];
//     if(!userUid){
//         return res.redirect("/login") 
//     }

//     const token = userUid.split('Bearer ')[1]; // "Bearer [515432665667217282367]"
//     const user = getUser(token)

//     if(!user){
//         return res.redirect("/login")
//     }
//     req.user = user;
//     next();
// }

// async function checkAuth(req,res,next){
//     console.log(req.headers)
//     const userUid = req.headers["authorization"];
//     if(!userUid){
//         req.user = null;
//         return next();
//     }
//     const token = userUid.split('Bearer ')[1]; 
//     const user = getUser(token)

//     req.user = user;
//     next();
// }

// stateless authentication using cookies
// async function restrictToLoggedinUserOnly(req,res,next){
//     const userUid = req.cookies?.uid;
//     if(!userUid){
//         return res.redirect("/login") 
//     }
//     const user = getUser(userUid)
//     if(!user){
//         return res.redirect("/login")
//     }
//     req.user = user;
//     next();
// }

// async function checkAuth(req,res,next){
//     const userUid = req.cookies?.uid;

//     const user = getUser(userUid)

//     req.user = user;
//     next();
// }

module.exports = {checkForAuthentication,restrictTo};