import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import placeholderImage from "../assets/place100.png";
import "./Home.css";
import ExpenseTable from "./ExpenseTable";
import ExpenseTrackerForm from "./ExpenseTrackerForm";
import ExpenseDetail from "./ExpenseDetail";

export const Home = () => {
  const [user, setUser] = useState(null);
  const [Expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const amount = Expenses.map((item) => item.amount);
    console.log(amount);

    const income = amount.filter((item) => item > 0).reduce((acc, item) => (acc += item), 0);
    console.log("income----", income);

    const expense = amount.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1;
    console.log("expense----", expense);

    setExpenseAmount(expense);
    setIncomeAmount(income);


  }, [Expenses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleSuccess("Logout Success");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const fetchExpenses = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);
      if (response.status == 403) {
        navigate("/login");
        return;

      }
      const result = await response.json();
      console.log('Expenses data:', result); // Debug log
      if (result.success && Array.isArray(result.data)) {
        setExpenses(result.data);
      } else {
        console.error('Unexpected expenses data structure:', result);
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  const addExpense = async (expense) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/expenses`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess("Expense added successfully.");
        fetchExpenses();
      } else {
        console.error("Error adding expense:", result);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      localStorage.setItem("darkMode", !prevMode);
      return !prevMode;
    });
  };

  const DeleteExpense = async (expenseId) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/expenses/${expenseId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (response.status == 403) {
        navigate("/login");
        return;
      }
      const result = await response.json();

      console.log(result.data);
      setExpenses(result.data);
      handleSuccess("Expense deleted successfully");

    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>

      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {user && (
        <div className="user-profile">
          <img
            src={user.Image || placeholderImage}
            alt={`${user.name}'s profile`}
            className="profile-image"
            onError={(e) => {
              console.log('Image load error, using fallback');
              e.target.src = placeholderImage;
            }}
          />
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

        </div>

      )}
      <ExpenseDetail incomeAmt={incomeAmount} expenseAmt={expenseAmount} />

      <ExpenseTrackerForm addExpense={addExpense} />

      <ExpenseTable deleteExpense={DeleteExpense} expenses={Expenses} />

      <ToastContainer />
    </div>
  );
};

export default Home;
