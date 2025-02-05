const router= require('express').Router();
const { addExpense, fetchExpenses, deleteExpense } = require('../controllers/expenseController');

router.post('/',addExpense);
router.get('/',fetchExpenses);
router.delete('/:expenseId',deleteExpense);

module.exports=router;