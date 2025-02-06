import React, { useState } from 'react'
import { handleError} from '../utils';

const ExpenseTrackerForm = ({ addExpense }) => {
    const [ExpenseIfo, setExpenseIfo] = useState({
        text: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseIfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleExpense = async (e) => {
        e.preventDefault();
        console.log(ExpenseIfo);
        const { text, amount } = ExpenseIfo;
        if (!text || !amount) {
            handleError("All fields are required");
            return;
        }

        try {
            await addExpense(ExpenseIfo);
            setExpenseIfo({
                text: '',
                amount: ''
            });
        } catch (error) {
            handleError("Failed to add expense");
        }
    }

    return (
        <div className="container">
            <h2>Add New Expense</h2>
            <form onSubmit={handleExpense}>
                <div className="input-group">
                    <label htmlFor="email">Expense Description</label>
                    <input
                        type="text"
                        name="text"
                        value={ExpenseIfo.text}
                        onChange={handleChange}
                        placeholder="Enter your expense description"
                        required
                    />
                </div>

{/*                 <div className="input-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={ExpenseIfo.amount}
                        onChange={handleChange}
                        placeholder="Enter your amount , Expense(-v), Income(+v)"
                        required
                    />
                </div> */}

                <div className="input-group">
    <label htmlFor="amount">Amount</label>
    <input
        type="text"  // Changed from "number" to "text"
        inputMode="numeric"  // Hints mobile to show number keyboard
        name="amount"
        value={ExpenseIfo.amount}
        onChange={handleChange}
        placeholder="Enter your amount, Expense(-v), Income(+v)"
        pattern="^-?\d*\.?\d*$"  // Allows positive/negative numbers and decimals
        required
    />
</div>

                <button type="submit" className="login-button">
                    Add Expense
                </button>

            </form>

        </div>

    )
}

export default ExpenseTrackerForm
