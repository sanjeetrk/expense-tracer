const UserModel = require('../models/User');

const addExpense=  async (req, res) => {
 const body= req.body;
 const {_id}= req.user;
 console.log(body, _id);

 try {
    const UserData= await UserModel.findByIdAndUpdate(_id, {$push: {expenses: body}}, {new: true});  
    return res.status(200).json({message: 'Expense added successfully', success: true, data: UserData?.expenses});

 } catch (error) {
    return res.status(500).json({message: "internal server error", success: false});
 }
}

const fetchExpenses= async (req, res) => {
    try {
        const {_id}= req.user;
        const UserData= await UserModel.findById(_id).select('expenses');
        return res.status(200).json({message: 'Expenses fetched successfully', success: true, data: UserData?.expenses});
        
    } catch (err) {
        return res.status(500).json({message: "internal server error", error: err, success: false});
    }
}

const deleteExpense= async (req, res) => {
    try {
        const {_id}= req.user;
        const {expenseId}= req.params;
        // const UserData= await UserModel.findById(_id);
        // UserData.expenses= UserData.expenses.filter((expense)=> expense._id.toString() !== expenseId);
        // await UserData.save();

        const UserData= await UserModel.findByIdAndUpdate(_id, {$pull: {expenses: {_id: expenseId}}}, {new: true}); 
        return res.status(200).json({message: 'Expense deleted successfully', success: true, data: UserData?.expenses});
        
    } catch (error) {
        return res.status(500).json({message: "internal server error",error: error, success: false});
    }
}

module.exports= {addExpense, fetchExpenses, deleteExpense}