const GEMINI_API_KEY = "AIzaSyDOZ4vK2LeElCqjHNBZZHN1CW6xLEO43jM";

async function testGemini() {
    const prompt = `A beautiful, gentle, artistic sketch illustration representing this diary entry: "I went to the park". Make it look like a memory drawing in a journal.`;

    const requestBody = {
        instances: [
            {
                prompt: prompt
            }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputOptions: {
                mimeType: "image/jpeg"
            }
        }
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (!response.ok) {
            console.error("Error data:", JSON.stringify(data, null, 2));
        } else {
            console.log("Success! Keys in response:", Object.keys(data));
            console.log("Has predictions?", !!data.predictions);
            if (data.predictions) console.log("Prediction keys:", Object.keys(data.predictions[0]));
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testGemini();
