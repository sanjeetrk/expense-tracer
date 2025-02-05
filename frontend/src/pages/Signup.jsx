import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
import { useNavigate } from 'react-router-dom'




export const Signup = () => {
    const [Signupinfo, setSignupinfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupinfo = { ...Signupinfo };
        copySignupinfo[name] = value;
        setSignupinfo(copySignupinfo);
        console.log(Signupinfo);

        // console.log(name, value);

    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = Signupinfo;
        if (!name || !email || !password) {
            return handleError("All fields are required");

        }
        try {
            const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Signupinfo)
            })
            const result = await response.json();
            const { message, success, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/login")

                }, 1000)
            } else if (error) {
                const details = error?.details[0]?.message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }



            console.log(result);
        } catch (error) {
            handleError(error.message);
        }

    }

    return (
        <div>

            <div className="container">
                <h1>Signup</h1>
                <form onSubmit={handleSignup} action="POST">

                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="name"
                            autoFocus
                            value={Signupinfo.name}
                            placeholder='Enter your name...'
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="email"
                            value={Signupinfo.email}
                            placeholder='Enter your email...'
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={Signupinfo.password}
                            placeholder='Enter your password...'
                        />
                    </div>

                    <button>Signup</button>
                    <span>Already have an account? <a href="/login">Login</a></span>
                </form>
                <ToastContainer />
            </div>

        </div>
    )
}

export default Signup
