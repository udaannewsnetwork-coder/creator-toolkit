# Contributing to Creator Toolkit

We welcome contributions from the community! This document provides guidelines and instructions for contributing to the Creator Toolkit project.

## Ways to Contribute

- **Report Bugs** — Found an issue? Let us know by opening a GitHub issue
- **Suggest Features** — Have an idea for a new feature? We'd love to hear it
- **Submit Code** — Fix bugs or add new features with pull requests
- **Improve Documentation** — Help us improve our docs and README
- **Spread the Word** — Star the repo and share it with others

## Getting Started

### Prerequisites

- Git installed on your machine
- A GitHub account
- A text editor or IDE of your choice
- Basic knowledge of HTML, CSS, and JavaScript

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on the GitHub repo page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/creator-toolkit.git
   cd creator-toolkit
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/udaannewsnetwork-coder/creator-toolkit.git
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style Guidelines

- **HTML**: Use semantic HTML5 tags
- **CSS**: Follow the existing style conventions; use CSS custom properties for colors
- **JavaScript**: Use ES6+ syntax; keep functions small and focused
- **Comments**: Write clear, concise comments for complex logic
- **Naming**: Use descriptive variable and function names

### Testing Your Changes

1. Open `index.html` in your browser
2. Test all functionality:
   - Adding new tasks
   - Toggling task completion
   - Editing tasks
   - Deleting tasks
   - Filtering tasks
   - Searching tasks
   - Local storage persistence (refresh the page)
   - Responsive design (resize browser window)

3. Test on multiple browsers if possible

### Commit Messages

Write clear, descriptive commit messages:

```
Add feature: Brief description of what was added

- More detailed explanation if needed
- List key changes made
```

Good examples:
- `Add search functionality to filter tasks`
- `Fix: Prevent duplicate tasks from being added`
- `Update styles for mobile responsiveness`

Avoid:
- `fixed stuff`
- `updates`
- `asdf`

## Submitting Changes

### Creating a Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request on GitHub**
   - Compare `base: main` with your feature branch
   - Write a clear title and description
   - Reference any related issues (e.g., "Closes #42")

3. **PR Description Template**
   ```
   ## Description
   Brief description of the changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Styling improvement

   ## Testing
   Describe how you tested the changes

   ## Checklist
   - [ ] Code follows the style guidelines
   - [ ] Tested on multiple browsers
   - [ ] No console errors
   - [ ] Updated relevant documentation
   ```

### Responding to Feedback

- Be open to suggestions and feedback
- Respond promptly to reviewer comments
- Make requested changes in new commits
- Don't force-push unless explicitly asked

## Issue Guidelines

### Reporting Bugs

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Features

Include:
- Clear description of the feature
- Use case and benefits
- Examples if applicable
- Any related issues or PRs

## Project Structure

```
creator-toolkit/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Application styles
├── js/
│   └── app.js          # Application logic
├── docs/
│   └── CONTRIBUTING.md # This file
└── README.md           # Project README
```

## Future Enhancements

Potential areas for contribution:
- Task categories/tags
- Task priority levels
- Task due dates and reminders
- Dark mode theme
- Export tasks to CSV/JSON
- Task notifications
- Recurring tasks
- Cloud sync functionality

## Questions or Need Help?

- Check existing issues and discussions
- Open a new issue with your question
- Join our community discussions

## License

By contributing to Creator Toolkit, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Creator Toolkit!** 🚀
