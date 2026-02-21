<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# [DreamDiary] 🎯

## Basic Details

### Team Name: [NoDE🔗]

### Team Members
- Member 1: [Nishana T N] - [College of engineering kallooppara]
- Member 2: [Aarcha presannan] - [College of engineering kallooppara ]
  
### Hosted Project Link
[https://nishanatn.github.io/dreamdiary/]

### Project Description
[AI Powered Emotional Journal is a smart web application that allows users to write diary entries using text or voice. The system converts speech to text, detects emotional mood, generates AI-based sketch images from journal content, provides positive emotional feedback, and visualizes mood analytics using charts. It also includes a productivity-based To-Do List module.s]

### The Problem statement
[ Many people write journals but:

They cannot visually represent their emotions.

They do not understand their emotional patterns.

There is no integration of mood tracking and productivity.

Traditional diaries lack AI-driven insights.]

### The Solution
[We built an AI-powered journaling platform that:

Converts voice to text using AI

Detects emotional sentiment

Generates sketch-style AI images from diary content

Provides supportive emotional feedback

Displays mood analytics using charts

Includes a productivity tracking To-Do list]

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: [ JavaScript, CSS, Java]
- Frameworks used: [React (Vite-based setup)]
- Libraries used: [Chart.js (for analytics)
Axios (API requests)]
- Tools used: [VS Code

Git

GitHub

npm]

**For Hardware:**
- Main components: [Laptop / Desktop – For development and running the application

 Microphone – For voice input (using Whisper)

 Internet Connection – To access AI models from Hugging Face

 Smartphone (Optional) – For testing responsive design]
- Specifications:[ Laptop / Desktop

Processor: Intel i5 / Ryzen 5 or higher

RAM: Minimum 8GB

Storage: 256GB SSD recommended

OS: Windows 10/11, macOS, or Linux

 Microphone

Built-in or External USB mic

Noise reduction preferred

 Internet

Minimum 5 Mbps stable connection

 Smartphone (Optional)

Android / iOS with modern browser (Chrome/Safari)]
- Tools required: [VS Code – Code editor for development

 Node.js & npm – To install dependencies and run the project

 Web Browser (Google Chrome) – For testing and debugging

 GitHub – Version control & code hosting

 Hugging Face – AI model APIs (Whisper & Stable Diffusion)

Firebase (Optional) – Authentication & database

Chart.js – For analytics visualization]

---

## Features

List the key features of your project:
- Feature 1: [ Secure Login System (Email & Password Authentication)]
- Feature 2: [Voice to Text using Whisper]
- Feature 3: [Text-based Journal Entry]
- Feature 4: [Automatic Date Validation]
- feature 5:[AI Sketch Image Generation from Diary Content]
- feature 6:[Mood Detection (Happy, Sad, Neutral, Angry)]
- feature 7:[ Emotional Supportive Message System]
- feature 8:[ Mood Analytics with Pie Chart Visualization]
- feature 9:[To-Do List Management]
- feature 10:[Navigation & Back Button Support]

---

## Implementation

### For Software:

#### Installation
```bash
[npm install]
```

#### Run
```bash
[npm run dev]
```

### For Hardware:

#### Components Required
[List all components needed with specifications]

#### Circuit Setup
[Explain how to set up the circuit]

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![](Add scree<img width="577" height="671" alt="image" src="https://github.com/user-attachments/assets/2bba66e1-0986-4439-ba31-237cd1dd1fc1" />
nshot 1 here with proper name)
*Secure login page with authentication*

![<img width="1428" height="831" alt="image" src="https://github.com/user-attachments/assets/75a484f2-4644-4437-bb63-c6fbaedd4b20" />
](Add screenshot 2 here with proper name)
*Diary entry page with voice recording and AI sketch generation*

![<img width="1081" height="766" alt="image" src="https://github.com/user-attachments/assets/7231e1ea-0511-40ea-932a-c93f3b812860" />
](Add screenshot 3 here with proper name)
*Mood distribution displayed using pie chart*



#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*User logs in via authentication system.

Journal entry is written via text or voice.

Voice input → Whisper API → Converted to text.

Text → Mood Detection module.

Text → Stable Diffusion API → Sketch Image generation.

All data stored in database.

Analytics module processes mood data and displays pie chart.*

**Application Workflow:**

![Workflow](docs/workflow.png)
*Login → Dashboard →
Journal Entry (Text/Voice) →
Mood Detection + Image Generation →
Save Entry →
Analytics Visualization →
To-Do Management*

---

### For Hardware:

#### Schematic & Circuit

![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

![Team](Add photo of your team here)

![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://api-inference.huggingface.co/models/`

##### Endpoints

**GET /api/endpoint**
- **Description:** [What it does]
- **Parameters:**
  - `param1` (string): [Description]
  - `param2` (integer): [Description]
- **Response:**
```json
{
  "status": "success",
  "data": {}
}
```

**POST /api/endpoint**
- **Description:** [speech to text]
- **Request Body:**
```json
{
  "openai/whisper-large-v3",
  
}
```
- **Response:**
```json
{

  
  "text": "Today I felt peaceful and relaxed."

}
```

POST Text-to-Image

Model:

stabilityai/stable-diffusion-xl-base-1.0

Request Body:

{
  "inputs": "Pencil sketch style, emotional diary scene, soft shading"
}

Response:
Binary image output
[Add more endpoints as needed...]

---

### For Mobile Apps:

#### App Flow Diagram

![App Flow](docs/app-flow.png)
*Explain the user flow through your application*

#### Installation Guide

**For Android (APK):**

**Building from Source:**
```bash

---

### For Hardware Projects:



#### Assembly Instruction

---

### For Scripts/CLI Tools:

#### Command Reference

**Basic Usage:**
```bash


```

**Command:**


## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---


- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- Journal → Image Generation Prompt

“Convert this diary entry into a pencil sketch style artistic scene with emotional tone.”

- Sketch Style Enforcement

“Pencil drawing, monochrome, soft shading, hand-drawn illustration, emotional atmosphere.”

- Mood Detection Prompt

“Analyze the sentiment of this text and classify it as Happy, Sad, Neutral, or Angry.”

- Emotional Support Generation

“If the mood is sad, generate a short pleasant and encouraging message.”

- Speech-to-Text Processing

“Transcribe this audio clearly with proper punctuation.”

- Analytics Processing

“Count mood frequency and generate structured data for pie chart visualization.”


**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- Nishana T N

Frontend development

Journal module implementation

Mood detection logic

Analytics integration

-Aaarcha Presannan

Authentication system

API integration (Whisper & Stable Diffusion)

To-Do module

Database design & testing

---

## License
This project is licensed under the MIT License.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
