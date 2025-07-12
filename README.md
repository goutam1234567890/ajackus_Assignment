# Employee Directory Web Interface

## Overview
A responsive, interactive employee directory built with HTML, CSS, and JavaScript. The project simulates Freemarker template structure for assignment requirements. No backend or real Freemarker engine required.

## Folder Structure
```
project-root/
├── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── data.js
│       └── app.js
├── README.md
```

## Setup & Run Instructions
- No build or backend required.
- Simply open `index.html` in your browser (double-click or drag into browser window).
- All data is stored in your browser's localStorage. To reset to the original mock data, clear your browser's site data/localStorage for this page.
- Another easy method is to open the project directly in your browser: press Ctrl + O in your browser, navigate to the project root directory, select index.html, and open it.

## Features
- Employee dashboard with add, edit, delete
- Filter, sort, search, and pagination (default: 2 per page for easy demo)
- Responsive design (desktop, tablet, mobile)
- Form validation and error handling
- Data persists across refreshes (localStorage)
- Clean, modular CSS (all styles in `style.css`)
- Toggleable sidebar filter and modern modal form

## Usage Notes
- The "Show" dropdown defaults to 2 employees per page so you can see pagination immediately.
- The search field is fully functional and allows multi-character input.
- All UI styling is managed via CSS classes for maintainability.
- To reset the app to its original state, clear your browser's localStorage for this site.


## Reflection
**Challenges faced:**
- Ensuring smooth search input experience with re-rendering
- Matching reference UI exactly with both sidebar and top-bar filter layouts
- Managing localStorage persistence and reset logic

**Improvements for future:**
- Add animations and transitions for better UX
- More advanced filtering (multi-select, etc.)
- Accessibility improvements (ARIA labels, keyboard navigation)
- More robust error handling and user feedback 