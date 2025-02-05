import React from 'react'

const ExpenseDetail = ({ incomeAmt, expenseAmt }) => {
    return (
        <>
            <div className="amounts-container">
                Income
                <span className="income-amount">{incomeAmt}</span>
                Expense
                <span className="expense-amount">{expenseAmt}</span>


            </div>

        </>
    )
}

export default ExpenseDetail