import React from 'react'

const ExpenseTable = ({ expenses, deleteExpense }) => {
    console.log("ExpenseTable----", expenses)
    return (
        <>

            <div className="expense-list">
                {expenses?.map((expense, index) => (
                    <div className="expense-item" key={index}>
                        <button onClick={() => deleteExpense(expense._id)} className="delete-button">X</button>
                        <div className="expense-description">{expense.text}</div>
                        <div className="expense-amount"
                        style={{color: expense.amount < 0 ? "red" : "green"}}

                        >{expense.amount}</div>
                    </div>
                ))}
            </div>

        </>
    )
}

export default ExpenseTable