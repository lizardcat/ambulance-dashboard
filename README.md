# Nairobi Emergency Ambulance Dispatch Dashboard

A comprehensive, real-time emergency dispatch system demo built specifically for the Nairobi/Kenyan context. This dashboard simulates a complete ambulance dispatch center with live tracking, emergency management, hospital coordination, and communication systems.

## Screenshots

![Dashboard Preview 1](/assets/dashboard_1.png)

![Dashboard Preview 2](/assets/dashboard_2.png)

![Dashboard Preview 3](/assets/dashboard_3.png)

![Dashboard Preview 4](/assets/dashboard_4.png)

## Demo Features

- **Interactive Map**: Click on ambulance/emergency markers for details
- **Real-time Updates**: Live clock and simulated data updates
- **Emergency Selection**: Click emergencies to view patient details
- **Working Chat**: Send messages in the communication panel
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional UI**: Modern design with proper color coding

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS 3.x
- **Maps**: React Leaflet with OpenStreetMap
- **Charts**: Recharts for performance metrics
- **Icons**: Lucide React
- **State Management**: React useState/useEffect

## Prerequisites

- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation Instructions

### **Step 1: Create React Application**

```bash
# Create new React app
npx create-react-app nairobi-ambulance-dashboard
cd nairobi-ambulance-dashboard
```

### **Step 2: Install Dependencies**

```bash
# Install required packages
npm install leaflet react-leaflet recharts lucide-react

# Install Tailwind CSS 3.x
npm install -D tailwindcss postcss autoprefixer
```

### **Step 3: Configure Tailwind CSS**

Create `tailwind.config.js` in your project root:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create `postcss.config.js` in your project root:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### **Step 4: Update CSS File**

Replace the contents of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### **Step 5: Add Leaflet CSS**

Add this line to the `<head>` section of `public/index.html`:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
```

### **Step 6: Replace App Component**

Replace the contents of `src/App.js` with the dashboard code provided.

### **Step 7: Start Development Server**

```bash
npm start
```

Your dashboard will be available at `http://localhost:3000`

## Project Structure

```
ambulance-dashboard/
├── public/
│   ├── index.html              # Add Leaflet CSS here
│   └── ...
├── src/
│   ├── App.js                  # Main dashboard component
│   ├── index.css               # Tailwind directives
│   ├── index.js                # React entry point
│   └── ...
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🙋Support

For questions, issues, or feature requests:

- Create an issue on GitHub
- Contact me here on GitHub

**Built with ❤️ for SWE4040-A - Software Construction Course**

_This is a demonstration system designed to showcase modern emergency dispatch capabilities in the Nairobi context. For production use, additional security, authentication, and integration features would be required._
