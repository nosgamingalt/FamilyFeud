# Biology Family Feud 🧬

An interactive Family Feud-style game designed for 9th-10th grade biology students, focusing on cell biology topics. Perfect for classroom review, test prep, or making learning fun and engaging!

## 🎮 Game Features

- **Dynamic Question Categories**:
  - **Cells & Cell Biology** - Comprehensive coverage of cell structure, organelles, cellular respiration, photosynthesis, transport, and cell theory

- **True Family Feud Experience**:
  - **Multiple Valid Answers**: Each question has 2-7 possible correct answers
  - **Point System**: More common answers earn higher points
  - **Strike System**: Traditional Family Feud 3-strike gameplay
  - **Survey-Style Questions**: "We surveyed 100 students..." format

- **Teacher Mode**: Password-protected view to see all answers (Password: `biorocks`)
- **Random Question Order**: Questions shuffle automatically for variety each game
- **Interactive Interface**: Click to reveal answers with smooth animations
- **Score Tracking**: Real-time point calculation as answers are revealed

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

### For Teachers:
1. Open the game in your browser
2. Select a category from the dropdown menu (questions will automatically shuffle)
3. Project the screen for your class to see
4. Read the question aloud to students
5. Have teams take turns providing answers
6. Click on an answer box to reveal correct answers
7. Click the ❌ button to add strikes for wrong answers
8. Game ends after 3 strikes or when all answers are revealed
9. Click "Next Question" to move forward or "Reset" to start over

### Scoring:
- Each revealed answer adds its points to the total score
- More common/obvious answers are worth more points
- Strategy: Decide whether to play it safe with common answers or risk it for all points!

## 🎓 Teacher Mode

**Activate Teacher Mode to see all answers before revealing them to students:**

1. Click the "Teacher Mode" button in the top-right corner
2. Enter password: `biorocks`
3. All answers will be displayed with special highlighting
4. Perfect for:
   - Previewing questions before class
   - Quickly checking if a student's answer is acceptable
   - Planning which questions to use
   - Reviewing content coverage

**Tip**: Keep Teacher Mode off during gameplay to maintain the excitement!

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

### Adding or Editing Questions

Edit the `public/questions.json` file to add or modify questions. Each question follows this format:

```json
{
  "q": "We surveyed 100 students: Question text here",
  "answers": ["Most common answer", "Second answer", "Third answer", "Less common", "Rare answer"],
  "points": [40, 30, 20, 8, 2]
}
```

**Tips for Creating Questions:**
- Use "Name a..." or "Name something..." format for open-ended questions
- Order answers from most to least common/obvious
- Assign higher points to more common answers (e.g., 40, 35, 30...)
- Include 2-7 possible answers per question
- Make sure answers have some variation so teams can't just guess one word

### Adding New Categories

In `questions.json`, add a new category:

```json
{
  "Your Category Name": [
    { /* question objects here */ }
  ],
  "Existing Category": [
    { /* existing questions */ }
  ]
}
```

## 🔒 Changing Teacher Mode Password

Edit the `TEACHER_PASSWORD` constant in `src/App.jsx`:

```javascript
const TEACHER_PASSWORD = 'your-new-password';
```

## 🎨 Customization Ideas

- **Change the theme colors**: Edit `tailwind.config.js` or the color classes in `App.jsx`
- **Add sound effects**: Import audio files and play them on reveals/strikes
- **Add timer**: Implement a countdown for each turn
- **Team names**: Add input fields for custom team names
- **Leaderboard**: Track scores across multiple games

## 🐛 Troubleshooting

**Questions not loading?**
- Check that `questions.json` has valid JSON syntax
- Verify the file is in the `public` folder

**Teacher Mode not working?**
- Make sure you're entering the correct password: `biorocks`
- Check for typos in the password constant

**Build fails?**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## 📄 License

This project is open source and available for educational use. Feel free to modify and adapt it for your classroom!
