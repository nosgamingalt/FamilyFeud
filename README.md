# Biology Feud

A Family Feud-style game designed for Wisconsin 9th & 10th grade biology students. Built with React and Vite.

## Features

- **Interactive Game Board**: Family Feud-style gameplay with biology questions
- **30-Second Timer**: Countdown timer with visual color changes (green > yellow > red)
- **Team Management**: Track scores for two teams with automatic team switching
- **Strike System**: Three strikes automatically switch teams
- **Teacher Mode**: Password-protected mode (password: `biorocks`) that:
  - Shows all answers and point values
  - Displays questions in original order (not shuffled)
  - Perfect for reviewing answers with students
- **Question Navigation**: 
  - Dropdown selector to jump to any question
  - Previous/Next buttons
  - Reshuffle questions for variety
- **Multiple Topics**: Organized question sets by biology topic

## Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nosgamingalt/FamilyFeud.git
cd Bio-Feud
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder, ready for deployment.

## How to Play

1. **Select a Topic**: Choose a biology topic from the dropdown
2. **Start the Timer**: Click the "▶ Start" button when a team begins answering
3. **Reveal Answers**: Click on answer buttons to reveal them and award points to the current team
4. **Manage Strikes**: 
   - Click "Add Strike" for wrong answers
   - Three strikes automatically switch to the other team
5. **Switch Teams**: Use "Switch Team" button to manually change the active team
6. **Teacher Mode**: Click "🧑‍🏫 Teacher Mode" and enter password to view all answers

## Game Controls

- **Timer**: Start/Pause and Reset controls
- **Strikes**: Visual X indicators, automatically switch teams at 3 strikes
- **Answers**: Click to reveal/hide (resets timer when revealed)
- **Team Switching**: Resets timer to 30 seconds
- **Question Navigation**: Dropdown selector or Previous/Next buttons

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## License

This project is for educational purposes.
