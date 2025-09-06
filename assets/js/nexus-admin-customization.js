/**
 * Nexus Admin Customization System
 * Advanced admin panel for theme customization
 * Handles color themes, effects, templates, and tag styles
 * Version: 3.0.0
 */

class NexusAdminCustomization {
    constructor(options = {}) {
        this.options = {
            enableColorCustomization: true,
            enableEffectToggles: true,
            enableTemplateSelection: true,
            enableTagStyles: true,
            enablePresets: true,
            enableExportImport: true,
            autoSave: true,
            storageKey: 'nexus-customization',
            ...options
        };

        this.customizations = {
            colors: {
                primary: '#667eea',
                secondary: '#764ba2',
                accent: '#f093fb',
                background: '#ffffff',
                text: '#15171a',
                border: '#e5e5e5'
            },
            effects: {
                animations: true,
                parallax: true,
                hover: true,
                transitions: true,
                blur: false,
                shadows: true,
                gradients: true
            },
            templates: {
                postLayout: 'default',
                cardStyle: 'modern',
                headerStyle: 'classic'
            },
            tagStyles: {
                style: 'pill',
                colorScheme: 'default',
                size: 'medium'
            },
            typography: {
                fontFamily: 'system',
                fontSize: 'medium',
                lineHeight: 'normal'
            }
        };

        this.presets = [
            {
                name: 'Nexus Classic',
                description: 'Original Nexus theme colors',
                colors: ['#667eea', '#764ba2', '#f093fb', '#ffffff', '#15171a', '#e5e5e5'],
                customizations: {
                    colors: {
                        primary: '#667eea',
                        secondary: '#764ba2',
                        accent: '#f093fb',
                        background: '#ffffff',
                        text: '#15171a',
                        border: '#e5e5e5'
                    }
                }
            },
            {
                name: 'Dark Mode',
                description: 'Dark theme for night reading',
                colors: ['#1a1a1a', '#2d2d2d', '#4a9eff', '#121212', '#ffffff', '#333333'],
                customizations: {
                    colors: {
                        primary: '#4a9eff',
                        secondary: '#2d2d2d',
                        accent: '#ff6b6b',
                        background: '#121212',
                        text: '#ffffff',
                        border: '#333333'
                    }
                }
            },
            {
                name: 'Minimalist',
                description: 'Clean and simple design',
                colors: ['#000000', '#666666', '#cccccc', '#ffffff', '#333333', '#eeeeee'],
                customizations: {
                    colors: {
                        primary: '#000000',
                        secondary: '#666666',
                        accent: '#cccccc',
                        background: '#ffffff',
                        text: '#333333',
                        border: '#eeeeee'
                    },
                    effects: {
                        animations: false,
                        parallax: false,
                        shadows: false,
                        gradients: false
                    }
                }
            },
            {
                name: 'Vibrant',
                description: 'Colorful and energetic theme',
                colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'],
                customizations: {
                    colors: {
                        primary: '#ff6b6b',
                        secondary: '#feca57',
                        accent: '#48dbfb',
                        background: '#ffffff',
                        text: '#2f3640',
                        border: '#ddd'
                    }
                }
            }
        ];

        this.isOpen = false;
        this.currentSection = 'colors';

        this.init();
    }

    /**
     * Initialize admin customization system
     */
    async init() {
        try {
            console.log('🎨 Nexus Admin Customization initializing...');

            // Load saved customizations
            this.loadCustomizations();

            // Create admin panel
            this.createAdminPanel();

            // Apply customizations
            this.applyCustomizations();

            // Setup event listeners
            this.setupEventListeners();

            console.log('✅ Nexus Admin Customization initialized successfully');
        } catch (error) {
            console.error('❌ Admin Customization initialization failed:', error);
        }
    }

