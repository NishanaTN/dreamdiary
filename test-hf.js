const HF_API_KEY = "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";
const MODEL_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

async function testHF() {
    console.log("Testing Hugging Face Router API...");
    const prompt = `A beautiful, gentle, artistic sketch illustration representing this diary entry: "I went to the park". Make it look like a memory drawing in a journal.`;

    try {
        const response = await fetch(MODEL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
        });

        console.log("Status:", response.status);

        if (!response.ok) {
            const errorBuffer = await response.arrayBuffer();
            const errorText = Buffer.from(errorBuffer).toString('utf-8');
            console.error("Error data:", errorText);
        } else {
            console.log("Success! Returning blob...");
            const blob = await response.blob();
            console.log("Blob size:", blob.size, "type:", blob.type);
        }
    } catch (e) {
        console.error("Fetch failed with error:", e);
    }
}

testHF();
