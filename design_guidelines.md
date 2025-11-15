{
  "project": {
    "name": "818 Food Truck Stop — Booking Page",
    "location": "818 Coshocton Ave, Mt Vernon, OH (opposite Kroger)",
    "price": "$70/day",
    "brand_personality": ["bold", "energetic", "urban street food", "professional yet approachable", "community-first"],
    "primary_conversion": "Book a date and pay via PayPal",
    "audience": "Food truck vendors seeking a high-traffic spot with power and water"
  },

  "design_personality": {
    "tone": "Urban, high-contrast, action-forward. Think asphalt + paint stripe + teal accent.",
    "style": ["Z-pattern hero", "Bento grid for benefits", "Card layout for schedule", "Asymmetrical blocks"],
    "do_not": [
      "No generic centered full-page layouts",
      "No dark/saturated purple/pink gradients",
      "No gradients on content blocks or small UI elements"
    ]
  },

  "typography": {
    "fonts": {
      "display": {
        "name": "Bebas Neue",
        "usage": "H1 only for bold, condensed urban headlines",
        "import": "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
      },
      "body": {
        "name": "Manrope",
        "usage": "H2–H6, body, forms, UI",
        "import": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
      }
    },
    "classes": {
      "h1": "font-[\'Bebas Neue\',_cursive] tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-none",
      "h2": "font-manrope font-semibold text-base md:text-lg",
      "body": "font-manrope text-sm md:text-base leading-relaxed",
      "overline": "uppercase tracking-widest text-xs font-semibold text-muted-foreground"
    },
    "notes": [
      "Follow Text Size Hierarchy: H1 text-4xl sm:text-5xl lg:text-6xl; H2 max text-lg; Body text-base (mobile text-sm)",
      "Avoid long line lengths (>70ch) in reading areas"
    ]
  },

  "color_system": {
    "tokens": {
      "--background": "48 100% 99%",
      "--foreground": "210 15% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "210 15% 10%",
      "--primary": "42 92% 55%",        
      "--primary-foreground": "210 20% 5%",
      "--secondary": "183 55% 43%",      
      "--secondary-foreground": "0 0% 100%",
      "--accent": "172 45% 84%",
      "--accent-foreground": "210 15% 15%",
      "--muted": "210 25% 96%",
      "--muted-foreground": "210 10% 40%",
      "--border": "210 18% 88%",
      "--ring": "183 55% 43%",
      "--destructive": "8 78% 55%",
      "--destructive-foreground": "0 0% 100%",
      "--radius": "0.75rem",
      "--asphalt-700": "210 15% 10%",
      "--asphalt-600": "210 12% 18%",
      "--sun-400": "42 92% 55%",
      "--teal-600": "183 55% 36%",
      "--success": "158 64% 40%",
      "--warning": "42 92% 55%",
      "--info": "200 90% 44%"
    },
    "semantics": {
      "cta": "bg-primary text-primary-foreground",
      "cta-alt": "bg-secondary text-secondary-foreground",
      "surface": "bg-card text-card-foreground",
      "muted-surface": "bg-muted text-muted-foreground",
      "border": "border-border",
      "status": {
        "success": "text-[hsl(var(--success))]",
        "warning": "text-[hsl(var(--warning))]",
        "info": "text-[hsl(var(--info))]",
        "critical": "text-[hsl(var(--destructive))]"
      }
    },
    "contrast": "Maintain WCAG AA; use bg-card for content blocks over any decorative background"
  },

  "gradients_and_texture": {
    "allowed": [
      {
        "name": "Sunrise Stripe",
        "class": "bg-[linear-gradient(90deg,hsl(43_96%_85%)_0%,hsl(172_45%_84%)_50%,hsl(183_45%_96%)_100%)]",
        "usage": "Section header stripe or hero top accent (<=20% viewport)"
      },
      {
        "name": "Teal Mist",
        "class": "bg-[linear-gradient(180deg,hsl(183_45%_96%)_0%,hsl(172_45%_84%)_100%)]",
        "usage": "Hero backdrop overlay under image with 0.8 opacity"
      }
    ],
    "texture": "Use .noise utility already in index.css; opacity <= 0.03",
    "restrictions": "Never apply to content blocks or small UI (<100px). If >20% viewport or readability drops, fallback to solid backgrounds."
  },

  "layout_and_grid": {
    "container": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    "sections": [
      {
        "id": "hero",
        "layout": "Z-pattern: left copy + CTA, right image; mobile stacks",
        "classes": "relative overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
      },
      {
        "id": "coming-soon",
        "layout": "Single Card banner with truck photo and date",
        "classes": "py-10"
      },
      {
        "id": "upcoming-7-days",
        "layout": "Calendar + list of daily cards (Booked/Available)",
        "classes": "py-10"
      },
      {
        "id": "benefits",
        "layout": "Bento grid: 2 cols on md, 3 cols on lg with varied spans",
        "classes": "py-14"
      },
      {
        "id": "booking-form",
        "layout": "Card with form + sticky summary/PayPal on desktop",
        "classes": "py-16"
      }
    ],
    "bento_grid_example": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6",
    "bento_cells": [
      {"span": "lg:col-span-3", "use": "Foot-traffic highlight"},
      {"span": "lg:col-span-3", "use": "Utilities (power/water)"},
      {"span": "lg:col-span-2", "use": "$70/day pricing"},
      {"span": "lg:col-span-2", "use": "Opposite Kroger"},
      {"span": "lg:col-span-2", "use": "Community support"}
    ]
  },

  "buttons": {
    "tokens": {
      "--btn-radius": "0.75rem",
      "--btn-shadow": "0 6px 18px hsl(42 92% 55% / 0.25)",
      "--btn-motion": "150ms ease-out"
    },
    "variants": {
      "primary": {
        "class": "inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-3 text-sm font-semibold shadow-[var(--btn-shadow)] hover:bg-[hsl(42_92%_50%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))] active:scale-[0.98] transition-colors",
        "usage": "Book Now / Pay $70/day"
      },
      "secondary": {
        "class": "inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-white text-foreground px-5 py-3 text-sm font-semibold hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))] transition-colors",
        "usage": "Learn more / View details"
      },
      "ghost": {
        "class": "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors",
        "usage": "Minor actions"
      }
    },
    "sizes": {"sm": "h-9 px-3", "md": "h-11 px-5", "lg": "h-12 px-6 text-base"}
  },

  "components": {
    "hero": {
      "modules": ["./components/ui/button.jsx"],
      "layout": "Split with image on right, CTA stack left",
      "micro_interactions": [
        "Parallax image: translateY 6–12px on scroll (Framer Motion)",
        "CTA hover: color shift only (no transition: all)"
      ]
    },
    "coming_soon": {
      "modules": ["./components/ui/card.jsx", "./components/ui/badge.jsx"],
      "pattern": "Card with prominent date badge and thumbnail"
    },
    "upcoming_calendar": {
      "modules": ["./components/ui/calendar.jsx", "./components/ui/tooltip.jsx", "./components/ui/badge.jsx", "./components/ui/card.jsx"],
      "pattern": "Month view with disabled booked dates + 7-day inline list"
    },
    "benefits": {
      "modules": ["./components/ui/card.jsx", "./components/ui/icon-placeholder"],
      "pattern": "Bento cards with icon + copy"
    },
    "booking_form": {
      "modules": ["./components/ui/form.jsx", "./components/ui/input.jsx", "./components/ui/select.jsx", "./components/ui/textarea.jsx", "./components/ui/switch.jsx", "./components/ui/button.jsx", "./components/ui/dialog.jsx", "./components/ui/sonner.jsx"],
      "pattern": "Short form, validate, then render PayPal"
    }
  },

  "libraries_and_setup": {
    "install": [
      "npm i framer-motion",
      "npm i @paypal/paypal-js"
    ],
    "usage_notes": [
      "Use Framer Motion for hero parallax and section reveals",
      "Load PayPal JS SDK via @paypal/paypal-js only when form is valid"
    ]
  },

  "code_scaffolds": {
    "hero.jsx": "import { motion, useScroll, useTransform } from 'framer-motion';\nimport { Button } from './components/ui/button.jsx';\n\nexport default function Hero() {\n  const { scrollY } = useScroll();\n  const y = useTransform(scrollY, [0, 300], [0, 12]);\n  return (\n    <section id=\"hero\" className=\"relative overflow-hidden bg-white\">\n      <div className=\"noise\"></div>\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28\">\n        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8 items-center\">\n          <div className=\"lg:col-span-6 space-y-5\">\n            <p className=\"uppercase tracking-widest text-xs font-semibold text-muted-foreground\">818 Food Truck Stop</p>\n            <h1 className=\"font-[Bebas Neue] tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-none\">Prime Spot Opposite Kroger. Power + Water. $70/day.</h1>\n            <p className=\"text-sm md:text-base text-muted-foreground\">818 Coshocton Ave, Mt Vernon, OH — High daily traffic and utilities included. Book your truck\'s slot in minutes.</p>\n            <div className=\"flex flex-col sm:flex-row gap-3\">\n              <Button data-testid=\"hero-book-now-button\" className=\"inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-3 text-sm font-semibold shadow-[0_6px_18px_hsl(42_92%_55%_/_0.25)] hover:bg-[hsl(42_92%_50%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))]\">Book for $70/day</Button>\n              <a data-testid=\"hero-view-calendar-link\" href=\"#calendar\" className=\"inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-white text-foreground px-5 py-3 text-sm font-semibold hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))]\">View availability</a>\n            </div>\n          </div>\n          <div className=\"lg:col-span-6\">\n            <motion.img alt=\"Food truck at 818 location\" style={{ y }} className=\"w-full h-[280px] sm:h-[360px] lg:h-[460px] object-cover rounded-2xl shadow-2xl\" src=\"REPLACE_WITH_HERO_IMAGE_URL\" />\n          </div>\n        </div>\n      </div>\n    </section>\n  );\n}",

    "coming-soon.jsx": "import { Card, CardHeader, CardContent } from './components/ui/card.jsx';\nimport { Badge } from './components/ui/badge.jsx';\n\nexport default function ComingSoon({ truck }) {\n  if (!truck) return null;\n  return (\n    <section id=\"coming-soon\" className=\"py-10\">\n      <div className=\"max-w-4xl mx-auto px-4\">\n        <Card className=\"overflow-hidden\">\n          <div className=\"grid grid-cols-1 md:grid-cols-3\">\n            <img src={truck.image} alt=\"Upcoming food truck\" className=\"h-56 w-full object-cover md:col-span-1\" />\n            <div className=\"md:col-span-2\">\n              <CardHeader className=\"flex items-center justify-between\">\n                <h3 className=\"font-semibold text-base md:text-lg\">Coming Soon</h3>\n                <Badge data-testid=\"coming-soon-date-badge\" className=\"bg-[hsl(var(--secondary))] text-white\">{truck.dateLabel}</Badge>\n              </CardHeader>\n              <CardContent className=\"space-y-1\">\n                <p className=\"font-semibold\">{truck.name}</p>\n                <p className=\"text-muted-foreground text-sm\">{truck.cuisine}</p>\n              </CardContent>\n            </div>\n          </div>\n        </Card>\n      </div>\n    </section>\n  );\n}",

    "upcoming-7-days.jsx": "import { Calendar } from './components/ui/calendar.jsx';\nimport { Card, CardContent } from './components/ui/card.jsx';\nimport { Badge } from './components/ui/badge.jsx';\nimport { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip.jsx';\n\nexport default function Upcoming({ bookedDates = [], dayMeta = {} }) {\n  const disabled = bookedDates; // array of Date objects\n  return (\n    <section id=\"calendar\" className=\"py-10\">\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">\n          <Card>\n            <CardContent className=\"pt-6\">\n              <Calendar\n                data-testid=\"availability-calendar\"\n                mode=\"single\"\n                disabled={disabled}\n                className=\"rounded-md border\"\n              />\n              <p className=\"mt-2 text-xs text-muted-foreground\">Gray dates are booked. Tap an available date to start booking.</p>\n            </CardContent>\n          </Card>\n\n          <div className=\"space-y-3\">\n            {Array.from({ length: 7 }).map((_, i) => {\n              const d = new Date(Date.now() + i * 86400000);\n              const key = d.toDateString();\n              const meta = dayMeta[key];\n              const isBooked = bookedDates.some(b => b.toDateString() === key);\n              return (\n                <Card key={key} className=\"\">\n                  <CardContent className=\"py-4 flex items-center justify-between\">\n                    <div className=\"flex items-center gap-3\">\n                      <span className=\"font-medium\">{d.toLocaleDateString()}</span>\n                      {isBooked ? (\n                        <TooltipProvider>\n                          <Tooltip>\n                            <TooltipTrigger asChild>\n                              <Badge data-testid=\"day-status-badge\" className=\"bg-neutral-800 text-white\">Booked</Badge>\n                            </TooltipTrigger>\n                            <TooltipContent>\n                              <p>{meta?.vendor || 'Reserved'}</p>\n                            </TooltipContent>\n                          </Tooltip>\n                        </TooltipProvider>\n                      ) : (\n                        <Badge data-testid=\"day-status-badge\" className=\"bg-[hsl(var(--success))] text-white\">Available</Badge>\n                      )}\n                    </div>\n                    <a data-testid=\"day-cta-link\" href=\"#booking\" className=\"text-sm font-semibold text-[hsl(var(--secondary))] hover:underline\">{isBooked ? 'See other dates' : 'Book this date'}</a>\n                  </CardContent>\n                </Card>\n              );\n            })}\n          </div>\n        </div>\n      </div>\n    </section>\n  );\n}",

    "booking-form.jsx": "import { useEffect, useState } from 'react';\nimport { z } from 'zod';\nimport { toast } from './components/ui/sonner.jsx';\nimport { Button } from './components/ui/button.jsx';\nimport { Input } from './components/ui/input.jsx';\nimport { Textarea } from './components/ui/textarea.jsx';\nimport { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from './components/ui/select.jsx';\nimport { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx';\nimport { loadScript } from '@paypal/paypal-js';\n\nconst BookingSchema = z.object({\n  date: z.string().min(1),\n  truckName: z.string().min(2),\n  contactEmail: z.string().email(),\n  cuisine: z.string().min(2),\n  notes: z.string().optional(),\n});\n\nexport default function BookingForm() {\n  const [form, setForm] = useState({ date: '', truckName: '', contactEmail: '', cuisine: '', notes: '' });\n  const [valid, setValid] = useState(false);\n\n  useEffect(() => {\n    const v = BookingSchema.safeParse(form).success;\n    setValid(v);\n  }, [form]);\n\n  useEffect(() => {\n    if (!valid) return;\n    loadScript({ clientId: 'YOUR_PAYPAL_CLIENT_ID', currency: 'USD' }).then(() => {\n      if (!window.paypal) return;\n      window.paypal.Buttons({\n        style: { shape: 'rect', color: 'gold', label: 'pay', height: 45 },\n        createOrder: (data, actions) => {\n          return actions.order.create({\n            purchase_units: [{\n              amount: { value: '70.00' },\n              description: `818 Food Truck Stop - ${form.date}`\n            }],\n            application_context: { shipping_preference: 'NO_SHIPPING' }\n          });\n        },\n        onApprove: (data, actions) => actions.order.capture().then(() => {\n          toast.success('Booking confirmed!');\n        }),\n        onError: () => toast.error('Payment error. Please try again.'),\n      }).render('#paypal-container');\n    });\n  }, [valid, form]);\n\n  return (\n    <section id=\"booking\" className=\"py-16\">\n      <div className=\"max-w-3xl mx-auto px-4\">\n        <Card>\n          <CardHeader>\n            <CardTitle className=\"text-base md:text-lg\">Book your date ($70/day)</CardTitle>\n          </CardHeader>\n          <CardContent className=\"space-y-4\">\n            <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\n              <div className=\"space-y-2\">\n                <label className=\"text-sm font-medium\" htmlFor=\"date\">Selected date</label>\n                <Input data-testid=\"booking-date-input\" id=\"date\" placeholder=\"YYYY-MM-DD\" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />\n              </div>\n              <div className=\"space-y-2\">\n                <label className=\"text-sm font-medium\" htmlFor=\"truckName\">Truck name</label>\n                <Input data-testid=\"booking-truck-name-input\" id=\"truckName\" value={form.truckName} onChange={e => setForm({ ...form, truckName: e.target.value })} />\n              </div>\n              <div className=\"space-y-2\">\n                <label className=\"text-sm font-medium\" htmlFor=\"contactEmail\">Contact email</label>\n                <Input data-testid=\"booking-email-input\" id=\"contactEmail\" type=\"email\" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />\n              </div>\n              <div className=\"space-y-2\">\n                <label className=\"text-sm font-medium\" htmlFor=\"cuisine\">Cuisine</label>\n                <Select onValueChange={(v) => setForm({ ...form, cuisine: v })}>\n                  <SelectTrigger data-testid=\"booking-cuisine-select\" id=\"cuisine\"><SelectValue placeholder=\"Choose\" /></SelectTrigger>\n                  <SelectContent>\n                    <SelectItem value=\"bbq\">BBQ</SelectItem>\n                    <SelectItem value=\"tacos\">Tacos</SelectItem>\n                    <SelectItem value=\"coffee\">Coffee</SelectItem>\n                    <SelectItem value=\"dessert\">Dessert</SelectItem>\n                  </SelectContent>\n                </Select>\n              </div>\n            </div>\n            <div className=\"space-y-2\">\n              <label className=\"text-sm font-medium\" htmlFor=\"notes\">Notes</label>\n              <Textarea data-testid=\"booking-notes-textarea\" id=\"notes\" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder=\"Power/water needs, setup time, etc.\" />\n            </div>\n            <div className=\"pt-2 border-t\">\n              <div id=\"paypal-container\" data-testid=\"paypal-button-container\" className=\"mt-4\"></div>\n              <p className=\"text-xs text-muted-foreground mt-2\">Payment is processed securely by PayPal. You\'ll receive a confirmation email.</p>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n    </section>\n  );\n}"
  },

  "motion_and_interactions": {
    "principles": [
      "Subtle parallax on hero imagery (<= 12px translateY)",
      "Reveal-on-scroll using Framer Motion: 20px upward, 300ms, staggered",
      "Hover transitions: color/background/border only. Do not use transition: all",
      "Press state: scale 0.98 on primary buttons"
    ]
  },

  "accessibility": {
    "targets": ["Touch targets >= 44px", "Visible :focus rings using ring token", "Calendar keyboard navigation maintained", "Color contrast AA (4.5:1)"],
    "form": ["Label every input", "Inline validation with aria-live polite"],
    "motion_pref": "Respect prefers-reduced-motion; disable parallax and reduce durations"
  },

  "testing_attributes": {
    "requirement": "All interactive and key informational elements MUST include a data-testid attribute (kebab-case).",
    "examples": [
      "data-testid=\"hero-book-now-button\"",
      "data-testid=\"availability-calendar\"",
      "data-testid=\"day-status-badge\"",
      "data-testid=\"booking-date-input\"",
      "data-testid=\"paypal-button-container\""
    ]
  },

  "image_urls": [
    {
      "category": "hero",
      "description": "Food truck in urban crosswalk, colorful & energetic",
      "url": "https://images.unsplash.com/photo-1742155441086-646419ee8670?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "coming-soon",
      "description": "Food truck parked roadside in city",
      "url": "https://images.unsplash.com/photo-1728396554779-845627e53861?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "benefits\n",
      "description": "Green/white food truck on road — lifestyle detail tile",
      "url": "https://images.unsplash.com/photo-1597230887809-b2d4800bc2a5?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "alt-hero",
      "description": "Pexels urban food vendor scene for variant hero",
      "url": "https://images.pexels.com/photos/5920758/pexels-photo-5920758.jpeg"
    }
  ],

  "component_path": {
    "button": "/app/frontend/src/components/ui/button.jsx",
    "calendar": "/app/frontend/src/components/ui/calendar.jsx",
    "card": "/app/frontend/src/components/ui/card.jsx",
    "badge": "/app/frontend/src/components/ui/badge.jsx",
    "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
    "form": "/app/frontend/src/components/ui/form.jsx",
    "input": "/app/frontend/src/components/ui/input.jsx",
    "select": "/app/frontend/src/components/ui/select.jsx",
    "textarea": "/app/frontend/src/components/ui/textarea.jsx",
    "dialog": "/app/frontend/src/components/ui/dialog.jsx",
    "sonner": "/app/frontend/src/components/ui/sonner.jsx"
  },

  "web_inspirations": {
    "search_1": "Food truck website design landing pages with bold urban visuals, strong hero CTAs, and booking focus (Dribbble, curated lists)",
    "refs_1": [
      "https://www.websitebuilderexpert.com/designing-websites/food-truck-websites/",
      "https://htmlburger.com/blog/food-website-designs/",
      "https://dribbble.com/tags/food-truck-website"
    ],
    "search_2": "Shadcn calendar booking UX + event availability patterns + PayPal button UI",
    "refs_2": [
      "https://ui.shadcn.com/docs/components/calendar",
      "https://github.com/robskinney/shadcn-ui-fullcalendar-example"
    ]
  },

  "instructions_to_main_agent": [
    "Keep mobile-first; stack sections vertically with generous spacing",
    "Use shadcn/ui exclusively for inputs, calendar, dialogs, toasts",
    "Hero: apply Z-pattern split; ensure image parallax and .noise overlay",
    "Use primary sun-yellow for main CTA; secondary teal for accents",
    "Disable already-booked dates via Calendar disabled prop",
    "Coming Soon: 1 banner Card with date Badge; always include data-testid",
    "Upcoming 7 Days: show 7 cards with Booked/Available badges and link to form",
    "Booking Form: simple 4-field form; only render PayPal after zod validation",
    "Attach data-testid to every interactive element (buttons, inputs, links, badges)",
    "Respect Gradient Restriction Rule; gradients only for section backgrounds, not cards",
    "Do not center align global app container; follow natural left alignment",
    "Never use transition: all; transition only specific properties",
    "Use Sonner toasts for success/error",
    "If gradient covers >20% viewport or impacts readability, fallback to solid background"
  ]
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
