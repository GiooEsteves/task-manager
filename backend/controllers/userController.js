const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc get all users
// @route GET /api/users/
// @acess Private (admin)
const getUsers = async (req, res) => {
    try{
        const users = await User.find({ role: "membro" }).select("-password");

        // Adiciona contador de tasks para cada usuário
        const usersWithTaskCounts = await Promise.all(users.map(async (user) =>{
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pendente" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "Em progresso" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Finalizado" });

            return{
                ...user._doc, // adiciona todas as informações do usuário
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

        res.json(usersWithTaskCounts);
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc 
// @route GET /api/users/:id
// @acess Private
const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json(user);
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

module.exports = { getUsers, getUserById };