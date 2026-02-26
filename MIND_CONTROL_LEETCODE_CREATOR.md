# Mind Control LeetCode Problem Creator 🧠⚡

A revolutionary problem generation system that uses neural mind control patterns to create unique LeetCode-style coding challenges.

## Features

### 🎯 Mind Control Settings
- **Focus**: Controls problem clarity and precision (0-100%)
- **Creativity**: Influences problem uniqueness and innovation (0-100%)
- **Complexity**: Adjusts algorithmic difficulty (0-100%)
- **Innovation**: Determines how cutting-edge the problem is (0-100%)

### 📊 Problem Types
1. **Algorithmic** 🧮 - Classic algorithm challenges
2. **Data Structures** 🏗️ - Structure manipulation problems
3. **Dynamic Programming** 🎯 - Optimization challenges
4. **Graph Theory** 🕸️ - Network and path problems
5. **String Manipulation** 📝 - Text processing challenges
6. **Math & Logic** 🔢 - Mathematical reasoning problems

### 🎨 Difficulty Levels
- 🟢 Easy
- 🟡 Medium
- 🔴 Hard

## How It Works

1. **Adjust Mind Control Sliders**: Set your neural parameters
2. **Select Problem Type**: Choose the category
3. **Set Difficulty**: Pick easy, medium, or hard
4. **Generate**: Click to create a unique problem
5. **Save or Test**: Save to library or test immediately

## Generated Problem Structure

Each problem includes:
- **Title**: Neural-themed problem name
- **Description**: Detailed problem statement
- **Constraints**: Input/output limitations
- **Examples**: Sample test cases with explanations
- **Starter Code**: Template to begin solving
- **Test Cases**: Visible and hidden tests
- **Hints**: Progressive problem-solving guidance

## Usage

```jsx
import MindControlProblemCreator from './components/MindControl/MindControlProblemCreator';

function App() {
  return <MindControlProblemCreator />;
}
```

## Routing Setup

Add to your router:

```jsx
import MindControlPage from './pages/MindControlPage';

<Route path="/mind-control" element={<MindControlPage />} />
```

## Features in Detail

### Neural Wave Animation
Real-time visual feedback showing your mind control settings with animated neural waves.

### Problem Persistence
All generated problems are saved to localStorage and can be retrieved later.

### Responsive Design
Fully responsive layout that works on desktop, tablet, and mobile devices.

### Interactive Controls
Smooth slider controls with visual feedback and hover effects.

## Customization

### Adding New Problem Types

```javascript
const problemTypes = [
  { id: 'custom-type', name: 'Custom Type', icon: '🎯' }
];
```

### Modifying Generation Logic

Edit the generation functions in `MindControlProblemCreator.jsx`:
- `generateTitle()`
- `generateDescription()`
- `generateConstraints()`
- `generateExamples()`

## Styling

The component uses `mind-control-creator.css` with:
- Gradient backgrounds
- Smooth animations
- Neural wave effects
- Responsive grid layout

## Future Enhancements

- [ ] AI-powered problem generation using GPT
- [ ] Community problem sharing
- [ ] Problem difficulty rating system
- [ ] Solution templates for each problem type
- [ ] Integration with code execution engine
- [ ] Leaderboard for generated problems
- [ ] Export problems to various formats

## Technical Stack

- React 18+
- Lucide React Icons
- CSS3 Animations
- LocalStorage API

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Lightweight component (~15KB)
- No external API calls
- Instant problem generation
- Smooth 60fps animations

---

Created with 🧠 and ⚡ for the coding community!
