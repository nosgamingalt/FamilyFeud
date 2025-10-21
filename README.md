# Biology Family Feud 🧬

An interactive Family Feud-style game designed for 9th-10th grade biology students, focusing on cell biology topics.

## 🎮 Game Features

- **3 Categories** with 90 total questions:
  - **Introduction to Cells** (30 questions) - Easy difficulty for students just starting the cells unit
  - **Cells & Cell Energy** (30 questions) - Medium difficulty covering cellular respiration, photosynthesis, and ATP
  - **Cell Structure & Theory** (30 questions) - Medium difficulty covering organelles, cell theory, and cellular organization

- **Teacher Mode**: Password-protected view to see all answers (Password: `biology2025`)
- **Strike System**: Traditional Family Feud 3-strike gameplay
- **Multiple Answers**: Each question has 2-7 possible answers with point values
- **Random Question Order**: Questions shuffle automatically for variety

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your computer

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nosgamingalt/FamilyFeud.git
cd FamilyFeud
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📝 How to Play

1. Select a category from the dropdown menu
2. Read the question to your class
3. Students provide answers
4. Click on answers to reveal them (or use Teacher Mode to see all answers)
5. Wrong answers add strikes (X marks)
6. Game ends after 3 strikes or when all answers are revealed

## 🎓 Teacher Mode

- Click the "Teacher Mode" button in the header
- Enter password: `biorocks`
- All answers will be displayed with yellow borders
- Perfect for reviewing questions before class or checking answers quickly

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project (see above)
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect your GitHub repository for automatic deployments

**Build Settings for Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`

## 📚 Customizing Questions

Edit the `public/questions.json` file to add or modify questions. Each question follows this format:

```json
{
  "q": "Question text here",
  "answers": ["Answer 1", "Answer 2", "Answer 3"],
  "points": [40, 35, 25]
}
```

## 🔒 Changing Teacher Mode Password

Edit line 18 in `src/App.jsx`:
```javascript
const TEACHER_PASSWORD = 'your-new-password';
```

## 📄 License

This project is open source and available for educational use.
