const jwt = require("jsonwebtoken");
const User = ("../models/User.js");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1]; // extract token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({message: "Não autorizado, sem token"});
        }
    }catch(error){
        res.status(401).json({message: "Token falhou", error: error.message});
    }
};

// middleware for admin only access
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: "Acesso negado! Apenas admins."});
    }
};

module.exports = { protect, adminOnly };