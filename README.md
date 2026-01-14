
# 🌍 AI Trip Planner

An intelligent, AI-powered travel planning application that generates personalized, comprehensive travel itineraries using advanced language models. The system leverages LangChain and Groq's LLM capabilities to create detailed day-by-day travel plans based on user preferences including destination, budget, duration, travel style, and personal interests.

## 🎯 Overview

AI Trip Planner is built with a modern, scalable architecture featuring a React frontend, Flask unified application layer, and FastAPI backend. The application employs an agent-based design pattern with modular components, reusable prompt libraries, and custom tools to deliver both mainstream and off-beat travel recommendations.

### Key Capabilities

- **Intelligent Itinerary Generation**: Creates detailed day-by-day travel plans with activities, dining, and accommodation recommendations
- **Dual Planning Approach**: Provides both mainstream tourist attractions and unique, off-the-beaten-path experiences
- **Comprehensive User Interface**: Modern React frontend with intuitive form inputs and structured result display
- **Real-time Processing**: Seamless communication between frontend and AI backend for immediate trip planning
- **Adaptive Recommendations**: Tailors suggestions based on group size, travel style, budget constraints, and personal interests

## 🏗️ Architecture & Design

### System Architecture
The application follows a three-tier architecture:

1. **Presentation Layer**: React-based frontend providing an intuitive user interface
2. **Application Layer**: Flask unified application serving static content and API proxy functionality  
3. **Service Layer**: FastAPI backend with LangChain integration for AI processing

### Design Principles

- **Modularity**: Component-based architecture with clear separation of concerns
- **Scalability**: Agent-based design allowing easy extension with additional tools and capabilities
- **Maintainability**: Centralized configuration management and structured prompt libraries
- **Extensibility**: Plugin architecture supporting custom tools for weather, currency conversion, and expense calculation

## 💼 Business Value

**For Travel Agencies**
- Automates itinerary creation, reducing planning time from hours to minutes
- Provides consistent, high-quality travel recommendations
- Enables handling of multiple client requests simultaneously

**For Individual Travelers**
- Delivers personalized travel experiences based on specific preferences
- Offers both popular attractions and unique local experiences
- Provides comprehensive budget planning and expense estimation

**For Developers**
- Demonstrates practical LLM implementation in a real-world application
- Showcases modern web development practices with React and FastAPI
- Provides a foundation for AI-powered service applications

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, CSS3, Axios | Interactive user interface with responsive design |
| **Application** | Flask, CORS | Unified app serving static content and API proxy |
| **Backend** | FastAPI, Python 3.10+ | REST API and AI agent orchestration |
| **AI Engine** | LangChain, Groq LLM | Natural language processing and reasoning |
| **Tools** | Custom Python modules | Weather data, currency conversion, expense calculation |
| **Configuration** | YAML, Environment variables | Centralized application configuration |
| **Development** | Git, npm, pip | Version control and package management |

## ✨ Core Features

### Intelligent Trip Planning
- **Personalized Itineraries**: Generates custom day-by-day travel plans based on user preferences
- **Dual Perspective Planning**: Offers both mainstream tourist attractions and unique local experiences
- **Budget Management**: Calculates comprehensive trip costs including accommodation, activities, and dining
- **Group Optimization**: Tailors recommendations for solo travelers, couples, families, or groups

### Advanced Functionality
- **Real-time Weather Integration**: Provides weather forecasts for planned destinations
- **Currency Conversion**: Automatic currency conversion for international travel planning
- **Safety Ratings**: Includes safety assessments for accommodations and destinations
- **Dietary Preferences**: Accommodates vegetarian, non-vegetarian, and local cuisine preferences

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Interface**: Clean, modern design with guided input process
- **Real-time Processing**: Immediate AI-generated responses with loading indicators
- **Comprehensive Results**: Structured display of complete travel plans with detailed information


## 🔧 Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required API Keys
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
FOURSQUARE_API_KEY=your_foursquare_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# Optional API Keys
OPEN_API_KEY=your_openai_api_key_here

