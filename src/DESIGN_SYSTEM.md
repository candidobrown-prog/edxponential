# edXponential Design System — Apple Quality

## 🎯 Core Philosophy

**"A beautifully engineered operating system for education, leadership, business, and innovation."**

The design system combines:
- **Apple-level simplicity** — Minimal, intentional, elegant
- **Notion-level breathing room** — Generous whitespace, never crowded
- **Stripe-level polish** — Premium, refined, frictionless
- **Arc Browser modernity** — Forward-thinking, no skeuomorphism
- **Calm.com emotional intelligence** — Reduces cognitive load, inspires trust

### Core Principles
1. **Whitespace is a feature** — Never crowd the interface
2. **Typography does the heavy lifting** — Perfect hierarchy through type
3. **Motion is subtle** — Smooth but never flashy
4. **Focus over features** — Show users what they need, when they need it
5. **Dark backgrounds are optional** — Light mode is primary, premium
6. **Every pixel is intentional** — Nothing is accidental

---

## 📐 Spacing System

All spacing follows a **base unit of 4px** (Tailwind default).

### Semantic Spacing
```
--xs: 0.5rem (4px)
--sm: 1rem (8px)
--md: 1.5rem (12px)
--lg: 2rem (16px)
--xl: 2.5rem (20px)
--2xl: 3rem (24px)
--3xl: 4rem (32px)
--4xl: 6rem (48px)
--5xl: 8rem (64px)
```

### Application
- **Page margins**: `px-6 md:px-8 lg:px-12` (24px, 32px, 48px)
- **Section padding**: `py-24 md:py-32 lg:py-40` (96px, 128px, 160px)
- **Card padding**: `p-6 md:p-8` (24px, 32px)
- **Component spacing**: `gap-4 md:gap-6` (16px, 24px)
- **Text spacing**: `space-y-6` between paragraphs

**Never use less than 16px between major elements.**

---

## 🔤 Typography System

### Font Stack
```
'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif
```

### Type Scale
| Role | Class | Size | Weight | Line Height | Letter Spacing |
|------|-------|------|--------|-------------|---|
| Display (Hero) | `.font-display` | 3.2–7.5rem | 900 | 0.9 | -0.04em |
| Heading 1 | `h1` / `.text-4xl` | 2.25rem | 900 | 1.1 | -0.04em |
| Heading 2 | `h2` / `.text-3xl` | 1.875rem | 900 | 1.1 | -0.03em |
| Heading 3 | `h3` / `.text-2xl` | 1.5rem | 700 | 1.25 | -0.02em |
| Title | `.font-title` | 1.125rem | 700 | 1.4 | -0.02em |
| Body | `p` | 1rem | 400 | 1.6 | -0.01em |
| Refined | `.font-refined` | 0.875rem | 500 | 1.5 | -0.01em |
| Small | `.text-sm` | 0.875rem | 400 | 1.6 | 0 |
| Tiny | `.text-xs` | 0.75rem | 600 | 1.5 | 0.01em |

### Typography Classes
```css
.font-display   /* Font weight 900, tight letter spacing */
.font-title     /* Font weight 700, -0.02em spacing */
.font-refined   /* Font weight 500, elegant */
.text-tight     /* Line height 1.2, headlines */
.text-relaxed   /* Line height 1.8, prose */
.text-balance   /* Wraps text elegantly */
```

### Example Usage
```html
<!-- Hero display -->
<h1 class="font-display">Where the World's Most Ambitious Leaders Build the Future</h1>

<!-- Section heading -->
<h2 class="text-3xl md:text-4xl font-black tracking-[-0.04em]">Everything you need to lead</h2>

<!-- Body text -->
<p class="text-lg leading-relaxed text-muted-foreground max-w-2xl">
  edXponential is the operating system for education leaders...
</p>
```

---

## 🎨 Color Palette

### Primary Colors
- **Background**: Pure white (`#ffffff`)
- **Foreground**: Rich black (`#0f1419`)
- **Primary Brand**: Blue (`hsl(220 90% 56%)`)

