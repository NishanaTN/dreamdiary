import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, CheckSquare, LogOut, PieChart } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userEmail')?.split('@')[0] || 'User';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <div className="page-container animate-fade-in">
            <header className="header-nav">
                <div>
                    <h1 className="title-gradient" style={{ marginBottom: '0.25rem' }}>Good day, {userName}</h1>
                    <p>What would you like to focus on today?</p>
                </div>
                <button onClick={handleLogout} className="btn btn-glass" title="Sign out">
                    <LogOut size={18} />
                    <span>Sign out</span>
                </button>
            </header>

            <main style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '2rem'
            }}>
                {/* Journal Card */}
                <div
                    className="glass-card"
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                    onClick={() => navigate('/journal')}
                >
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: 'rgba(88, 166, 255, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                        color: 'var(--accent-color)'
                    }}>
                        <Book size={28} />
                    </div>
                    <h2>Personal Journal</h2>
                    <p style={{ flex: 1, marginBottom: '2rem' }}>
                        A quiet space to capture your thoughts, reflect on your day, and express yourself freely.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-color)', fontWeight: 500 }}>
                        Open Journal <span style={{ marginLeft: '0.5rem' }}>→</span>
                    </div>
                </div>

                {/* Todo Card */}
                <div
                    className="glass-card"
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                    onClick={() => navigate('/todo')}
                >
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: 'rgba(63, 185, 80, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                        color: 'var(--success-color)'
                    }}>
                        <CheckSquare size={28} />
                    </div>
                    <h2>Task Manager</h2>
                    <p style={{ flex: 1, marginBottom: '2rem' }}>
                        Stay organized and boost your productivity by keeping track of what needs to be done.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--success-color)', fontWeight: 500 }}>
                        Open Tasks <span style={{ marginLeft: '0.5rem' }}>→</span>
                    </div>
                </div>

                {/* Analytics Card */}
                <div
                    className="glass-card"
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                    onClick={() => navigate('/analytics')}
                >
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: 'rgba(168, 85, 247, 0.08)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                        color: 'var(--accent-color)'
                    }}>
                        <PieChart size={28} />
                    </div>
                    <h2>Mood Analytics</h2>
                    <p style={{ flex: 1, marginBottom: '2rem' }}>
                        Visualize your moods from saved diary entries and find your happiest day.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-color)', fontWeight: 500 }}>
                        View Analytics <span style={{ marginLeft: '0.5rem' }}>→</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
