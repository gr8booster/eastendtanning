{
  "brand_attributes": [
    "Approachable neighborhood premium",
    "Clean and trustworthy",
    "Energetic and modern with soft warmth",
    "Conversion-first and mobile-first"
  ],
  "design_personality": "Sun-drenched minimalism fused with Swiss grid discipline. Use warm airy surfaces (sunny gold) with crisp teal accents, light glass surfaces in heroes only, generous whitespace (1.5–2x current), and soft micro-motion. No heavy skeuomorphism.",
  "app_scope_analysis": {
    "app_type": "Multi-service local business website + admin command center",
    "audience": "Local residents in Mount Vernon, OH; staff and owners for admin",
    "key_tasks_frontsite": ["Discover services", "Call or get directions", "Start a booking (tanning/nails)", "Skim pricing", "Browse drinks menu", "Read hours/locations", "Submit leads (exit-intent)", "Read blog"],
    "key_tasks_admin": ["Monitor live KPIs", "Review leads", "Review/implement AI recommendations", "Manage campaigns"],
    "success_actions": ["Phone call tap", "Directions tap", "Booking submit", "Lead captured", "Admin uses recommendations"]
  },
  "semantic_color_system": {
    "note": "HSL tokens map to Tailwind via hsl(var(--token)). Keep existing brand hues; extend system for semantic and admin states.",
    "css_variables": {
      "root": ":root {\n  --background: 48 100% 99%;\n  --foreground: 210 15% 10%;\n  --card: 0 0% 100%;\n  --card-foreground: 210 15% 10%;\n  --popover: 0 0% 100%;\n  --popover-foreground: 210 15% 10%;\n  --primary: 42 92% 55%; /* Sunny Gold (#F59E0B) */\n  --primary-foreground: 210 20% 5%;\n  --secondary: 183 55% 43%; /* Teal (#14B8A6) */\n  --secondary-foreground: 0 0% 100%;\n  --accent: 172 45% 84%;\n  --accent-foreground: 210 15% 15%;\n  --muted: 210 25% 96%;\n  --muted-foreground: 210 10% 40%;\n  --border: 210 18% 88%;\n  --input: 210 18% 88%;\n  --ring: 183 55% 43%;\n  --destructive: 8 78% 55%;\n  --destructive-foreground: 0 0% 100%;\n  --success: 160 84% 39%;\n  --success-foreground: 160 100% 98%;\n  --warning: 43 92% 60%;\n  --warning-foreground: 210 20% 5%;\n  --info: 200 98% 40%;\n  --info-foreground: 210 20% 98%;\n  --radius: 0.75rem;\n  --shadow-1: 0 1px 2px rgba(10, 20, 30, 0.06), 0 1px 1px rgba(10, 20, 30, 0.04);\n  --shadow-2: 0 8px 24px rgba(10, 20, 30, 0.08), 0 2px 8px rgba(10, 20, 30, 0.06);\n  --btn-radius: 0.625rem;\n  --btn-shadow: 0 6px 14px rgba(10,20,30,0.08);\n  --motion-fast: 160ms;\n  --motion-base: 220ms;\n  --easing-standard: cubic-bezier(0.2, 0.8, 0.2, 1);\n}\n",
      "dark": ".dark {\n  --background: 210 15% 7%;\n  --foreground: 0 0% 100%;\n  --card: 210 15% 9%;\n  --card-foreground: 0 0% 100%;\n  --primary: 42 92% 60%;\n  --primary-foreground: 210 20% 5%;\n  --secondary: 183 55% 46%;\n  --secondary-foreground: 0 0% 100%;\n  --accent: 172 35% 22%;\n  --accent-foreground: 0 0% 100%;\n  --muted: 210 15% 16%;\n  --muted-foreground: 210 10% 70%;\n  --border: 210 15% 18%;\n  --input: 210 15% 18%;\n  --ring: 183 55% 52%;\n  --success: 160 84% 36%;\n  --warning: 43 92% 62%;\n  --info: 200 98% 46%;\n}\n"
    },
    "usage": {
      "primary": "Use for CTAs on public site (Call, Book, Directions preview chips).",
      "secondary": "Use for secondary CTAs and prices; anchor accent in menus and badges.",
      "success_warning_info": "Use in Admin for status chips, charts, and toasts.",
      "borders_cards": "Always use --border for soft, premium surfaces; cards stay white.",
      "gradients": "Only in hero sections and large decorative backgrounds; never on small UI."
    }
  },
  "gradients_and_texture": {
    "restriction_rule": "NEVER use dark/saturated gradient combos or gradients on small UI. Max 20% viewport. No text-heavy gradient backgrounds.",
    "allowed_patterns": [
      "Home hero: linear-gradient(135deg, hsl(43 96% 96%), hsl(183 45% 96%))",
      "Tanning hero: to-br from hsl(43 100% 97%) via hsl(43 96% 90%) to hsl(42 92% 85%)",
      "Laundry hero: to-br from hsl(183 45% 96%) via hsl(183 55% 90%) to hsl(183 55% 85%)",
      "Drinks hero: to-br from hsl(172 45% 94%) via hsl(183 45% 90%) to hsl(183 55% 85%)"
    ],
    "texture": "Use the existing .noise overlay utility as decorative layer at opacity 0.02–0.04 in heroes only."
  },
  "typography": {
    "fonts": {
      "display_serif": "Spectral (existing)",
      "sans": "Manrope (existing)",
      "alt_numbers_admin": "Space Grotesk for metrics (optional)",
      "installation": "Optionally add Google Fonts link for Space Grotesk in index.html if desired."
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base sm:text-lg",
      "body": "text-base (mobile text-sm)",
      "small": "text-sm or text-xs"
    },
    "usage": {
      "headings": "Use font-serif (Spectral) for H1/H2 on public pages and section titles in Admin for premium feel.",
      "body": "Use Manrope for body, forms, table data.",
      "numbers": "Use tracking-tight and tabular-nums (font-feature-settings: 'tnum' 1) for KPI figures."
    }
  },
  "layout_grid": {
    "container": "container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] (public) and max-w-[1400px] (admin)",
    "grid_patterns": [
      "Bento 2x2 on Home services (already implemented)",
      "Cards in 1/2/3/4 responsive grids with gap-6 to gap-8",
      "Forms max-w-2xl centered block, not text-centered"
    ],
    "spacing": "Use 12–24px on cards, 32–48px vertical section padding on mobile, 64–96px on desktop."
  },
  "buttons": {
    "style_family": "Luxury / Elegant",
    "shape": "Rounded corners 10px (use --btn-radius)",
    "surface": "Solid tonal fills; soft elevation via --btn-shadow. No dark gradients on buttons.",
    "motion": "transition-colors and transition-shadow only; transforms via Framer Motion for special cases.",
    "variants": {
      "primary": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(42_92%_50%)] shadow-[var(--btn-shadow)]",
      "secondary": "bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]",
      "outline": "border-2 hover:bg-muted",
      "ghost": "hover:bg-accent hover:text-accent-foreground"
    },
    "sizes": {"sm": "h-8 px-3", "md": "h-10 px-5", "lg": "h-12 px-8"},
    "accessibility": "All buttons must include visible focus ring (ring-2 ring-ring ring-offset-2) and data-testid attributes."
  },
  "micro_interactions": {
    "rules": [
      "Never use transition-all; use transition-colors, transition-opacity, transition-shadow.",
      "Use framer-motion for transforms (y/scale/opacity) respecting prefers-reduced-motion.",
      "Hover: cards shadow-md→shadow-lg, slight raise via motion translateY: -2 to -4px.",
      "Header links: underline grow animation via after:width transition (already used).",
      "Buttons: subtle shadow intensify on hover; press state scale with motion to 0.98."
    ],
    "snippets": {
      "card_hover": "className=\"transition-shadow duration-200 hover:shadow-lg\"",
      "motion_raise": "<motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18, ease: 'easeOut' }}>...\n</motion.div>",
      "enter_reveal": "<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }} />"
    }
  },
  "parallax_and_scroll": {
    "hero_subtle_parallax": "Use framer-motion useScroll + useTransform to shift decorative dots/noise +/-10px on scroll. Keep motion subtle.",
    "sticky_cta_mobile": "Optionally add a sticky bottom bar on mobile with Call and Directions when scrolling service pages."
  },
  "accessibility": {
    "contrast": "Maintain WCAG AA — check text on gold backgrounds (use dark text).",
    "focus": "Focus-visible ring-ring ring-offset-2 on interactive controls.",
    "reduced_motion": "Wrap motion with prefers-reduced-motion check; skip parallax when reduced.",
    "hit_targets": "Min 44x44px on tap targets."
  },
  "testing_attributes": {
    "requirement": "All interactive and key informational elements MUST include data-testid attributes.",
    "naming": "kebab-case describing role and action, not appearance (e.g., login-form-submit-button, booking-name-input).",
    "where_to_apply": [
      "Buttons, links, form inputs, menus, tabs, error messages, KPIs, confirmation texts"
    ]
  },
  "page_patterns": {
    "home": {
      "hero": "Keep existing diagonal gradient + noise. Center headline only in hero; keep content areas left-aligned elsewhere.",
      "services_bento": "Use current 2x2 with stronger hover elevation and image scale (already present).",
      "locations_strip": "Keep two-column cards with action buttons; add data-testid on all buttons (already present)."
    },
    "tanning": {
      "levels_tabs": "Keep 5-tab layout using shadcn Tabs; add entrance motion on Tab content.",
      "pricing": "PricingTable stays with generous spacing and note. No gradient in pricing area.",
      "cta": "Primary CTA uses gold; outline secondary for call; ensure sticky CTA on mobile optional."
    },
    "laundry": {
      "features_grid": "4-up feature cards; maintain rounded icons with secondary/10 background.",
      "locations_compare": "Two cards with feature lists; ensure price chips use badges with brand colors."
    },
    "drinks": {
      "menu": "Two-column cards each category; price in secondary color, border separators.",
      "why_section": "Use light gradient background only; avoid gradient under long paragraphs."
    },
    "nails": {
      "services_grid": "3-up cards; accent icons in secondary; generous spacing.",
      "booking": "Form max-w-2xl; keep outline inputs with clear labels."
    },
    "blog": {
      "list": "Use Card for each post; on hover add shadow-lg and subtle lift.",
      "post": "Readable width (prose max-w-3xl), larger line-height, no gradients behind article content."
    },
    "admin": {
      "header": "Gradient bar allowed; keep white text with high contrast. Avoid purple-pink gradients; solid accents OK.",
      "kpi_cards": "Use serif titles and big tabular numbers. Use color tokens for trend text.",
      "tabs": "Keep shadcn Tabs; add keyboard focus styles; ensure each tab trigger has data-testid if interacted in tests.",
      "empty_states": "Use icon + brief helper text; never leave blank canvas."
    }
  },
  "components_usage": {
    "primary_library": "Shadcn/UI (already installed)",
    "paths": [
      "./components/ui/button",
      "./components/ui/card",
      "./components/ui/tabs",
      "./components/ui/dialog",
      "./components/ui/sheet",
      "./components/ui/accordion",
      "./components/ui/badge",
      "./components/ui/input",
      "./components/ui/textarea",
      "./components/ui/select",
      "./components/ui/calendar",
      "./components/ui/toaster (sonner)",
      "./components/ui/progress",
      "./components/ui/table",
      "./components/ui/tooltip"
    ],
    "new_components_to_add": [
      {
        "name": "RevenueChart.jsx",
        "where": "./components/dashboard/RevenueChart.jsx",
        "purpose": "Admin: monthly revenue trend", 
        "snippet_js": "import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';\nexport const RevenueChart = ({ data = [] }) => {\n  return (\n    <div className=\"h-64 w-full\" data-testid=\"revenue-chart\">\n      <ResponsiveContainer width=\"100%\" height=\"100%\">\n        <AreaChart data={data}>\n          <defs>\n            <linearGradient id=\"rev\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n              <stop offset=\"0%\" stopColor=\"hsl(var(--secondary))\" stopOpacity={0.6} />\n              <stop offset=\"100%\" stopColor=\"hsl(var(--secondary))\" stopOpacity={0.05} />\n            </linearGradient>\n          </defs>\n          <XAxis dataKey=\"label\" tick={{ fontSize: 12 }} />\n          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v)=>`$${v}`} width={60} />\n          <Tooltip contentStyle={{ borderRadius: 8, borderColor: 'hsl(var(--border))' }} />\n          <Area type=\"monotone\" dataKey=\"value\" stroke=\"hsl(var(--secondary))\" fill=\"url(#rev)\" strokeWidth={2} />\n        </AreaChart>\n      </ResponsiveContainer>\n    </div>\n  );\n};"
      }
    ]
  },
  "libraries": {
    "framer_motion": {
      "status": "installed",
      "usage": "Use for entrance and hover transforms only (not color transitions)."
    },
    "recharts": {
      "install": "npm i recharts",
      "usage": "Use in Admin RevenueChart and potential service performance charts.",
      "a11y": "Add data-testid to chart container and provide aria-label on wrapper if chart becomes critical."
    },
    "sonner": {
      "path": "./components/ui/sonner.jsx",
      "usage": "Use for toasts; prefer success/warning/info/severity mapped to brand tokens.",
      "note": "Avoid emoji-only messages; ensure accessible descriptions."
    }
  },
  "motion_principles": {
    "durations": {"fast": "160ms", "base": "220ms", "slow": "320ms"},
    "easing": "cubic-bezier(0.2,0.8,0.2,1)",
    "entrance": "stagger children 60ms in grids; translateY 16→0, opacity 0→1",
    "scroll_reveal": "trigger once when 15% visible; avoid on paragraphs > 8 lines"
  },
  "forms": {
    "inputs": "Use label + input with text-sm help copy; inputs with h-11, rounded-md, placeholder:text-muted-foreground/70.",
    "validation": "Show inline text-xs error under field with data-testid=\"<form>-<field>-error\".",
    "date_time": "If replacing native datetime-local, use shadcn Calendar + Popover (./components/ui/calendar) and ensure keyboard navigation."
  },
  "icons": {
    "library": "lucide-react",
    "rule": "Do not use emoji icons for UI actions."
  },
  "image_urls": [
    {"category": "hero_tanning_lifestyle", "url": "https://images.pexels.com/photos/4846084/pexels-photo-4846084.jpeg", "use": "Optional secondary image in Tanning page mid-section card or hero aside (keep readable contrast)."},
    {"category": "hero_nails", "url": "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop", "use": "Nails hero supporting image or services card."},
    {"category": "hero_laundry", "url": "https://images.unsplash.com/photo-1583810266903-fb9cc6e84376?crop=entropy&cs=srgb&fm=jpg&q=85", "use": "Laundry page background card image if needed."},
    {"category": "drinks_menu_color", "url": "https://images.unsplash.com/photo-1603662953670-14a5344b936d?crop=entropy&cs=srgb&fm=jpg&q=85", "use": "Drinks category header or promotional card."},
    {"category": "drinks_bottles_gradient", "url": "https://images.unsplash.com/photo-1645387492451-f086e8cee6d6?crop=entropy&cs=srgb&fm=jpg&q=85", "use": "Decorative strip on Drinks page (avoid behind dense text)."}
  ],
  "component_path": {
    "shadcn": {
      "button": "./components/ui/button.jsx",
      "card": "./components/ui/card.jsx",
      "tabs": "./components/ui/tabs.jsx",
      "dialog": "./components/ui/dialog.jsx",
      "sheet": "./components/ui/sheet.jsx",
      "accordion": "./components/ui/accordion.jsx",
      "badge": "./components/ui/badge.jsx",
      "input": "./components/ui/input.jsx",
      "textarea": "./components/ui/textarea.jsx",
      "select": "./components/ui/select.jsx",
      "calendar": "./components/ui/calendar.jsx",
      "table": "./components/ui/table.jsx",
      "progress": "./components/ui/progress.jsx",
      "toaster_sonner": "./components/ui/sonner.jsx"
    },
    "existing_custom": {
      "BookingForm": "./components/BookingForm.jsx",
      "PricingTable": "./components/PricingTable.jsx",
      "LeadCapturePopup": "./components/LeadCapturePopup.jsx",
      "ServiceCard": "./components/ServiceCard.jsx",
      "dashboard_cards": "./components/dashboard/*.jsx"
    }
  },
  "ref_inspirations": {
    "search_1": "Tanning/Nails/Laundry premium websites: Dribbble/Behance hero cards, booking flows; parallax hero references.",
    "search_2": "Beverage/dirty soda menu designs emphasizing colorful menu photos and simple price layout."
  },
  "instructions_to_main_agent": [
    "Do not change functional flows; only visual refinements and class updates.",
    "Replace any remaining 'transition-all' class occurrences with 'transition-colors' and/or 'transition-shadow'. For transform animations, wrap components with framer-motion as per micro_interactions.snippets.",
    "Ensure every interactive element has a data-testid following kebab-case (role-first).",
    "Keep gradients only in hero/large decorative sections; if any gradient risks readability or exceeds 20% viewport, switch to solid background immediately.",
    "Adopt container widths and spacing rules across all pages (see layout_grid).",
    "Admin: introduce optional RevenueChart.jsx using Recharts; place under KPI section with data-testid=\"revenue-chart\".",
    "Public site: use primary (gold) for main CTAs (call/book) and secondary (teal) for navigational CTAs (directions/view menu).",
    "Maintain serif headings (Spectral) and sans body (Manrope).",
    "No universal center alignment of app containers. Keep reading areas left-aligned.",
    "Use sonner toaster component at ./components/ui/sonner.jsx for notifications.",
    "If a date picker is required beyond native input, use shadcn Calendar only.",
    "Add aria-labels and descriptive titles on icons where they are standalone actions."
  ],
  "example_class_recipes": {
    "primary_cta": "inline-flex items-center gap-2 h-12 px-6 rounded-[var(--btn-radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold transition-colors duration-200 hover:bg-[hsl(42_92%_50%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "card_base": "rounded-xl border bg-card text-card-foreground shadow transition-shadow duration-200 hover:shadow-lg",
    "nav_link": "relative text-sm font-medium hover:text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-[width] after:duration-200 hover:after:w-full"
  },
  "responsiveness": {
    "mobile_first": "Design from 360px up; hide complex grids until md breakpoint.",
    "breakpoints": "sm: 640, md: 768, lg: 1024, xl: 1280",
    "sticky_actions": "On mobile service pages, optionally add sticky Call/Directions bar (h-14)."
  },
  "performance": {
    "images": "Use width/height attributes where possible and modern formats from CDNs; set loading=lazy for non-hero images.",
    "motion": "Avoid heavy continuous animations; prefer on-interact or on-view.",
    "css": "Reuse utilities; avoid custom global rules besides tokens."
  },
  "a11y_testing_checklist": [
    "Keyboard navigation covers header links, tabs, dialogs, and forms",
    "Visible focus outlines",
    "All CTAs have data-testid and clear accessible names",
    "Color contrast meets AA"
  ],
  "known_gaps_to_polish": [
    "Consider replacing native datetime-local with shadcn Calendar in BookingForm for consistency (optional).",
    "Audit mobile navigation sheet links to include data-testid on each link.",
    "Replace any incidental emoji in Admin headers with lucide icons if used as actionable controls."
  ],
  "gradients_restriction_enforcement": {
    "rule": "If gradient area > 20% viewport or affects readability, use solid colors.",
    "where_allowed": ["Hero backgrounds", "Section backgrounds (non-reading heavy)", "Decorative overlays"],
    "where_forbidden": ["Cards/content blocks", "Tables, forms, and reading areas", "Small UI elements < 100px"]
  },
  "final_note": "This guideline is tailored to the existing React + Tailwind + shadcn stack using .js/.jsx files. Keep all imports and paths consistent with current project structure."
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>