### Secondary Colors
- **Secondary**: Soft off-white (`#f7f7f7`, 97% brightness)
- **Muted**: Light gray (`#ededed`, 93% brightness)
- **Border**: Very light gray (`#ebebeb`, 92% brightness)
- **Input**: Premium white (`#f3f3f3`, 96% brightness)

### Text Colors
- **Foreground**: Rich black (`#0f1419`)
- **Muted Foreground**: Warm gray (`#737373`, 45%)
- **Accent**: Brand blue

### Never Use
- ❌ Pure black (#000000) — use rich black (#0f1419)
- ❌ Harsh colors
- ❌ Heavy gradients (except subtle backgrounds)
- ❌ Neon or cyberpunk aesthetics

---

## 🔲 Border Radius

```css
--radius: 0.75rem (12px)  /* Standard for all components */
```

### Application
- **Buttons**: `rounded-lg` (12px)
- **Cards**: `rounded-lg` (12px)
- **Inputs**: `rounded-lg` (12px)
- **Modals**: `rounded-lg` (12px)

**Consistency is key.** All components use the same radius.

---

## 💫 Shadows

### Shadow System
```css
.shadow-apple      /* Subtle: 0 1px 3px rgba(0,0,0,0.06) */
.shadow-apple-md   /* Medium: 0 4px 8px rgba(0,0,0,0.08) */
.shadow-apple-lg   /* Large: 0 8px 16px rgba(0,0,0,0.1) */
.shadow-soft       /* Very subtle: 0 1px 3px rgba(0,0,0,0.05) */
```

### Usage
- **Hover cards**: `.shadow-apple-md`
- **Default cards**: `.shadow-apple`
- **Floating elements**: `.shadow-apple-lg`
- **Minimal**: `.shadow-soft`

**Never use harsh or heavy shadows.** Apple uses subtle elevation.

---

## ✨ Transitions & Motion

### Transition Classes
```css
.transition-premium   /* 0.3s cubic-bezier(0.23, 1, 0.32, 1) */
.transition-smooth    /* 0.2s cubic-bezier(0.4, 0, 0.2, 1) */
```

### Motion Guidelines
- **Page transitions**: 400–500ms, fade + slide
- **Hover states**: 200–300ms
- **Component reveals**: 300–500ms
- **Loading states**: Continuous subtle animation

### Example
```jsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  Content
</motion.div>
```

### Animation Libraries
- **Framer Motion** — Primary for page/component animations
- **CSS Transitions** — For hover/focus states
- **No heavy 3D** — Keep GPU usage light

---

## 🔘 Component Standards

### Buttons
**Default variant** (Primary action):
```jsx
<button className="h-10 px-6 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-premium active:scale-95 shadow-apple-md">
  Call to Action
</button>
```

**Outline variant** (Secondary):
```jsx
<button className="h-10 px-6 rounded-lg border border-border bg-background text-foreground hover:bg-secondary transition-premium">
  Secondary
</button>
```

**Ghost variant** (Tertiary):
```jsx
<button className="h-10 px-6 rounded-lg text-foreground hover:bg-secondary/50 transition-premium">
  Tertiary
</button>
```

### Input Fields
```jsx
<input
  className="h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-base shadow-apple transition-premium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
  placeholder="Enter text..."
/>
```

### Cards
```jsx
<div className="p-6 md:p-8 rounded-lg border border-border bg-background hover:shadow-apple-md transition-premium">
  Content
</div>
```

### Modals/Dialogs
- White background
- Subtle shadow
- Rounded corners
- Generous padding
- Smooth fade-in
- Focus trap

---

## 📱 Responsive Design

### Breakpoints (Tailwind standard)
```
sm:  640px   (tablets)
md:  768px   (tablet landscape / small desktop)
lg:  1024px  (desktop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

### Mobile-First Approach
```jsx
<div className="px-6 md:px-8 lg:px-12 text-lg md:text-xl lg:text-2xl">
  /* Mobile: 24px padding, responsive text */
  /* Desktop: Scales up elegantly */
</div>
```

### Mobile Excellence
- **Touch targets**: Minimum 44px (11mm)
- **Spacing**: Increased on mobile (more breathing room)
- **Typography**: Scale up for readability
- **Gestures**: Swipe, tap, pinch-to-zoom all supported
- **No scrolling overflow**: Ever

---

## 🌗 Light Mode (Primary)

The platform's primary experience is **beautiful light mode**.

- **Background**: Pure white
- **Secondary surfaces**: Soft off-white
- **Text**: Rich black
- **Accents**: Brand blue
- **Borders**: Very subtle gray

### Philosophy
Light mode feels:
- Clean and professional
- Luxurious and calm
- Focused and distraction-free
- Premium and intentional

---

## 🚀 Loading & Empty States

### Loading Skeletons
```jsx
<div className="animate-pulse space-y-4">
  <div className="h-12 rounded-lg bg-secondary"></div>
  <div className="h-4 rounded bg-secondary w-3/4"></div>
</div>
```

### Shimmer Effect (Optional)
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### Empty State Example
```jsx
<div className="text-center py-20">
  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4"></div>
  <h3 className="text-xl font-bold text-foreground mb-2">No items yet</h3>
  <p className="text-muted-foreground mb-6">Get started by creating your first item</p>
  <button>Create Item</button>
</div>
```

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Color contrast**: 4.5:1 minimum for text
- **Focus states**: Always visible (ring + offset)
- **Font size**: Minimum 16px for body text
- **Touch targets**: 44px minimum
- **Keyboard navigation**: Fully supported
- **Reduced motion**: Respected

### Example Focus State
```jsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
```

---

## 🎯 Anti-Patterns

### Never Do
- ❌ Crowded dashboards — Use progressive disclosure
- ❌ Harsh or dark shadows — Keep Apple-subtle
- ❌ Heavy gradients — Avoid unless necessary
- ❌ Inconsistent spacing — Follow the system
- ❌ Neon colors — Stay premium and elegant
- ❌ Flashy animations — Motion should be purposeful
- ❌ Small text — Minimum 16px for body
- ❌ Low contrast — Always 4.5:1+ for text
- ❌ Crowded buttons — Space them generously
- ❌ Stock UI kits — Everything should feel custom

---

## 🔧 Implementation Checklist

When building a new page or feature:

- [ ] Typography hierarchy is clear and elegant
- [ ] Whitespace breathes and feels intentional
- [ ] Colors match the premium palette
- [ ] Shadows are subtle (Apple-style)
- [ ] Transitions are smooth (no janky animations)
- [ ] Mobile design is flawless
- [ ] Accessibility is perfect (keyboard + screen reader)
- [ ] Loading states are beautiful
- [ ] Empty states are helpful
- [ ] Buttons feel tactile and satisfying
- [ ] Forms feel effortless and clean
- [ ] No cognitive overload
- [ ] Responsive scaling works perfectly
- [ ] Dark mode (if implemented) feels premium
- [ ] Every pixel feels intentional

---

## 📚 Examples

### Hero Section
```jsx
<section className="min-h-screen pt-24 flex items-center justify-center px-6">
  <div className="max-w-5xl mx-auto text-center">
    <h1 className="font-display mb-6">
      Where the World's Most<br />Ambitious Leaders<br />
      <span className="text-primary">Build the Future</span>
    </h1>
    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
      edXponential is the operating system for education leaders...
    </p>
    <button className="h-10 px-6 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-premium">
      Get Started
    </button>
  </div>
</section>
```

### Feature Card
```jsx
<div className="p-6 md:p-8 rounded-lg border border-border bg-background hover:shadow-apple-md transition-premium">
  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
    <Icon className="w-5 h-5 text-primary" />
  </div>
  <h3 className="text-lg font-title text-foreground mb-2">Feature Title</h3>
  <p className="text-muted-foreground leading-relaxed">Feature description goes here...</p>
</div>
```

### Dashboard Section
```jsx
<section className="py-32 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-black tracking-[-0.04em] mb-12">Section Title</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</section>
```

---

## 🌟 Final Goal

When complete, the platform should feel like:

**"An Apple-quality operating system for education, leadership, business, and innovation."**

Every interaction should make users feel:
- ✨ Trust and sophistication
- 🧘 Calm and clarity
- 🚀 Intelligence and speed
- 🎯 Exclusivity and premium quality
- 💎 Worthy of being featured by Apple

---

**Version**: 1.0  
**Last Updated**: May 2026  
**Status**: 🚀 Production Ready