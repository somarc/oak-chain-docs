# Oak Chain Styling Port

Complete CSS styling extracted from the VitePress site and aligned with Adobe/AEM boilerplate patterns for porting to another platform.

## Files

- **`STYLING-PORT.css`** - Complete CSS aligned with boilerplate structure (header, footer, 404, main page, buttons, etc.)
- **`STYLING-PORT-EXAMPLES.html`** - Example HTML templates using boilerplate patterns
- **`STYLING-PORT-README.md`** - This file

## Boilerplate Alignment

This CSS follows the Adobe/AEM boilerplate structure:

- ✅ Uses boilerplate CSS variable naming (`--background-color`, `--text-color`, etc.)
- ✅ Uses Roboto/Roboto Condensed fonts with fallbacks
- ✅ Uses boilerplate font size variables with responsive breakpoints
- ✅ Integrates with `.header` and `.footer` blocks with `data-block-status`
- ✅ Uses boilerplate button classes (`.button`, `.button.secondary`)
- ✅ Uses boilerplate section patterns (`.section`, `.section.highlight`)
- ✅ Follows boilerplate responsive breakpoint (900px)
- ✅ Uses `body.appear` pattern for progressive enhancement

## Color Palette

The theme uses an Ethereum-inspired dark color scheme integrated with boilerplate variables:

- **Ethereum Purple**: `#627EEA` (primary brand color → `--link-color`)
- **Light Purple**: `#8C8DFC` (secondary brand color → `--link-hover-color`)
- **Deep Space**: `#0f0f23` (main background → `--background-color`)
- **Dark Navy**: `#1a1a2e` (alternate background → `--light-color`)
- **Midnight Blue**: `#16213e` (elevated elements → `--dark-color`)

## CSS Variables

The CSS extends the boilerplate variables with Oak Chain-specific colors:

```css
/* Boilerplate variables (used) */
--background-color: #0f0f23;
--text-color: rgba(255, 255, 255, 0.95);
--link-color: #627EEA;
--link-hover-color: #8C8DFC;

/* Oak Chain extensions */
--brand-primary: #627EEA;
--brand-secondary: #8C8DFC;
--bg-alt: #1a1a2e;
--bg-code: #0a0a1a;
```

## Components

### Header/Navigation

Follows boilerplate pattern with `.header` block:

```html
<header>
  <div class="header" data-block-status="loaded">
    <!-- Navigation content -->
  </div>
</header>
```

**Key features:**
- Sticky header with backdrop blur
- Logo with icon and text
- Search bar with keyboard shortcut indicator
- Main navigation links
- Theme toggle and GitHub link icons
- Responsive layout

### 404 Page

Centered 404 page with:
- Large "404" heading using boilerplate heading sizes
- "PAGE NOT FOUND" subheading
- Quote box with left border accent
- "Take me home" button using boilerplate button styles

**Key classes:**
- `.page-404` - Main 404 container
- `.quote-box` - Styled quote container with left border
- `.home-button` - Call-to-action button

### Main Page / Hero

Hero section using boilerplate section pattern:

```html
<section class="section">
  <div>
    <div class="hero-section">
      <!-- Hero content -->
    </div>
  </div>
</section>
```

**Key classes:**
- `.hero-section` - Hero container
- `.hero-name` - Site name with gradient
- `.hero-text` - Main hero text
- `.hero-tagline` - Tagline text
- `.hero-actions` - Button container

### Buttons

Uses boilerplate button classes with Oak Chain styling:

- `.button` - Primary button (uses `--link-color`)
- `.button.secondary` - Secondary button with border
- `.button.brand` - Brand button with gradient and glow

```html
<a href="#" class="button">Primary</a>
<a href="#" class="button secondary">Secondary</a>
<a href="#" class="button brand">Brand</a>
```

### Footer

Follows boilerplate pattern with `.footer` block:

```html
<footer>
  <div class="footer" data-block-status="loaded">
    <!-- Footer content -->
  </div>
</footer>
```

## Typography

- **Base font**: Roboto (with fallback)
- **Heading font**: Roboto Condensed (with fallback)
- **Monospace font**: JetBrains Mono (for code blocks)
- **Font sizes**: Uses boilerplate variables (`--body-font-size-m`, `--heading-font-size-xxl`, etc.)

## Code Blocks

- Dark background (`--bg-code`)
- Purple border accent
- Inline code has purple background tint
- Uses boilerplate `pre` and `code` styles

## Responsive Design

The CSS uses the boilerplate responsive breakpoint:
- **900px**: Desktop adjustments (font sizes, padding, layout)

Mobile styles are applied below 900px.

## Usage

1. **Include the CSS file:**
   ```html
   <link rel="stylesheet" href="STYLING-PORT.css">
   ```

2. **Add Google Fonts (optional but recommended):**
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&family=Roboto+Condensed:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
   ```

3. **Use boilerplate HTML patterns:**
   - Header: `<div class="header" data-block-status="loaded">`
   - Footer: `<div class="footer" data-block-status="loaded">`
   - Sections: `<section class="section"><div>...</div></section>`
   - Buttons: `<a href="#" class="button">...</a>`

4. **Add body.appear script:**
   ```html
   <script>
     document.body.classList.add('appear');
   </script>
   ```

5. **See `STYLING-PORT-EXAMPLES.html`** for complete examples

## Key Features

- ✅ Aligned with Adobe/AEM boilerplate structure
- ✅ Dark theme optimized
- ✅ Fully responsive (900px breakpoint)
- ✅ Accessible (skip links, proper contrast)
- ✅ CSS variables for easy customization
- ✅ Smooth transitions and hover effects
- ✅ Custom scrollbar styling
- ✅ Gradient text effects
- ✅ Glow effects on brand elements
- ✅ Progressive enhancement (`body.appear`)

## Boilerplate Patterns Used

### Visibility Pattern
```html
<div class="header" data-block-status="loaded">
  <!-- Content visible when loaded -->
</div>
```

### Section Pattern
```html
<section class="section">
  <div>
    <!-- Content with max-width and padding -->
  </div>
</section>
```

### Button Pattern
```html
<a href="#" class="button">Primary</a>
<a href="#" class="button secondary">Secondary</a>
```

### Body Appear Pattern
```javascript
document.body.classList.add('appear');
```

## Customization

To customize colors, edit the CSS variables at the top of `STYLING-PORT.css`:

```css
:root {
  --background-color: #0f0f23;  /* Change background */
  --link-color: #627EEA;        /* Change primary color */
  --link-hover-color: #8C8DFC;  /* Change hover color */
  /* etc. */
}
```

All components will automatically use the updated colors while maintaining boilerplate compatibility.

## Notes

- The CSS assumes dark mode by default (no light mode styles included)
- Font fallbacks are included for Roboto/Roboto Condensed
- The search functionality styling is included but you'll need to implement the actual search logic
- Theme toggle styling is included but toggle functionality needs to be implemented
- All boilerplate patterns are preserved and extended with Oak Chain styling