    /**
     * Load saved customizations from localStorage
     */
    loadCustomizations() {
        try {
            const saved = localStorage.getItem(this.options.storageKey);
            if (saved) {
                const parsedCustomizations = JSON.parse(saved);
                this.customizations = { ...this.customizations, ...parsedCustomizations };
                console.log('📂 Loaded saved customizations');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load saved customizations:', error);
        }
    }

    /**
     * Save customizations to localStorage
     */
    saveCustomizations() {
        if (this.options.autoSave) {
            try {
                localStorage.setItem(this.options.storageKey, JSON.stringify(this.customizations));
                this.showNotification('Customizations saved!', 'success');
            } catch (error) {
                console.error('Failed to save customizations:', error);
                this.showNotification('Failed to save customizations', 'error');
            }
        }
    }

    /**
     * Create admin panel HTML structure
     */
    createAdminPanel() {
        // Create admin toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'nexus-admin-toggle';
        toggleButton.innerHTML = '⚙️';
        toggleButton.setAttribute('aria-label', 'Open Admin Panel');
        toggleButton.id = 'nexus-admin-toggle';
        document.body.appendChild(toggleButton);

        // Create admin panel
        const adminPanel = document.createElement('div');
        adminPanel.className = 'nexus-admin-panel';
        adminPanel.id = 'nexus-admin-panel';
        adminPanel.innerHTML = this.generateAdminPanelHTML();
        document.body.appendChild(adminPanel);

        console.log('🏗️ Admin panel created');
    }

    /**
     * Generate admin panel HTML
     */
    generateAdminPanelHTML() {
        return `
            <div class="nexus-admin-header">
                <h2 class="nexus-admin-title">
                    🎨 Nexus Customization
                </h2>
                <p class="nexus-admin-subtitle">Personalize your theme</p>
                <button class="nexus-admin-close" aria-label="Close Admin Panel">×</button>
            </div>

            ${this.options.enableColorCustomization ? this.generateColorSection() : ''}
            ${this.options.enableEffectToggles ? this.generateEffectSection() : ''}
            ${this.options.enableTemplateSelection ? this.generateTemplateSection() : ''}
            ${this.options.enableTagStyles ? this.generateTagStyleSection() : ''}
            ${this.options.enablePresets ? this.generatePresetSection() : ''}
            ${this.options.enableExportImport ? this.generateExportImportSection() : ''}
        `;
    }

    /**
     * Generate color customization section
     */
    generateColorSection() {
        const colorPalettes = [
            { name: 'Primary', key: 'primary', color: this.customizations.colors.primary },
            { name: 'Secondary', key: 'secondary', color: this.customizations.colors.secondary },
            { name: 'Accent', key: 'accent', color: this.customizations.colors.accent },
            { name: 'Background', key: 'background', color: this.customizations.colors.background },
            { name: 'Text', key: 'text', color: this.customizations.colors.text },
            { name: 'Border', key: 'border', color: this.customizations.colors.border }
        ];

        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">🎨 Color Palette</h3>
                <div class="nexus-color-palette">
                    ${colorPalettes.map(palette => `
                        <div class="nexus-color-item">
                            <div class="nexus-color-preview" 
                                 style="background-color: ${palette.color}"
                                 data-color-key="${palette.key}"
                                 tabindex="0"
                                 role="button"
                                 aria-label="Select ${palette.name} color">
                            </div>
                            <p class="nexus-color-label">${palette.name}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="nexus-custom-color">
                    <input type="color" id="nexus-color-picker" class="nexus-color-input" value="${this.customizations.colors.primary}">
                    <input type="text" id="nexus-hex-input" class="nexus-hex-input" placeholder="#667eea">
                    <p style="font-size: 12px; color: #666; margin: 8px 0 0 0;">Click a color above, then use the picker</p>
                </div>
            </div>
        `;
    }

    /**
     * Generate effect toggles section
     */
    generateEffectSection() {
        const effects = [
            { key: 'animations', name: 'Animations', desc: 'Enable smooth animations and transitions' },
            { key: 'parallax', name: 'Parallax', desc: 'Parallax scrolling effects' },
            { key: 'hover', name: 'Hover Effects', desc: 'Interactive hover animations' },
            { key: 'transitions', name: 'Transitions', desc: 'Smooth page transitions' },
            { key: 'blur', name: 'Blur Effects', desc: 'Background blur and glass effects' },
            { key: 'shadows', name: 'Shadows', desc: 'Drop shadows and depth' },
            { key: 'gradients', name: 'Gradients', desc: 'Gradient backgrounds and effects' }
        ];

        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">⚡ Visual Effects</h3>
                ${effects.map(effect => `
                    <div class="nexus-effect-toggle">
                        <div class="nexus-effect-info">
                            <p class="nexus-effect-name">${effect.name}</p>
                            <p class="nexus-effect-desc">${effect.desc}</p>
                        </div>
                        <div class="nexus-toggle-switch ${this.customizations.effects[effect.key] ? 'active' : ''}" 
                             data-effect="${effect.key}"
                             tabindex="0"
                             role="switch"
                             aria-checked="${this.customizations.effects[effect.key]}"
                             aria-label="Toggle ${effect.name}">
                            <div class="nexus-toggle-knob"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Generate template selection section
     */
    generateTemplateSection() {
        const templates = [
            { key: 'default', name: 'Default', preview: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)' },
            { key: 'modern', name: 'Modern', preview: 'linear-gradient(45deg, #667eea, #764ba2)' },
            { key: 'minimal', name: 'Minimal', preview: 'linear-gradient(45deg, #fff, #f5f5f5)' },
            { key: 'magazine', name: 'Magazine', preview: 'linear-gradient(45deg, #ff6b6b, #feca57)' },
            { key: 'grid', name: 'Grid', preview: 'linear-gradient(45deg, #48dbfb, #0abde3)' },
            { key: 'masonry', name: 'Masonry', preview: 'linear-gradient(45deg, #ff9ff3, #f368e0)' }
        ];

        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">📝 Post Templates</h3>
                <div class="nexus-template-grid">
                    ${templates.map(template => `
                        <div class="nexus-template-item ${this.customizations.templates.postLayout === template.key ? 'active' : ''}"
                             data-template="${template.key}"
                             tabindex="0"
                             role="button"
                             aria-label="Select ${template.name} template">
                            <div class="nexus-template-preview" style="background: ${template.preview}"></div>
                            <div class="nexus-template-name">${template.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate tag styles section
     */
    generateTagStyleSection() {
        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">🏷️ Tag Styles</h3>
                
                <div class="nexus-tag-preview">
                    <span class="nexus-sample-tag tag-style-${this.customizations.tagStyles.style}">Technology</span>
                    <span class="nexus-sample-tag tag-style-${this.customizations.tagStyles.style}">Design</span>
                    <span class="nexus-sample-tag tag-style-${this.customizations.tagStyles.style}">Development</span>
                    <span class="nexus-sample-tag tag-style-${this.customizations.tagStyles.style}">Tutorial</span>
                </div>
                
                <div class="nexus-tag-styles">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">Style</h4>
                    <div class="nexus-template-grid">
                        <div class="nexus-template-item ${this.customizations.tagStyles.style === 'pill' ? 'active' : ''}"
                             data-tag-style="pill" tabindex="0" role="button">
                            <div class="nexus-template-name">Pill</div>
                        </div>
                        <div class="nexus-template-item ${this.customizations.tagStyles.style === 'rounded' ? 'active' : ''}"
                             data-tag-style="rounded" tabindex="0" role="button">
                            <div class="nexus-template-name">Rounded</div>
                        </div>
                        <div class="nexus-template-item ${this.customizations.tagStyles.style === 'sharp' ? 'active' : ''}"
                             data-tag-style="sharp" tabindex="0" role="button">
                            <div class="nexus-template-name">Sharp</div>
                        </div>
                        <div class="nexus-template-item ${this.customizations.tagStyles.style === 'outline' ? 'active' : ''}"
                             data-tag-style="outline" tabindex="0" role="button">
                            <div class="nexus-template-name">Outline</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate presets section
     */
    generatePresetSection() {
        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">🎯 Presets</h3>
                <div class="nexus-presets">
                    ${this.presets.map(preset => `
                        <div class="nexus-preset-item" data-preset="${preset.name}" tabindex="0" role="button">
                            <div class="nexus-preset-info">
                                <p class="nexus-preset-name">${preset.name}</p>
                                <p class="nexus-preset-desc">${preset.description}</p>
                            </div>
                            <div class="nexus-preset-colors">
                                ${preset.colors.slice(0, 4).map(color => 
                                    `<div class="nexus-preset-color" style="background-color: ${color}"></div>`
                                ).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate export/import section
     */
    generateExportImportSection() {
        return `
            <div class="nexus-admin-section">
                <h3 class="nexus-admin-section-title">💾 Export/Import</h3>
                <div class="nexus-export-import">
                    <button class="nexus-btn nexus-btn-primary" id="nexus-export-btn">Export Settings</button>
                    <button class="nexus-btn nexus-btn-secondary" id="nexus-import-btn">Import Settings</button>
                    <input type="file" id="nexus-import-file" class="nexus-file-input" accept=".json">
                    <br>
                    <button class="nexus-btn nexus-btn-secondary" id="nexus-reset-btn">Reset to Defaults</button>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle admin panel
        const toggleBtn = document.getElementById('nexus-admin-toggle');
        const closeBtn = document.querySelector('.nexus-admin-close');
        const panel = document.getElementById('nexus-admin-panel');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleAdminPanel());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAdminPanel());
        }

        // Close panel on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeAdminPanel();
            }
        });

        // Color customization
        this.setupColorEventListeners();

        // Effect toggles
        this.setupEffectEventListeners();

        // Template selection
        this.setupTemplateEventListeners();

        // Tag styles
        this.setupTagStyleEventListeners();

        // Presets
        this.setupPresetEventListeners();

        // Export/Import
        this.setupExportImportEventListeners();

        console.log('👂 Event listeners setup complete');
    }

    /**
     * Setup color customization event listeners
     */
    setupColorEventListeners() {
        const colorPreviews = document.querySelectorAll('.nexus-color-preview');
        const colorPicker = document.getElementById('nexus-color-picker');
        const hexInput = document.getElementById('nexus-hex-input');
        let selectedColorKey = 'primary';

        colorPreviews.forEach(preview => {
            preview.addEventListener('click', () => {
                // Remove active class from all
                colorPreviews.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked
                preview.classList.add('active');
                
                // Set selected color key
                selectedColorKey = preview.dataset.colorKey;
                
                // Update color picker value
                if (colorPicker) {
                    colorPicker.value = this.customizations.colors[selectedColorKey];
                }
                
                // Update hex input value
                if (hexInput) {
                    hexInput.value = this.customizations.colors[selectedColorKey];
                }
            });
        });

        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.updateColor(selectedColorKey, e.target.value);
                if (hexInput) {
                    hexInput.value = e.target.value;
                }
            });
        }

        if (hexInput) {
            hexInput.addEventListener('input', (e) => {
                if (this.isValidHexColor(e.target.value)) {
                    this.updateColor(selectedColorKey, e.target.value);
                    if (colorPicker) {
                        colorPicker.value = e.target.value;
                    }
                }
            });
        }
    }

    /**
     * Setup effect toggle event listeners
     */
    setupEffectEventListeners() {
        const effectToggles = document.querySelectorAll('.nexus-toggle-switch');
        
        effectToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const effect = toggle.dataset.effect;
                const isActive = toggle.classList.contains('active');
                
                toggle.classList.toggle('active', !isActive);
                toggle.setAttribute('aria-checked', !isActive);
                
                this.customizations.effects[effect] = !isActive;
                this.applyEffectToggle(effect, !isActive);
                this.saveCustomizations();
            });
        });
    }

    /**
     * Setup template selection event listeners
     */
    setupTemplateEventListeners() {
        const templateItems = document.querySelectorAll('.nexus-template-item[data-template]');
        
        templateItems.forEach(item => {
            item.addEventListener('click', () => {
                const template = item.dataset.template;
                
                // Remove active class from all templates
                templateItems.forEach(t => t.classList.remove('active'));
                
                // Add active class to selected
                item.classList.add('active');
                
                // Update customization
                this.customizations.templates.postLayout = template;
                this.applyTemplateChange(template);
                this.saveCustomizations();
            });
        });
    }

    /**
     * Setup tag style event listeners
     */
    setupTagStyleEventListeners() {
        const tagStyleItems = document.querySelectorAll('[data-tag-style]');
        
        tagStyleItems.forEach(item => {
            item.addEventListener('click', () => {
                const style = item.dataset.tagStyle;
                
                // Remove active class from all
                tagStyleItems.forEach(t => t.classList.remove('active'));
                
                // Add active class to selected
                item.classList.add('active');
                
                // Update customization
                this.customizations.tagStyles.style = style;
                this.applyTagStyleChange(style);
                this.saveCustomizations();
            });
        });
    }

    /**
     * Setup preset event listeners
     */
    setupPresetEventListeners() {
        const presetItems = document.querySelectorAll('.nexus-preset-item');
        
        presetItems.forEach(item => {
            item.addEventListener('click', () => {
                const presetName = item.dataset.preset;
                const preset = this.presets.find(p => p.name === presetName);
                
                if (preset) {
                    this.applyPreset(preset);
                    this.showNotification(`Applied ${presetName} preset`, 'success');
                }
            });
        });
    }

    /**
     * Setup export/import event listeners
     */
    setupExportImportEventListeners() {
        const exportBtn = document.getElementById('nexus-export-btn');
        const importBtn = document.getElementById('nexus-import-btn');
        const importFile = document.getElementById('nexus-import-file');
        const resetBtn = document.getElementById('nexus-reset-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                if (importFile) {
                    importFile.click();
                }
            });
        }

        if (importFile) {
            importFile.addEventListener('change', (e) => this.importSettings(e));
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
    }

    /**
     * Toggle admin panel open/close
     */
    toggleAdminPanel() {
        const panel = document.getElementById('nexus-admin-panel');
        const toggleBtn = document.getElementById('nexus-admin-toggle');
        
        if (panel) {
            this.isOpen = !this.isOpen;
            panel.classList.toggle('open', this.isOpen);
            if (toggleBtn) {
                toggleBtn.classList.toggle('active', this.isOpen);
            }
            
            // Add focus management
            if (this.isOpen) {
                panel.focus();
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                toggleBtn?.focus();
            }
        }
    }

    /**
     * Close admin panel
     */
    closeAdminPanel() {
        const panel = document.getElementById('nexus-admin-panel');
        const toggleBtn = document.getElementById('nexus-admin-toggle');
        
        this.isOpen = false;
        if (panel) {
            panel.classList.remove('open');
        }
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
            toggleBtn.focus();
        }
        document.body.style.overflow = '';
    }

    /**
     * Update color and apply changes
     */
    updateColor(colorKey, colorValue) {
        this.customizations.colors[colorKey] = colorValue;
        
        // Update preview
        const preview = document.querySelector(`[data-color-key="${colorKey}"]`);
        if (preview) {
            preview.style.backgroundColor = colorValue;
        }
        
        // Apply to CSS variables
        this.applyColorChange(colorKey, colorValue);
        this.saveCustomizations();
    }

    /**
     * Apply color change to CSS variables
     */
    applyColorChange(colorKey, colorValue) {
        const root = document.documentElement;
        
        // Map color keys to CSS variables
        const colorMap = {
            primary: '--color-primary',
            secondary: '--color-secondary',
            accent: '--color-accent',
            background: '--color-background',
            text: '--color-text',
            border: '--color-border'
        };

        if (colorMap[colorKey]) {
            root.style.setProperty(colorMap[colorKey], colorValue);
        }
        
        console.log(`🎨 Updated ${colorKey} color to ${colorValue}`);
    }

    /**
     * Apply effect toggle
     */
    applyEffectToggle(effect, enabled) {
        const body = document.body;
        
        // Add/remove CSS classes based on effect
        const effectClasses = {
            animations: 'nexus-animations-enabled',
            parallax: 'nexus-parallax-enabled',
            hover: 'nexus-hover-enabled',
            transitions: 'nexus-transitions-enabled',
            blur: 'nexus-blur-enabled',
            shadows: 'nexus-shadows-enabled',
            gradients: 'nexus-gradients-enabled'
        };

        if (effectClasses[effect]) {
            body.classList.toggle(effectClasses[effect], enabled);
        }
        
        console.log(`⚡ ${enabled ? 'Enabled' : 'Disabled'} ${effect} effect`);
    }

    /**
     * Apply template change
     */
    applyTemplateChange(template) {
        const body = document.body;
        
        // Remove existing template classes
        body.className = body.className.replace(/nexus-template-\w+/g, '');
        
        // Add new template class
        body.classList.add(`nexus-template-${template}`);
        
        console.log(`📝 Applied ${template} template`);
    }

    /**
     * Apply tag style change
     */
    applyTagStyleChange(style) {
        // Update sample tags in preview
        const sampleTags = document.querySelectorAll('.nexus-sample-tag');
        sampleTags.forEach(tag => {
            tag.className = `nexus-sample-tag tag-style-${style}`;
        });
        
        // Apply to actual tags on the page
        const pageTags = document.querySelectorAll('.tag, .post-tag');
        pageTags.forEach(tag => {
            tag.className = tag.className.replace(/tag-style-\w+/g, '');
            tag.classList.add(`tag-style-${style}`);
        });
        
        console.log(`🏷️ Applied ${style} tag style`);
    }

    /**
     * Apply preset configuration
     */
    applyPreset(preset) {
        // Merge preset customizations
        this.customizations = { ...this.customizations, ...preset.customizations };
        
        // Apply all changes
        this.applyCustomizations();
        
        // Update UI
        this.updateAdminPanelUI();
        
        // Save changes
        this.saveCustomizations();
        
        console.log(`🎯 Applied preset: ${preset.name}`);
    }

    /**
     * Apply all customizations
     */
    applyCustomizations() {
        // Apply colors
        Object.entries(this.customizations.colors).forEach(([key, value]) => {
            this.applyColorChange(key, value);
        });

        // Apply effects
        Object.entries(this.customizations.effects).forEach(([key, value]) => {
            this.applyEffectToggle(key, value);
        });

        // Apply templates
        if (this.customizations.templates.postLayout) {
            this.applyTemplateChange(this.customizations.templates.postLayout);
        }

        // Apply tag styles
        if (this.customizations.tagStyles.style) {
            this.applyTagStyleChange(this.customizations.tagStyles.style);
        }

        console.log('🔧 Applied all customizations');
    }

    /**
     * Update admin panel UI to reflect current settings
     */
    updateAdminPanelUI() {
        // This would be called after applying presets to update the UI
        // For now, we'll regenerate the panel
        const panel = document.getElementById('nexus-admin-panel');
        if (panel && this.isOpen) {
            const wasOpen = this.isOpen;
            this.closeAdminPanel();
            panel.remove();
            this.createAdminPanel();
            this.setupEventListeners();
            if (wasOpen) {
                this.toggleAdminPanel();
            }
        }
    }

    /**
     * Export settings to JSON file
     */
    exportSettings() {
        const dataStr = JSON.stringify(this.customizations, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'nexus-customizations.json';
        link.click();
        
        this.showNotification('Settings exported!', 'success');
    }

    /**
     * Import settings from JSON file
     */
    importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                
                // Validate imported settings
                if (this.validateImportedSettings(importedSettings)) {
                    this.customizations = { ...this.customizations, ...importedSettings };
                    this.applyCustomizations();
                    this.updateAdminPanelUI();
                    this.saveCustomizations();
                    this.showNotification('Settings imported successfully!', 'success');
                } else {
                    throw new Error('Invalid settings file');
                }
            } catch (error) {
                this.showNotification('Failed to import settings', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        
        // Clear file input
        event.target.value = '';
    }

    /**
     * Validate imported settings
     */
    validateImportedSettings(settings) {
        // Basic validation - check if it has the required structure
        return settings && 
               typeof settings === 'object' &&
               (settings.colors || settings.effects || settings.templates || settings.tagStyles);
    }

    /**
     * Reset to default settings
     */
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all customizations to defaults?')) {
            // Clear localStorage
            localStorage.removeItem(this.options.storageKey);
            
            // Reset to defaults (reload page to get fresh state)
            this.showNotification('Resetting to defaults...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.nexus-notification');
        if (existing) {
            existing.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `nexus-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Validate hex color
     */
    isValidHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    /**
     * Get current customizations
     */
    getCustomizations() {
        return { ...this.customizations };
    }

    /**
     * Set customizations programmatically
     */
    setCustomizations(newCustomizations) {
        this.customizations = { ...this.customizations, ...newCustomizations };
        this.applyCustomizations();
        this.saveCustomizations();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusAdminCustomization;
} else if (typeof window !== 'undefined') {
    window.NexusAdminCustomization = NexusAdminCustomization;
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.nexusAdminConfig) {
            new NexusAdminCustomization(window.nexusAdminConfig);
        } else {
            // Initialize with default config
            new NexusAdminCustomization();
        }
    });
} else if (typeof window !== 'undefined') {
    // DOM is already ready
    if (window.nexusAdminConfig) {
        new NexusAdminCustomization(window.nexusAdminConfig);
    } else {
        // Initialize with default config
        new NexusAdminCustomization();
    }
}