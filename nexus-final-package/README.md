# Nexus

A modern, tech-focused Ghost theme designed for developers, tech bloggers, and digital creators. Nexus combines clean aesthetics with powerful functionality, featuring a dark-first design, advanced syntax highlighting, and an optimized developer experience.

&nbsp;

![Nexus Theme Preview](https://your-domain.com/nexus-preview.png)

&nbsp;

## ✨ Key Features

### 🌙 **Dark-First Design**
- Beautiful dark theme optimized for developers
- Elegant light mode alternative
- Smooth transitions between themes
- Auto-detection based on system preferences

### 💻 **Developer-Focused**
- Advanced syntax highlighting with Prism.js
- Code block enhancements with copy buttons
- Terminal-style components
- Monospace font optimization

### 🎨 **Modern UI/UX**
- Clean, minimal interface
- Responsive design for all devices
- Smooth animations and micro-interactions
- Customizable color schemes

### ⚡ **Performance Optimized**
- Lazy loading for images
- Critical CSS inlining
- Optimized asset delivery
- Fast loading times

### 🛠 **Highly Customizable**
- Multiple layout options
- Typography customization
- Color scheme variations
- Navigation layouts

&nbsp;

## 🚀 Quick Start

### Installation

1. Download the latest release from [GitHub Releases](https://github.com/your-username/nexus-ghost-theme/releases)
2. Upload the theme ZIP file to your Ghost admin panel
3. Activate the theme in **Design** settings
4. Customize your theme settings

### Development

Nexus uses Gulp for building assets. You'll need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed.

```bash
# Install dependencies
yarn install

# Start development server with live reload
yarn dev

# Build for production
yarn build

# Create distribution ZIP
yarn zip
```

&nbsp;

## 📋 Theme Structure

**Main Templates:**
- `default.hbs` - Base template with header/footer
- `index.hbs` - Homepage with featured posts
- `post.hbs` - Individual post template with enhanced features
- `page.hbs` - Static pages template
- `tag.hbs` - Tag archive pages
- `author.hbs` - Author profile pages

**Specialized Templates:**
- `post-code.hbs` - Enhanced template for code tutorials
- `post-gallery.hbs` - Image gallery focused posts
- `page-about.hbs` - Custom about page template

**Partials:**
- `partials/header.hbs` - Site header with navigation
- `partials/footer.hbs` - Site footer
- `partials/code-block.hbs` - Enhanced code blocks
- `partials/author-card.hbs` - Author information cards
- `partials/newsletter.hbs` - Newsletter signup component

&nbsp;

## 🎛 Customization Options

Nexus includes extensive customization options available in Ghost admin:

### **Layout Options**
- Navigation layout (Logo positions, stacked)
- Post layouts (Wide, full, grid, list)
- Header styles (Center, left, hidden)

### **Typography**
- Primary font selection
- Code font selection  
- Reading experience settings

### **Colors & Theme**
- Color scheme (Dark, Light, Auto)
- Accent color customization
- Syntax highlighting themes

### **Components**
- Newsletter signup styling
- Social sharing options
- Author bio display
- Recent posts footer

&nbsp;

## 🔧 Advanced Configuration

### Custom Code Highlighting

Nexus supports multiple syntax highlighting themes:

```css
/* Available themes */
.prism-theme-dark { /* Default dark theme */ }
.prism-theme-light { /* Light theme */ }
.prism-theme-ocean { /* Ocean blue theme */ }
.prism-theme-matrix { /* Matrix green theme */ }
```

### Custom Colors

Override the default color scheme in Code Injection:

```css
:root {
  --nexus-primary: #00d4ff;
  --nexus-secondary: #0066cc;
  --nexus-accent: #ff6b35;
  --nexus-background: #0a0a0a;
  --nexus-surface: #1a1a1a;
}
```

&nbsp;

## 📱 Responsive Design

Nexus is fully responsive and optimized for:

- **Desktop** - Full-featured layout with sidebars
- **Tablet** - Adapted layout with touch-friendly navigation
- **Mobile** - Optimized for reading and navigation

&nbsp;

## 🤝 Support & Contributing

### Support
- 📚 [Documentation](https://github.com/your-username/nexus-ghost-theme/wiki)
- 🐛 [Bug Reports](https://github.com/your-username/nexus-ghost-theme/issues)
- 💬 [Discussions](https://github.com/your-username/nexus-ghost-theme/discussions)

### Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

&nbsp;

## 📄 License

Copyright (c) 2025 Your Name - Released under the [MIT license](LICENSE).

---

**Nexus** - Connecting ideas through code ⚡