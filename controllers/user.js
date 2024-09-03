const User=require("../models/user")
const{v4:uuidv4}=require("uuid")
const{setUser}=require("../service/auth")




async function handleUserSignup(req,res) {
    const data= req.body
    if(!data) return res.status(400).json({error:"User is required"})
    console.log(`hello from controller/user ${data.name}`)
    await User.create({
        name:data.name,
        email:data.email,
        password:data.password
    })
    return res.redirect("/")
}



async function handleUserLogin(req,res) {
    const data= req.body
    if(!data) return res.status(400).json({error:"Logindata is required"})
   const email=data.email
   const password=data.password
 const user=await User.findOne({email,password})
 if(!user) return res.render("login",{error:"Invalid Username or Password."})

    const sessionId=uuidv4()
    setUser(sessionId,user)
    res.cookie("uid",sessionId)
    return res.redirect("/")
}


module.exports={
    handleUserSignup,
    handleUserLogin
};