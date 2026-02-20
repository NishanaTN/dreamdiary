import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';

// Using the provided Gemini API Key
const GEMINI_API_KEY = "AIzaSyDOZ4vK2LeElCqjHNBZZHN1CW6xLEO43jM";

const Journal = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entry, setEntry] = useState('');
    const [sketchUrl, setSketchUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Format date for storage key (YYYY-MM-DD)
    const getStorageKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Load entry and sketch for the currently selected date
    useEffect(() => {
        const savedDataStr = localStorage.getItem('journalData');
        if (savedDataStr) {
            const savedData = JSON.parse(savedDataStr);
            const key = getStorageKey(selectedDate);
            const dayData = savedData[key] || { text: '', sketch: '' };
            setEntry(dayData.text || '');
            setSketchUrl(dayData.sketch || '');
        } else {
            // Fallback for old data format
            const oldEntriesStr = localStorage.getItem('journalEntries');
            if (oldEntriesStr) {
                const oldEntries = JSON.parse(oldEntriesStr);
                const key = getStorageKey(selectedDate);
                setEntry(oldEntries[key] || '');
            } else {
                setEntry('');
            }
            setSketchUrl('');
        }
    }, [selectedDate]);

    // Helper to convert Blob to Base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const generateSketch = async (text) => {
        setIsGenerating(true);
        setErrorMsg('');

        try {
            const prompt = `A beautiful, gentle, artistic sketch illustration representing this diary entry: "${text}". Make it look like a memory drawing in a journal.`;

            const response = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: prompt })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Hugging Face API Error:", errorData);
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            // The Hugging Face inference API returns a raw image blob
            const blob = await response.blob();
            const base64Image = await blobToBase64(blob);
            return base64Image;

        } catch (error) {
            console.error("Failed to generate sketch via HF:", error);
            setErrorMsg(`Could not generate image: ${error.message}. Saving text only.`);
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        const savedDataStr = localStorage.getItem('journalData');
        const savedData = savedDataStr ? JSON.parse(savedDataStr) : {};
        const key = getStorageKey(selectedDate);

        // Check if we need to generate a new sketch BEFORE updating savedData
        const previousText = savedData[key]?.text || '';
        const needsNewSketch = entry.trim().length > 10 && (!sketchUrl || entry !== previousText);

        // Save text immediately so it's not lost if image generation takes time
        savedData[key] = {
            text: entry,
            sketch: sketchUrl // preserve existing sketch while generating new one
        };
        localStorage.setItem('journalData', JSON.stringify(savedData));

        // Generate a new sketch if the entry has changed significantly or if we don't have one
        if (needsNewSketch) {
            const fetchedSketch = await generateSketch(entry);
            if (fetchedSketch) {
                // Update with new sketch
                setSketchUrl(fetchedSketch);

                // Re-fetch from localStorage to ensure we don't overwrite changes that happened during generation
                const latestDataStr = localStorage.getItem('journalData');
                const latestData = latestDataStr ? JSON.parse(latestDataStr) : {};

                if (!latestData[key]) latestData[key] = { text: entry };
                latestData[key].sketch = fetchedSketch;

                localStorage.setItem('journalData', JSON.stringify(latestData));
            }
        }

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handlePrevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        setSelectedDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
    };

    const isToday = getStorageKey(selectedDate) === getStorageKey(new Date());

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <header className="header-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/home')} className="btn btn-glass" style={{ padding: '0.5rem 0.75rem' }}>
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="title-gradient" style={{ margin: 0 }}>Journal Entry</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={handlePrevDay} className="btn btn-glass" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                        <ChevronLeft size={18} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', minWidth: '200px', justifyContent: 'center' }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{formattedDate}</span>
                    </div>

                    <button
                        onClick={handleNextDay}
                        className="btn btn-glass"
                        disabled={isToday}
                        style={{
                            padding: '0.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            opacity: isToday ? 0.3 : 1,
                            cursor: isToday ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            <main className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
                    <FileText size={20} />
                    <h3 style={{ margin: 0, fontWeight: 500 }}>Dear Diary...</h3>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder={isToday ? "What's on your mind today? (e.g., 'I go to the park with my father')" : "No entry for this day."}
                        style={{
                            flex: '1 1 500px',
                            background: 'rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            padding: '1.5rem',
                            resize: 'none',
                            minHeight: '400px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            borderRadius: '12px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />

                    {/* AI Sketch Section */}
                    <div style={{
                        flex: '1 1 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <ImageIcon size={18} />
                            <h4 style={{ margin: 0, fontWeight: 500 }}>Memory Sketch (AI)</h4>
                        </div>

                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            minHeight: '250px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {isGenerating ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--accent-color)', padding: '2rem', textAlign: 'center' }}>
                                    <Loader2 className="animate-spin" size={32} />
                                    <span style={{ fontSize: '0.9rem' }}>Drawing your memory... this may take a few seconds.</span>
                                </div>
                            ) : sketchUrl ? (
                                <img
                                    src={sketchUrl}
                                    alt="AI generated memory sketch"
                                    className="animate-fade-in"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                        {entry.length < 10
                                            ? "Write a detailed entry to generate a memory sketch..."
                                            : "Save your entry to draw it!"}
                                    </p>
                                    {errorMsg && <p style={{ color: 'var(--danger-color, #ff6b6b)', fontSize: '0.8rem', marginTop: '1rem' }}>{errorMsg}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', alignItems: 'center', gap: '1rem' }}>
                    {isSaved && <span className="animate-fade-in" style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>Entry saved!</span>}
                    <button
                        onClick={handleSave}
                        className="btn"
                        disabled={!entry.trim() || isGenerating}
                        style={{ padding: '0.75rem 1.5rem' }}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Entry
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Journal;
