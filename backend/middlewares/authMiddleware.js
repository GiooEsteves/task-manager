const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Middleware para protejer as rotas
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

// Middleware para acesso de admin
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: "Acesso negado! Apenas admins."});
    }
};

module.exports = { protect, adminOnly };