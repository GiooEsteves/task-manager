const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Gera o JWT token
const generateToken = (userId) => {
    return jwt.sign({ id:userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const regsisterUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Checa se o usuario existe
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({message: "Usuário já existe"});
        }

        // Determina o tipo de usuario, admin se o token correto for fornecido senao membro
        let role = "membro";
        if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
            role = "admin";
        }    

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criação de novo usuario 
        const user = await User.create({
            name,
            email, 
            password: hashedPassword,
            profileImageUrl,
            role
        });

        // Retorna as informações dos dados
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch(error){
        res.status(500).json({message:"Erro no servidor", error: error.message});
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "E-mail ou senha Inválido" });
        }

        // Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "E-mail ou senha Inválido" });
        }

        // Retorna informações do usuário
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profileImageUrl,
          token: generateToken(user._id),  
        });
    } catch(error){
        res.status(500).json({message:"Erro no servidor", error: error.message});
    }
};

// @desc GET user profile
// @route GET /api/auth/profile
// @access Private (requires JWT)
const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json(user);
    } catch(error){
        res.status(500).json({message:"Erro no servidor", error: error.message});
    }
};

// @desc Update user profile 
// @route PUT /api/auth/profile
// @access Private (requires JWT)
const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updateUser = await user.save();
        res.json({
            _id: updateUser.id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToken(updateUser._id),
        });
    } catch(error){
        res.status(500).json({message:"Erro no servidor", error: error.message});
    }
};

module.exports = { regsisterUser, loginUser, getUserProfile, updateUserProfile };