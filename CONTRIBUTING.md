# Contributing to Codex Platform

First off, thank you for considering contributing to Codex! It's people like you that make Codex such a great tool for developers worldwide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- A code editor (we recommend VS Code)

### First Time Contributors

New to open source? Here are some resources to help you get started:
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [First Contributions](https://github.com/firstcontributions/first-contributions)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

Look for issues labeled `good first issue` or `beginner-friendly` to get started!

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11, macOS 13]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node version: [e.g., 18.17.0]
- Codex version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Mockups, examples, or any other context.
```

### Your First Code Contribution

Unsure where to begin? Start with:
1. **Documentation improvements** - Fix typos, clarify instructions
2. **Good first issues** - Small, well-defined tasks
3. **Bug fixes** - Fix reported bugs
4. **Tests** - Add missing test coverage

### Areas We Need Help

- 🐛 **Bug Fixes** - Fix reported issues
- 📝 **Documentation** - Improve docs, add examples
- ✨ **Features** - Implement new features
- 🎨 **UI/UX** - Improve design and user experience
- ♿ **Accessibility** - Make Codex more accessible
- 🌍 **Translations** - Translate to other languages
- 🧪 **Testing** - Add or improve tests
- 🔧 **DevOps** - Improve build/deployment process

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/codex-platform.git
cd codex-platform

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/codex-platform.git
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if working on backend)
cd backend-new
npm install
cd ..
```

### 3. Environment Setup

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your configuration
# Add your Clerk API keys, database URLs, etc.
```

### 4. Run Development Server

```bash
# Start frontend (runs on http://localhost:5173)
npm run dev

# Start backend (in another terminal)
cd backend-new
npm run dev
```

### 5. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## Coding Guidelines

### JavaScript/React Style Guide

We follow industry-standard practices:

**General Rules:**
- Use **ES6+** syntax
- Use **functional components** with hooks
- Use **meaningful variable names**
- Keep functions **small and focused**
- Add **comments** for complex logic
- Write **self-documenting code**

**Example:**
```javascript
// ❌ Bad
const x = data.filter(d => d.a > 5).map(d => d.b);

// ✅ Good
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => user.name);
```

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(null);
  const navigate = useNavigate();
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### File Naming Conventions

- **Components**: `PascalCase.jsx` (e.g., `UserProfile.jsx`)
- **Utilities**: `camelCase.js` (e.g., `formatDate.js`)
- **Constants**: `UPPER_SNAKE_CASE.js` (e.g., `API_ENDPOINTS.js`)
- **Styles**: `kebab-case.css` (e.g., `user-profile.css`)

### CSS/Styling

We use **Tailwind CSS** for styling:

```jsx
// ✅ Good - Use Tailwind classes
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Click Me
</button>

// ❌ Avoid inline styles unless necessary
<button style={{ backgroundColor: 'blue' }}>
  Click Me
</button>
```

### Accessibility

Always consider accessibility:

```jsx
// ✅ Good
<button 
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X className="w-5 h-5" />
</button>

<img src={logo} alt="Codex Platform Logo" />

// ❌ Bad
<button onClick={handleClose}>
  <X />
</button>

<img src={logo} />
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(editor): add syntax highlighting for Python"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple lines
git commit -m "feat(dsa): add A2Z DSA sheet

- Added complete data structure
- Implemented progress tracking
- Added 7 learning phases

Closes #123"
```

### Commit Best Practices

- Write in **present tense** ("add feature" not "added feature")
- Keep subject line **under 50 characters**
- Capitalize the subject line
- Don't end subject with a period
- Use body to explain **what** and **why**, not how
- Reference issues and PRs in footer

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**:
   ```bash
   npm run test
   npm run build
   ```

3. **Lint your code**:
   ```bash
   npm run lint
   ```

4. **Update documentation** if needed

### Submitting a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub

3. **Fill out the PR template**:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### PR Review Process

1. **Automated checks** must pass (CI/CD, linting, tests)
2. **Code review** by at least one maintainer
3. **Address feedback** - make requested changes
4. **Approval** - PR gets approved
5. **Merge** - Maintainer merges your PR

### After Your PR is Merged

1. **Delete your branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

3. **Celebrate!** 🎉 You've contributed to Codex!

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Discord** - Real-time chat (link in README)
- **Twitter** - Updates and announcements

### Getting Help

- Check the [README](README.md) and documentation first
- Search existing issues and discussions
- Ask in Discord or GitHub Discussions
- Be patient and respectful

### Recognition

Contributors are recognized in:
- README contributors section
- Release notes
- Hall of Fame page (coming soon)

---

## License

By contributing to Codex, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Don't hesitate to ask! We're here to help:
- Open an issue with the `question` label
- Ask in GitHub Discussions
- Reach out on Discord

**Thank you for contributing to Codex! Together, we're building something amazing.** 🚀

---

**Last Updated:** January 20, 2026
**Version:** 1.0.0
