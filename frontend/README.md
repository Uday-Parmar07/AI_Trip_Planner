# AI Trip Planner - React Frontend

This is the React frontend for the AI Trip Planner application. It provides a modern, responsive user interface for planning trips using AI.

## Features

- **Comprehensive Trip Planning Form**: Collects all necessary information including:
  - Current location
  - Destination
  - Number of people
  - Trip duration
  - Budget (optional)
  - Travel style (budget, mid-range, luxury, backpacking, family-friendly)
  - Interests and preferences

- **Modern UI/UX**: Beautiful, responsive design with:
  - Gradient backgrounds
  - Smooth animations
  - Mobile-friendly layout
  - Loading states
  - Error handling

- **Real-time Communication**: Connects to the FastAPI backend to get AI-generated travel plans

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at http://localhost:3000

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          # Main React component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies and scripts
```

## API Integration

The frontend communicates with the backend API at `/query` endpoint, sending a formatted question and receiving the AI-generated travel plan.

## Customization

You can customize the application by:

- Modifying the interest options in `App.js`
- Updating the styling in `index.css`
- Adding new form fields for additional trip parameters
- Implementing user authentication
- Adding trip history storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
