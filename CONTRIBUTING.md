# Contributing to StoryCanvas

Thank you for your interest in contributing to StoryCanvas! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/storycanvas.git
   cd storycanvas
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/KrystsiaK/storycanvas.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Making Changes

1. Make your changes in your feature branch
2. Follow the coding standards (see below)
3. Write or update tests as needed
4. Ensure all tests pass: `npm test`
5. Lint your code: `npm run lint`

### Committing Changes

We follow conventional commit messages:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(mobile): add character drawing interface
fix(backend): resolve story generation timeout issue
docs(readme): update installation instructions
```

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub from your fork to the main repository

3. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Testing instructions

4. **Wait for review** - maintainers will review your PR and may request changes

5. **Address feedback** if requested and push updates to your branch

6. **Celebrate!** Once approved, your PR will be merged

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### React Native

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for prop types
- Keep components small and reusable

### Backend

- Follow RESTful API conventions
- Use async/await for asynchronous code
- Implement proper error handling
- Add input validation
- Write API documentation

## Testing

- Write unit tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

Run tests:
```bash
npm test                           # All tests
npm test --workspace=apps/backend  # Backend only
npm test --workspace=apps/mobile   # Mobile only
```

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation for backend changes
- Include screenshots for UI changes

## Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Reach out to the maintainers
- Check existing issues and PRs

## License

By contributing to StoryCanvas, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to StoryCanvas! 🎨✨

