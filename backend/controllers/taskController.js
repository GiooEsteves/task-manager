const Task = require("../models/Task");

// @desc get all tasks (admin: todos, user: assinantes)
// @route GET /api/tasks/
// @acess Private
const getTasks = async (req, res) => {
    try{
        const { status } = req.query;
        let filter = {};
        if(status){
            filter.status = status;
        }

        let tasks;
        if(req.user.role === 'admin'){
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        }else{
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImageUrl");
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter((item) => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pendente",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "Em Progresso",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Finalizado",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({ tasks, statusSummary: { all: allTasks, pendingTasks, inProgressTasks, completedTasks }, });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc get task by id
// @route GET /api/tasks/:id
// @acess Private
const getTaskById = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
        if(!task){
            return res.status(404).json({ message: "Task não encontrada" });
        }
        res.json(task);
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc create a new task
// @route POST /api/tasks/
// @acess Private (admin)
const createTask = async (req, res) => {
    try{
        const{
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "assignedTo deve ser um array de ID's de usuários" });
        }

        const task = await Task.create({
            title, 
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        });

        res.status(201).json({ message: "Task criada com sucesso", task });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc update task details
// @route PUT /api/tasks/:id
// @acess Private (admin)
const updateTask = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({ message: "Task não encontrada" });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({ message: "assignetTo precisa ser um array de ID's" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updateTask = await task.save();
        res.json({ message: "Task atualizada com sucesso", updateTask });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc delete a task
// @route DELETE /api/tasks/:id
// @acess Private (admin)
const deleteTask = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({ message: "Task não encontrada" });
        }

        await task.deleteOne();
        res.json({ message: "Task deletada com sucesso" });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc update task status
// @route PUT /api/tasks/:id/status
// @acess Private
const updateTaskStatus = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({ message: "Task não encontrada" });
        }

        const isAssigned = task.assignedTo.some((userId) => userId.toString() === req.user._id.toString());
        if(!isAssigned && req.user.role !== "admin"){
            return res.status(403).json({ message: "Não autorizado" });
        }

        task.status = req.body.status || task.status;
        if(task.status === "Finalizado"){
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Status da task foi atualizado", task });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc update task checklist
// @route PUT /api/tasks/:id/todo
// @acess Private
const updateTaskChecklist = async(req, res) => {
    try{
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({ message: "Task não encontrada" });
        }

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
            return res.status(403).json({ message: "Não autorizado para atualizar o checklist" });
        }

        task.todoChecklist = todoChecklist;

        // atualização do progresso baseado no andamento do checklist
        const completedCount = task.todoChecklist.filter((item) => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount/totalItems) * 100): 0;

        // atualização da task para finalizado quando todos os itens forem concluidos
        if(task.progress === 100){
            task.status = "Finalizado";
        }else if(task.progress > 0){
            task.status = "Em progresso";
        }else{
            task.status = "Pendente";   
        }

        await task.save();
        const updateTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

    res.json({ message: "Task checklist atualizado", task:updateTask });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc dashboard data (admin)
// @route GET /api/tasks/dashboard-data
// @acess Private
const getDashboardData = async(req, res) => {
    try{
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pendente" });
        const completedTasks = await Task.countDocuments({ status: "Finalizado" });
        const overdueTasks = await Task.countDocuments({ status: {$ne: "Finalizado"}, dueDate: {$lt: new Date()}, });

        const taskStatuses = ["Pendente", "Em progresso", "Finalizado"];
        const taskDistributionRaw = await Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, }, }, ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // remove espaços
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks; 

        const taskPriorities = ["Baixa", "Media", "Alta"];
        const taskPriorityLevelsRaw = await Task.aggregate([ {$group: {_id: "$priority", count: {$sum: 1},},}, ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");
        res.status(200).json({ 
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
         });
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

// @desc dashboard data (user)
// @route GET /api/tasks/user-dashboard-data
// @acess Private
const getUserDashboardData = async(req, res) => {
    try{
        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pendente" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Finalizado" });
        const overdueTasks = await Task.countDocuments({ assignedTo: userId, status: {$ne: "Finalizado"}, dueDate: {$lt: new Date()}, });

        const taskStatuses = ["Pendente", "Em progresso", "Finalizado"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: {assignedTo: userId} },
            { $group: {_id: "$status", count: {$sum: 1}} },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;
        const taskPriorities = ["Baixa", "Media", "Alta"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority )?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({ 
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        })
    }catch(error){
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getDashboardData, getUserDashboardData };