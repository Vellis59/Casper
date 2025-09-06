# Nexus Theme Documentation

A comprehensive guide to using and customizing the Nexus Ghost theme.

## 🚀 Quick Start

### Installation

1. **Download** the latest Nexus theme ZIP file from the [releases page](https://github.com/your-username/nexus-ghost-theme/releases)
2. **Upload** to your Ghost admin panel:
   - Go to **Design** → **Theme**
   - Click **Upload theme**
   - Select the Nexus ZIP file
   - Click **Activate**

### First Steps

1. **Configure theme settings** in Ghost Admin → Design → Theme settings
2. **Set your brand colors** in Ghost Admin → Settings → Brand
3. **Add your social profiles** in the custom theme settings
4. **Create your first tech post** using the enhanced features

---

## ⚙️ Theme Customization

### Available Settings

Navigate to **Ghost Admin → Design → Theme Settings** to access these options:

#### **Layout & Navigation**
- **Navigation Layout**: Choose logo position (cover, middle, stacked)
- **Header Style**: Center, left, or hidden header
- **Feed Layout**: Tech cards, classic, grid, or list view

#### **Typography**
- **Title Font**: Inter (Tech Sans-serif), JetBrains Mono, or Elegant serif  
- **Body Font**: Inter, Fira Code (monospace), or Elegant serif
- **Code Font**: Fira Code, JetBrains Mono, or SF Mono

#### **Color Scheme**
- **Theme Mode**: Dark (default), Light, or Auto-detect
- **Syntax Highlighting**: Nexus Dark, GitHub Dark, VS Code Dark, Matrix, Ocean

#### **Tech Features**
- **Show Code Line Numbers**: Enable/disable in code blocks
- **Enable Code Copy**: Add copy buttons to code blocks
- **Show Reading Progress**: Display progress bar while reading
- **Enable Tech Badges**: Show technology badges on posts

#### **Social Integration**
- **GitHub Username**: Link to your GitHub profile
- **Twitter Username**: Display Twitter profile link
- **LinkedIn Username**: Show LinkedIn profile

---

## 💻 Using Tech Components

### Enhanced Code Blocks

Use the special Nexus code block component for better code presentation:

```handlebars
{{#> "nexus/code-block" language="javascript" title="API Example"}}
const response = await fetch('/api/users');
const users = await response.json();
console.log(users);
{{/"nexus/code-block"}}
```

**Features:**
- Syntax highlighting with Prism.js
- Copy code button
- Language indicator
- Title support
- Line numbers (optional)

### Terminal Component

Create terminal-style code blocks:

```handlebars
{{#> "nexus/terminal" title="bash"}}
<span class="nexus-terminal-prompt">$</span> <span class="nexus-terminal-command">npm install nexus-theme</span>
<span class="nexus-terminal-output">Installing dependencies...</span>
<span class="nexus-terminal-prompt">$</span> <span class="nexus-terminal-command">ghost restart</span>
{{/"nexus/terminal"}}
```

### Tech Badges

Add technology badges to highlight the tools and frameworks:

```handlebars
{{> "nexus/tech-badge" text="React" type="primary" url="/tag/react"}}
{{> "nexus/tech-badge" text="Node.js" type="success"}}
{{> "nexus/tech-badge" text="TypeScript" type="warning"}}
```

**Badge Types:**
- `primary` - Electric cyan (default)
- `success` - Green
- `warning` - Orange  
- `error` - Red

### API Documentation

Document your APIs with styled components:

```handlebars
{{#> "nexus/api-doc" method="POST" endpoint="/api/auth/login" description="Authenticate user and return JWT token"}}
<h4>Request Body:</h4>
<pre><code>{
  "email": "user@example.com",
  "password": "secretPassword"
}</code></pre>
{{/"nexus/api-doc"}}
```

---

## 📝 Writing Tech Content

### Using the Tech Post Template

Create a file named `post-tech.hbs` to use the enhanced tech post layout with:
- Technology badges at the top
- GitHub repository integration
- Related posts section
- Enhanced newsletter signup
- Table of contents (auto-generated)

### Keyboard Shortcuts

Nexus includes developer-friendly keyboard shortcuts:

- **Ctrl/⌘ + K**: Open search
- **Ctrl/⌘ + D**: Toggle dark/light theme
- **Smooth scrolling** for anchor links

### Markdown Enhancements

Standard Markdown is enhanced with:

#### Code Syntax Highlighting
```javascript
function greetDeveloper(name) {
    return `Hello ${name}, welcome to Nexus! 🚀`;
}
```

#### Enhanced Tables
| Feature | Status | Priority |
|---------|--------|----------|
| Dark Mode | ✅ Complete | High |
| Code Highlighting | ✅ Complete | High |
| Mobile Responsive | ✅ Complete | High |

#### Blockquotes with Style
> 💡 **Pro Tip**: Use the Nexus components to create rich, interactive content that engages your developer audience.

---

## 🎨 Advanced Customization

### Custom CSS Variables

Override Nexus colors in **Code Injection → Site Header**:

```css
<style>
:root {
    /* Override primary colors */
    --nexus-primary: #ff6b35;        /* Orange instead of cyan */
    --nexus-secondary: #333333;      /* Dark grey */
    --nexus-accent: #00ff88;         /* Green accent */
    
    /* Custom background */
    --nexus-bg-primary: #000000;     /* Pure black */
    --nexus-bg-secondary: #111111;   /* Darker grey */
}
</style>
```

### Custom JavaScript

Add enhanced functionality in **Code Injection → Site Footer**:

```html
<script>
// Custom typing effect for homepage hero
document.addEventListener('DOMContentLoaded', function() {
    const heroText = document.querySelector('.hero-title');
    if (heroText) {
        heroText.setAttribute('data-typing', 'Welcome to the Future of Tech Blogging');
        heroText.setAttribute('data-speed', '80');
    }
});
</script>
```

### Font Customization

Replace Google Fonts with your own in **Code Injection → Site Header**:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet">

<style>
:root {
    --nexus-font-primary: 'Space Grotesk', sans-serif;
}
</style>
```

---

## 📱 Mobile Optimization

### Responsive Features

Nexus is fully responsive with mobile-specific optimizations:

- **Touch-friendly navigation** with mobile burger menu
- **Optimized reading experience** with larger text on mobile
- **Swipe gestures** for gallery posts
- **Fast loading** with lazy-loaded images
- **Adaptive layouts** that work on all screen sizes

### Mobile-Specific CSS

Customize mobile experience:

```css
@media (max-width: 768px) {
    .nexus-code-block {
        font-size: 14px; /* Smaller code on mobile */
    }
    
    .nexus-terminal {
        padding: 0.5rem; /* Compact terminal on mobile */
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues

**Q: Code highlighting not working**  
A: Ensure Prism.js is loading properly. Check browser console for JavaScript errors.

**Q: Dark mode not saving preference**  
A: Check if localStorage is enabled in your browser and not blocked by privacy settings.

**Q: Mobile menu not appearing**  
A: Verify the hamburger menu JavaScript is loaded and no CSS conflicts exist.

**Q: Custom fonts not loading**  
A: Check Google Fonts URL in `default.hbs` and ensure proper font declarations in CSS.

### Performance Tips

1. **Optimize images** - Use WebP format when possible
2. **Enable Ghost's built-in caching**
3. **Use a CDN** for faster global loading
4. **Minimize custom code injection**
5. **Test on mobile devices** regularly

### Debug Mode

Add to **Code Injection → Site Header** for debugging:

```html
<script>
// Enable Nexus debug mode
window.NexusDebug = true;

// Log theme interactions
document.addEventListener('DOMContentLoaded', function() {
    if (window.NexusDebug) {
        console.log('🚀 Nexus Theme Loaded');
        console.log('Color scheme:', document.body.className);
        console.log('Code blocks found:', document.querySelectorAll('pre code').length);
    }
});
</script>
```

---

## 📈 SEO & Performance

### Built-in SEO Features

- **Semantic HTML5** structure
- **Open Graph** meta tags
- **Twitter Card** support  
- **Structured data** for rich snippets
- **Fast loading** optimized CSS/JS
- **Mobile-first** responsive design

### Performance Optimizations

- **Critical CSS** inlined for faster rendering
- **Lazy loading** for images
- **Optimized web fonts** with font-display: swap
- **Minimal JavaScript** for core functionality
- **Compressed assets** in production build

---

## 🤝 Support & Community

### Getting Help

- 📚 **Documentation**: This comprehensive guide
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/nexus-ghost-theme/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/nexus-ghost-theme/discussions)
- 📧 **Direct Support**: your.email@domain.com

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

## 📄 License

Nexus is released under the [MIT License](LICENSE).

---

**Nexus Theme** - Connecting ideas through code ⚡

*For the latest updates and community discussions, visit our [GitHub repository](https://github.com/your-username/nexus-ghost-theme).*