# Database (optional)
DATABASE_URL=postgresql+psycopg://user:password@host:5432/database_name
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10
DATABASE_POOL_TIMEOUT=30
DATABASE_POOL_RECYCLE=1800
DATABASE_SSL_MODE=require
DATABASE_SSL_ROOT_CERT=/path/to/ca.pem
```

### API Key Setup Guide

1. **Groq API**: Sign up at [Groq Console](https://console.groq.com/) for LLM access
2. **OpenWeather API**: Register at [OpenWeatherMap](https://openweathermap.org/api) for weather data
3. **Exchange Rate API**: Get a key from [ExchangeRate-API](https://exchangerate-api.com/)
4. **Foursquare API**: Create an account at [Foursquare Developer](https://developer.foursquare.com/)
5. **Tavily API**: Register at [Tavily](https://tavily.com/) for web search capabilities

### Database Configuration

- Set `DATABASE_URL` to point at your production database (PostgreSQL recommended). The backend automatically upgrades bare `postgresql://` URLs to use the psycopg driver and enables connection pooling.
- Optional pool controls are available through `DATABASE_POOL_SIZE`, `DATABASE_MAX_OVERFLOW`, `DATABASE_POOL_TIMEOUT`, and `DATABASE_POOL_RECYCLE` for tuning under load.
- For hosted databases that require TLS, configure `DATABASE_SSL_MODE` (for example `require` or `verify-full`) and optionally `DATABASE_SSL_ROOT_CERT` with the path to your CA bundle.
- If no `DATABASE_URL` is provided the app falls back to a local SQLite file at `data/trips.db` for development convenience.
## 🚀 Quick Start

### Prerequisites

- **Python**: Version 3.10 or higher
- **Node.js**: Version 16 or higher
- **npm**: Latest version (comes with Node.js)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Uday-Parmar07/AI_Trip_Planner.git
cd AI_Trip_Planner
```

2. **Backend Setup**
```bash
# Create and activate virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file with your API keys
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run build
cd ..
```

### Running the Application

#### Unified Application (Recommended)

```bash
# Start the unified application (serves both frontend and API)
python unified_app.py
```

The application will be available at `http://localhost:3000`

#### Development Mode (Separate Services)

```bash
# Terminal 1: Start FastAPI backend
python main_simple.py

# Terminal 2: Start React development server
cd frontend
npm start
```

- **FastAPI Backend**: `http://localhost:8002`
- **React Frontend**: `http://localhost:3000`

### Health Check

Verify the application is running correctly:
```bash
curl http://localhost:3000/api/health
```

## 📁 Project Structure

```
AI_Trip_Planner/
├── agent/                  # AI agent and workflow logic
│   ├── __init__.py
│   └── agentic_workflow.py
├── config/                 # Configuration files
│   ├── __init__.py
│   └── config.yaml
├── frontend/               # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── prompt_library/         # AI prompt templates
│   ├── __init__.py
│   └── prompts.py
├── tools/                  # Custom AI tools
│   ├── __init__.py
│   ├── currency_conversion_tool.py
│   ├── expense_calculator_tool.py
│   ├── place_search_tool.py
│   └── weather_info_tool.py
├── utils/                  # Utility functions
│   ├── __init__.py
│   ├── calculator.py
│   ├── config_loader.py
│   ├── currency_converter.py
│   ├── model_loader.py
│   ├── place_info_search.py
│   └── weather_info.py
├── main_simple.py          # FastAPI backend server
├── unified_app.py          # Flask unified application
├── requirements.txt        # Python dependencies
├── setup.py               # Package configuration
└── README.md              # Project documentation
```

## 🔌 API Documentation

### Core Endpoints

#### POST `/api/query`
Generate a travel itinerary based on user preferences.

**Request Body:**
```json
{
  "question": "Plan a 5-day trip to Paris for 2 people with a budget of $2000"
}
```

**Response:**
```json
{
  "answer": "Detailed travel itinerary...",
  "processing_time": 3.45,
  "timestamp": "2025-07-31T10:30:00Z"
}
```

#### GET `/api/health`
Check application health status.

**Response:**
```json
{
  "status": "healthy",
  "frontend": "serving",
  "backend_status": 200,
  "unified_app": true
}
```

## 🤝 Contributing

We welcome contributions to improve the AI Trip Planner! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow code standards** and include appropriate comments
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description of changes

### Development Setup

```bash
# Install development dependencies
pip install -r requirements.txt
pip install pytest black flake8

# Run tests
pytest

# Format code
black .

# Lint code
flake8 .
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please:
- **Create an issue** on GitHub for bug reports or feature requests
- **Check existing issues** before creating new ones
- **Provide detailed information** including error messages and steps to reproduce

## 🙏 Acknowledgments

- **LangChain** for providing the AI framework
- **Groq** for fast LLM inference
- **React** community for frontend development resources
- **FastAPI** for the high-performance backend framework

