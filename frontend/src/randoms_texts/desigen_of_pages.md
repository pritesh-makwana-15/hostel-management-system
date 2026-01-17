You are a senior frontend engineer.

I am building the **Hostel Management System (HMS)** frontend using **React + CSS**.
I already have the final UI design for the Home / Landing page.
Your task is to implement the Home page UI **MATCHING THE DESIGN EXACTLY**.

This is NOT Hospital.
This is **HOSTEL MANAGEMENT SYSTEM**.

────────────────────────────────────
🧩 TECH STACK (STRICT)
────────────────────────────────────
- React.js (Vite)
- JavaScript (NO TypeScript)
- Tailwind CSS
- React Router DOM
- No backend
- No API calls
- No dummy auth logic

────────────────────────────────────
🎨 DESIGN SYSTEM (DO NOT CHANGE)
────────────────────────────────────
Colors:
- Primary: #1F3C88
- Secondary: #2BBBAD
- Page background: #F4F6F9
- Card background: #FFFFFF
- Primary text: #2E2E2E
- Secondary text: #6B7280
- Border: #E5E7EB

Typography:
- Font: Inter
- Page headings: 22–24px, font-weight 600
- Section headings: 16–18px, font-weight 600
- Body text: 14px, font-weight 400
- Buttons/Nav items: 14px, font-weight 500

UI Style:
- Card border radius: 8px
- Button/Input radius: 6px
- Card shadow: 0px 4px 12px rgba(0,0,0,0.08)
- Hover shadow: 0px 6px 18px rgba(0,0,0,0.12)
- Flat, professional UI
- No gradients
- No flashy animations

Add minimal professional animations using Tailwind only:
hover, active, focus states (no fancy motion, no libraries).


────────────────────────────────────
📄 PAGE TO BUILD
────────────────────────────────────
**HMS – Home / Landing Page**

This page is PUBLIC and used by:
- Visitors
- Students (before login)
- Parents

────────────────────────────────────
🧭 PAGE STRUCTURE (TOP → BOTTOM)
────────────────────────────────────

1️⃣ HEADER / NAVBAR
- Sticky top navbar
- Background: white
- Bottom border: 1px solid #E5E7EB

Left:
- Hostel logo (simple icon)
- Text: "Hostel Management System"

Right menu:
- Home (active state)
- Facilities
- Gallery
- Contact
- Login (primary button)
- Register (outline button)

Mobile:
- Hamburger menu
- Login & Register visible or inside menu

────────────────────────────────────
2️⃣ HERO SECTION
- Two-column layout (desktop)

Left column:
- Heading:
  “Smart & Secure Hostel Management System”
- Description (2–3 lines):
  Online room management, fee payment,
  complaint & attendance tracking for modern hostels.
- Buttons:
  - Login (primary)
  - Explore Hostel (secondary outline)

Right column:
- Image / dashboard mockup
- Image inside a card container
- Rounded corners + soft shadow

Mobile:
- Single column
- Text first, image below
- Buttons full width

────────────────────────────────────
3️⃣ HOSTEL FACILITIES SECTION
- Section title: “Hostel Facilities”
- Grid of 6 cards

Each card:
- Icon (simple outline icon)
- Title
- One-line description
- White card
- Rounded corners
- Subtle shadow

Facilities:
- Spacious Rooms
- 24×7 Security
- High-Speed Wi-Fi
- Mess Facility
- Clean Drinking Water
- Power Backup

Responsive grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

────────────────────────────────────
4️⃣ HOSTEL GALLERY SECTION
- Section title: “Hostel Gallery”
- Image grid
- Rounded image cards
- Clean spacing

Desktop:
- 3–4 images per row

Tablet:
- 2–3 images per row

Mobile:
- 1–2 images per row

Below grid:
- “View More” button (outline)

Images represent:
- Rooms
- Mess
- Study area
- Hostel building

────────────────────────────────────
5️⃣ ADMISSION / INQUIRY SECTION
- Two-column layout (desktop)

Left:
- Heading:
  “Looking for Hostel Admission?”
- Short paragraph
- Bullet points:
  - Easy admission process
  - Affordable fees
  - Safe environment

Right:
- Inquiry form inside card

Form fields:
- Name
- Email
- Phone
- Message (textarea)
- Submit button (primary)

Mobile:
- Single column
- Form below content

────────────────────────────────────
6️⃣ FOOTER
- Background: Primary color (#1F3C88)
- Text color: white / muted gray
- 3–4 columns layout

Columns:
- Hostel info + short description
- Hostel Info (About, Privacy, Terms)
- Quick Links (Rooms, Admissions, FAQ)
- Contact Details (Email, Phone, Address)

Bottom:
- Copyright text centered

────────────────────────────────────
📱 RESPONSIVE BREAKPOINTS (MANDATORY)
────────────────────────────────────
Implement Tailwind responsive classes for:

- Mobile Small (320px)
- Mobile Standard (360–430px)
- Tablet Portrait (768–834px)
- Small Laptop (1024–1280px)
- Desktop (1440px)
- Ultrawide (center content, max-width 1440px)

Rules:
- Mobile: single column, full-width buttons
- Tablet: partial two-column
- Desktop: full two-column layout
- Always center content with max-width container

────────────────────────────────────
📁 CODE REQUIREMENTS
────────────────────────────────────
- Create `Home.jsx`
- Use reusable components if needed:
  - Navbar
  - Footer
  - FacilityCard
  - GalleryGrid
- Use semantic HTML
- Clean Tailwind class naming
- Add comments for each section
- NO inline styles
- NO external UI libraries

────────────────────────────────────
🚫 DO NOT
────────────────────────────────────
- Do NOT explain theory
- Do NOT add backend logic
- Do NOT add authentication
- Do NOT change UI colors or spacing

────────────────────────────────────
✅ OUTPUT FORMAT
────────────────────────────────────
1. Show file path:
   `src/pages/Home.jsx`
2. Provide FULL JSX + Tailwind code
3. Ensure page looks visually identical to provided designs



----------------------------------


You are a senior frontend developer.
Build the **Hostel Management System (HMS) – Home / Landing Page**
using **React + Tailwind CSS (frontend only)**.
IMPORTANT:
I have uploaded **final UI design images**.
Follow the uploaded images and layout **SAME TO SAME** for desktop and all responsive screens.
Tech:
- React (Vite)
- JavaScript
- Tailwind CSS
- No backend
- No API calls
Design rules (DO NOT CHANGE):
- Primary: #1F3C88
- Secondary: #2BBBAD
- Background: #F4F6F9
- Card: #FFFFFF
- Text: #2E2E2E / #6B7280
- Font: Inter
- Radius: 8px cards, 6px buttons
- Shadow: soft professional
Page includes:
- Navbar (Home, Facilities, Gallery, Contact, Login, Register)
- Hero section (text + image)
- Hostel Facilities (6 cards)
- Hostel Gallery (image grid + view more)
- Admission / Inquiry section (text + form)
- Footer
Responsive:
- Mobile, Tablet, Laptop, Desktop
- Layout must match uploaded images
Animations:
- Minimal only (hover, active, focus)
- Card hover shadow
- Button hover & press
- Image hover zoom
- NO animation libraries
Output:
- `Home.jsx `  and other components use for Home page with the file location 
- Full JSX + Tailwind code
- Clean, readable, commented
- No explanations