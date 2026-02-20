import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, X, Edit2 } from 'lucide-react';

const TodoList = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Load tasks on mount
    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            setTasks(JSON.parse(saved));
        }
    }, []);

    // Save tasks on change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now().toString(),
            text: newTask.trim(),
            completed: false
        };

        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditText(task.text);
    };

    const saveEdit = (id) => {
        if (!editText.trim()) {
            deleteTask(id);
        } else {
            setTasks(tasks.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
        }
        setEditingId(null);
    };

    return (
        <div className="page-container animate-fade-in" style={{ maxWidth: '800px' }}>
            <header className="header-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/home')} className="btn btn-glass" style={{ padding: '0.5rem 0.75rem' }}>
                        <ArrowLeft size={18} />
                    </button>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        background: 'rgba(63, 185, 80, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)'
                    }}>
                        <Check size={20} />
                    </div>
                    <h1 className="title-gradient" style={{ margin: 0 }}>Todo List</h1>
                </div>
            </header>

            <main>
                <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done?"
                        style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem' }}
                    />
                    <button type="submit" className="btn" disabled={!newTask.trim()} style={{ background: 'var(--success-color)', padding: '0 2rem' }}>
                        <Plus size={20} />
                        Add
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tasks.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                                <Check size={32} />
                            </div>
                            <h3>All caught up!</h3>
                            <p>You have no tasks pending.</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="glass" style={{
                                display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem',
                                opacity: task.completed ? 0.6 : 1, transition: 'all 0.2s',
                                borderLeft: task.completed ? '4px solid var(--success-color)' : '4px solid transparent'
                            }}>

                                <button
                                    onClick={() => toggleTask(task.id)}
                                    style={{
                                        width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer',
                                        background: task.completed ? 'var(--success-color)' : 'transparent',
                                        border: `2px solid ${task.completed ? 'var(--success-color)' : 'var(--text-secondary)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white'
                                    }}
                                >
                                    {task.completed && <Check size={14} strokeWidth={3} />}
                                </button>

                                {editingId === task.id ? (
                                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                                            style={{ padding: '0.5rem' }}
                                        />
                                        <button onClick={() => saveEdit(task.id)} className="btn btn-glass" style={{ padding: '0.5rem' }}><Check size={16} color="var(--success-color)" /></button>
                                    </div>
                                ) : (
                                    <span style={{
                                        flex: 1, fontSize: '1.1rem',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                                    }}>
                                        {task.text}
                                    </span>
                                )}

                                {!editingId && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => startEdit(task)} className="btn btn-glass" style={{ padding: '0.5rem', border: 'none' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} className="btn btn-glass" style={{ padding: '0.5rem', border: 'none', color: 'var(--danger-color)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default TodoList;
