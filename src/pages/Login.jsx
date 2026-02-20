import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            // Dummy auth validation for any credentials
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            navigate('/home');
        }
    };

    return (
        <div className="page-container flex-center" style={{ minHeight: '100vh', padding: 0 }}>
            <main className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="flex-center" style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'var(--accent-color)', margin: '0 auto 1.5rem auto',
                        boxShadow: '0 8px 32px rgba(88, 166, 255, 0.4)'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 className="title-gradient">Welcome back</h1>
                    <p>Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ position: 'relative' }}>
                            <Key size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}>
                        Sign in
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Login;
