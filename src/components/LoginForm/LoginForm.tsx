import { useState } from 'react';
import './loginform.css';

interface Props {
    login: () => void;
}

export default function LoginForm({ login }: Props) {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    return (
        <div className='sign-in-container'>
            <form className="form">
                <div className="flex-column">
                    <label>Username </label>
                </div>

                <div className="inputForm">
                    <input placeholder="Enter your Username" className="input" type="text"></input>
                </div>
                
                <div className="flex-column">
                    <label>Password </label>
                </div>

                <div className="inputForm">
                    <input placeholder="Enter your Password" className="input" type="password"></input>
                </div>
                
                <div className="flex-row"></div>
                <button className="button-submit" onClick={() => login()}>{isSignUp ? "Sign Up" : "Sign In"}</button>
                <p className="p">Don't have an account? <span className="span" onClick={() => setIsSignUp(true)}>Sign Up</span></p>
                <span className="pline" onClick={() => login()}>Play as guest</span>
                </form>
        </div>
    )
}