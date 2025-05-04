import { useState } from 'react';
import './loginform.css';

interface Props {
    login: (username: string) => void;
}

export default function LoginForm({ login }: Props) {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error || "Login failed");
                return;
            }

            login(data.username);

        } catch (err) {
            setError("Network error. Please try again.");
            console.error('Login error:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const inputClass = error ? "input error" : "input";

    return (
        <div className='sign-in-container'>
            <form className="form" onSubmit={handleSubmit}>
                <div className="flex-column">
                    <label>Username</label>
                </div>

                <div className={`inputForm ${error ? 'error' : ''}`}>
                    <input 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your Username" 
                        className={inputClass}
                        type="text"
                        required
                    />
                </div>
                
                <div className="flex-column">
                    <label>Password</label>
                </div>

                <div className={`inputForm ${error ? 'error' : ''}`}>
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your Password" 
                        className={inputClass}
                        type="password"
                        required
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="flex-row"></div>
                <button className="button-submit" type="submit">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </button>
                <p className="p">Don't have an account? 
                    <span className="span" onClick={() => setIsSignUp(true)}>Sign Up</span>
                </p>
                <span className="pline" onClick={() => login("Guest")}>Play as guest</span>
            </form>
        </div>
    );
}