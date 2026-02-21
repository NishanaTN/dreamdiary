import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, Mic } from 'lucide-react';

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
    const [moodInfo, setMoodInfo] = useState({ moods: [], suggestion: '' });
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef(null);

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

    // Mood detection helpers
    const MOOD_KEYWORDS = {
        happy: ['happy', 'joy', 'glad', 'pleased', 'cheerful'],
        sad: ['sad', 'unhappy', 'sorrow', 'cry', 'tears'],
        calm: ['calm', 'peaceful', 'relaxed'],
        love: ['love', 'loved', 'loving', 'affection'],
        romantic: ['romantic', 'romance', 'date', 'kiss'],
        angry: ['angry', 'anger', 'mad', 'furious'],
        depression: ['depressed', 'depression', 'hopeless'],
        pressure: ['pressure', 'pressured', 'burdened'],
        stress: ['stress', 'stressed', 'anxious']
    };

    const PLEASANT_PHRASES = [
        'You are not alone — you are cared for.',
        'Take a deep breath; this moment will pass.',
        'You are stronger than you realize.',
        'Small steps forward are still progress.',
        'You deserve kindness — especially from yourself.'
    ];

    const detectMoods = (text) => {
        const lc = (text || '').toLowerCase();
        const found = new Set();
        for (const [mood, words] of Object.entries(MOOD_KEYWORDS)) {
            for (const w of words) {
                const re = new RegExp(`\\b${w}\\b`, 'i');
                if (re.test(lc)) {
                    found.add(mood);
                    break;
                }
            }
        }

        const moods = Array.from(found);
        const sadRelated = moods.includes('sad') || moods.includes('depression') || moods.includes('stress') || moods.includes('pressure') || moods.includes('angry');
        const suggestion = sadRelated ? PLEASANT_PHRASES : [];
        return { moods, suggestion };
    };

    // Update mood info as the user types
    useEffect(() => {
        setMoodInfo(detectMoods(entry));
    }, [entry]);

    // Speech recognition (voice-to-text) helpers
    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorMsg('Speech recognition not supported in this browser.');
            return;
        }

        try {
            const rec = new SpeechRecognition();
            rec.lang = 'en-US';
            rec.interimResults = true;
            rec.continuous = true;

            rec.onresult = (e) => {
                let interim = '';
                let finalTranscript = '';
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    const res = e.results[i];
                    if (res.isFinal) finalTranscript += res[0].transcript;
                    else interim += res[0].transcript;
                }

                if (finalTranscript) {
                    setEntry(prev => (prev ? prev + ' ' : '') + finalTranscript.trim());
                }
                setInterimTranscript(interim);
            };

            rec.onerror = (ev) => {
                console.error('Speech recognition error', ev);
                setErrorMsg('Speech recognition error: ' + (ev.error || 'unknown'));
                stopRecognition();
            };

            rec.onend = () => {
                setIsRecording(false);
                recognitionRef.current = null;
                setInterimTranscript('');
            };

            recognitionRef.current = rec;
            rec.start();
            setIsRecording(true);
            setInterimTranscript('');
        } catch (err) {
            console.error('Failed to start speech recognition', err);
            setErrorMsg('Failed to start speech recognition');
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { console.warn(e); }
            recognitionRef.current = null;
        }
        setIsRecording(false);
        setInterimTranscript('');
    };

    // One-shot voice -> text -> sketch flow (non-intrusive: does not replace existing voice input)
    const voiceToSketch = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorMsg('Speech recognition not supported in this browser.');
            return;
        }

        let finalTranscript = '';
        setErrorMsg('');
        setIsGenerating(true);

        try {
            const rec = new SpeechRecognition();
            rec.lang = 'en-US';
            rec.interimResults = false; // we only need final result for prompt
            rec.continuous = false;

            rec.onresult = (e) => {
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    const res = e.results[i];
                    if (res.isFinal) finalTranscript += res[0].transcript;
                }
            };

            rec.onerror = (ev) => {
                console.error('Speech recognition error', ev);
                setErrorMsg('Speech recognition error: ' + (ev.error || 'unknown'));
                setIsGenerating(false);
            };

            rec.onend = async () => {
                const trimmed = finalTranscript.trim();
                if (trimmed) {
                    // append transcript to entry (preserve existing behavior)
                    setEntry(prev => (prev ? prev + ' ' : '') + trimmed);

                    // use transcript as prompt to generate sketch
                    const fetchedSketch = await generateSketch(trimmed);
                    if (fetchedSketch) {
                        setSketchUrl(fetchedSketch);

                        // persist sketch for selected date
                        const savedDataStr = localStorage.getItem('journalData');
                        const savedData = savedDataStr ? JSON.parse(savedDataStr) : {};
                        const key = getStorageKey(selectedDate);
                        if (!savedData[key]) savedData[key] = { text: (savedData[key] && savedData[key].text) || '' };
                        savedData[key].sketch = fetchedSketch;
                        savedData[key].text = (savedData[key].text || '') + (trimmed ? (' ' + trimmed) : '');
                        localStorage.setItem('journalData', JSON.stringify(savedData));
                    }
                } else {
                    setErrorMsg('No speech detected.');
                }

                setIsGenerating(false);
            };

            // start recognition and let it end automatically after speech
            rec.start();
        } catch (err) {
            console.error('voiceToSketch failed', err);
            setErrorMsg('Failed to start voice-to-sketch');
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
                recognitionRef.current = null;
            }
        };
    }, []);

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
        // (Do NOT append suggestion to the saved text; suggestion is shown in UI only)
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
                        {isSaved && <span className="animate-fade-in" style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>Entry saved!</span>}

                        <button
                            onClick={() => { if (isRecording) stopRecognition(); else startRecognition(); }}
                            className="btn btn-glass"
                            title={isRecording ? 'Stop voice input' : 'Start voice input'}
                            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Mic size={16} />
                            <span style={{ fontSize: '0.9rem' }}>{isRecording ? 'Recording...' : 'Voice Input'}</span>
                        </button>

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

                    {isRecording && interimTranscript && (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.95rem', textAlign: 'right' }}>{interimTranscript}</div>
                    )}
                </div>

                {/* Mood suggestion shown at bottom of the journal page (visible, not appended to text) */}
                {moodInfo.suggestion && moodInfo.suggestion.length > 0 && (
                    <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>A gentle note</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                            {moodInfo.suggestion.map((line, i) => (
                                <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Journal;
