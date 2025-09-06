# Contributing to Nexus

Thank you for your interest in contributing to Nexus! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions in many forms:

- **Bug reports** and feature requests
- **Code contributions** (bug fixes, new features, optimizations)
- **Documentation improvements**
- **Design suggestions** and UI/UX enhancements
- **Testing** across different browsers and devices
- **Community support** helping other users

## 🐛 Reporting Bugs

Before submitting a bug report, please:

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version** of Nexus
3. **Reproduce the issue** in a clean Ghost installation
4. **Gather system information** (Ghost version, browser, OS)

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- Ghost Version: [e.g. 5.2.0]
- Nexus Version: [e.g. 1.0.0]
- Browser: [e.g. Chrome 91, Safari 14]
- OS: [e.g. macOS 12.0, Windows 11]
- Device: [e.g. Desktop, iPhone 12]

**Additional Context**
Any other context about the problem.
```

## 🚀 Feature Requests

We love hearing your ideas! When suggesting features:

1. **Check if it already exists** or has been suggested
2. **Describe the use case** and why it's valuable
3. **Consider the impact** on performance and usability
4. **Provide mockups or examples** if possible

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
Describe the problem this feature would solve.

**Proposed Solution**
How do you envision this working?

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Screenshots, mockups, or examples.
```

## 💻 Code Contributions

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/nexus-ghost-theme.git
   cd nexus-ghost-theme
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes** following the coding standards
2. **Test thoroughly** across different browsers and devices
3. **Build the theme**:
   ```bash
   npm run build
   ```
4. **Test with Ghost**:
   ```bash
   npm run zip
   # Upload to your Ghost installation
   ```
5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Coding Standards

#### **HTML/Handlebars**
- Use semantic HTML5 elements
- Follow Ghost's Handlebars conventions
- Include appropriate ARIA labels for accessibility
- Use consistent indentation (2 spaces)

```handlebars
{{!-- Good --}}
<article class="post-card" role="article">
    <header class="post-card-header">
        <h2 class="post-card-title">
            <a href="{{url}}" aria-label="Read {{title}}">{{title}}</a>
        </h2>
    </header>
</article>

{{!-- Avoid --}}
<div class="post">
    <div class="title">
        <a href="{{url}}">{{title}}</a>
    </div>
</div>
```

#### **CSS**
- Use CSS custom properties for theming
- Follow BEM naming convention for classes
- Include responsive design considerations
- Comment complex calculations or hacks

```css
/* Good */
.nexus-code-block {
    background: var(--nexus-bg-code);
    border-radius: var(--nexus-radius-lg);
    padding: var(--nexus-space-md);
    font-family: var(--nexus-font-code);
}

.nexus-code-block__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Avoid */
.code-block {
    background: #0d1117;
    border-radius: 12px;
    padding: 16px;
}
```

#### **JavaScript**
- Use modern ES6+ syntax
- Follow functional programming principles when possible
- Include JSDoc comments for complex functions
- Avoid jQuery dependencies

```javascript
// Good
/**
 * Copies code content to clipboard
 * @param {HTMLElement} button - The copy button element
 */
function copyCodeToClipboard(button) {
    const codeBlock = button.closest('.nexus-code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    return navigator.clipboard.writeText(code)
        .then(() => showCopySuccess(button))
        .catch(() => showCopyError(button));
}

// Avoid
function copyCode(btn) {
    var code = $(btn).parent().find('code').text();
    // ... jQuery-dependent implementation
}
```

### File Structure

```
nexus-ghost-theme/
├── assets/
│   ├── css/
│   │   ├── nexus-variables.css    # Theme variables
│   │   ├── nexus-components.css   # Component styles
│   │   ├── nexus-typography.css   # Typography system
│   │   ├── nexus-base.css         # Base theme styles
│   │   └── screen.css             # Main stylesheet
│   ├── js/
│   │   └── nexus-tech.js          # Theme functionality
│   └── images/
├── partials/
│   ├── nexus/                     # Nexus components
│   │   ├── code-block.hbs
│   │   ├── terminal.hbs
│   │   ├── api-doc.hbs
│   │   ├── tech-badge.hbs
│   │   └── newsletter-signup.hbs
│   └── ... (other partials)
├── *.hbs                          # Template files
└── package.json                   # Theme configuration
```

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding/modifying tests
- `chore`: Build process, dependency updates

**Examples:**
```
feat(components): add syntax highlighting theme selector

fix(mobile): resolve navigation menu overflow on small screens

docs(readme): update installation instructions for Ghost 5.0

style(css): improve code block responsive design

refactor(js): optimize reading progress calculation

chore(deps): update Prism.js to latest version
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### **Functionality**
- [ ] Theme installs without errors
- [ ] All templates render correctly
- [ ] Code highlighting works across languages
- [ ] Copy buttons function properly
- [ ] Keyboard shortcuts work
- [ ] Dark/light mode switching
- [ ] Mobile navigation
- [ ] Newsletter signup (if applicable)

#### **Cross-Browser Testing**
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)  
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### **Responsive Testing**
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1440px+)

#### **Performance Testing**
- [ ] Lighthouse score 90+ (Performance)
- [ ] Fast loading on 3G networks
- [ ] No console errors
- [ ] Proper lazy loading behavior

#### **Accessibility Testing**
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast compliance
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Automated Testing

We use Ghost's built-in GScan for theme validation:

```bash
# Install GScan globally
npm install -g gscan

# Test the theme
gscan .

# Test with specific Ghost version
gscan . --ghost-version 5.0.0
```

## 📋 Pull Request Process

### Before Submitting

1. **Update documentation** if your changes affect usage
2. **Test thoroughly** using the checklist above
3. **Run GScan validation** with zero errors
4. **Update CHANGELOG.md** with your changes
5. **Rebase on latest main** to avoid merge conflicts

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing completed
- [ ] Responsive testing completed
- [ ] GScan validation passed
- [ ] Performance testing completed

## Screenshots
Include screenshots of your changes if applicable.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have updated the CHANGELOG.md
```

### Review Process

1. **Automated checks** must pass (GScan, etc.)
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Documentation review** for completeness
5. **Final approval** and merge

## 🎨 Design Contributions

### Design Principles

- **Dark-first approach** - design for dark theme, adapt for light
- **Developer-focused** - prioritize functionality over decoration  
- **Accessibility** - ensure WCAG 2.1 AA compliance
- **Performance** - optimize for fast loading and smooth interactions
- **Mobile-first** - design for mobile, enhance for desktop

### Design Assets

When contributing design changes:

1. **Provide mockups** in Figma, Sketch, or similar
2. **Include multiple states** (default, hover, focus, active)
3. **Consider accessibility** (contrast, focus indicators)
4. **Think responsive** (how does it work on mobile?)
5. **Match existing patterns** while improving them

## 🌟 Recognition

Contributors are recognized in:

- **README.md** - Contributors section
- **CHANGELOG.md** - Credit for specific contributions  
- **GitHub Contributors** - Automatic recognition
- **Release notes** - Major contributions highlighted

## 📞 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and specific problems
- **Email** - Direct contact for sensitive issues
- **Documentation** - Comprehensive guides and examples

## 📄 License

By contributing to Nexus, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for making Nexus better! 🚀

*Every contribution, no matter how small, helps build a better experience for the developer community.*