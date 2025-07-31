from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import requests
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app for unified frontend + backend
app = Flask(__name__, static_folder='frontend/build', static_url_path='')

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True
    }
})

# FastAPI backend URL
FASTAPI_BASE_URL = "http://localhost:8002"

@app.route('/')
def serve_react_app():
    """Serve the main React application"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_react_static(path):
    """Serve React static files or fallback to index.html for SPA routing"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Unified health check for both frontend and backend"""
    try:
        # Check if FastAPI backend is running
        response = requests.get(f"{FASTAPI_BASE_URL}/health", timeout=5)
        return jsonify({
            "status": "healthy",
            "frontend": "serving",
            "backend_status": response.status_code,
            "backend_response": response.json(),
            "unified_app": True
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "frontend": "serving",
            "backend_error": str(e),
            "unified_app": True
        }), 500

@app.route('/api/query', methods=['POST', 'OPTIONS'])
def handle_query():
    """Handle trip planning queries - unified endpoint"""
    if request.method == 'OPTIONS':
        # Handle preflight requests
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        # Log incoming request
        logger.info(f"Unified app: Received {request.method} request to /api/query")
        logger.info(f"Request data: {request.get_json()}")
        
        # Forward request to FastAPI backend
        response = requests.post(
            f"{FASTAPI_BASE_URL}/query",
            json=request.get_json(),
            headers={
                'Content-Type': 'application/json',
                'X-Forwarded-For': request.remote_addr,
                'X-Unified-App': 'true'
            },
            timeout=60  # Increased timeout for AI processing
        )
        
        # Log backend response
        logger.info(f"Backend response status: {response.status_code}")
        
        # Return response with additional headers
        if response.status_code == 200:
            result = response.json()
            result['app_info'] = {
                'type': 'unified',
                'version': '2.0.0',
                'frontend_backend_integrated': True
            }
            return jsonify(result)
        else:
            return jsonify({
                "error": "Backend error",
                "status_code": response.status_code,
                "message": response.text
            }), response.status_code
            
    except requests.exceptions.Timeout:
        logger.error("Backend request timeout")
        return jsonify({
            "error": "Request timeout",
            "message": "The AI backend took too long to respond"
        }), 504
        
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to backend")
        return jsonify({
            "error": "Backend unavailable",
            "message": "Cannot connect to the AI backend service"
        }), 503
        
    except Exception as e:
        logger.error(f"Unified app error: {str(e)}")
        return jsonify({
            "error": "Application error",
            "message": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors by serving React app (for SPA routing)"""
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    logger.info("Starting unified AI Trip Planner on port 3000...")
    logger.info("Frontend: React app served from /")
    logger.info("API: Available at /api/query and /api/health")
    logger.info("Backend: Connecting to FastAPI at port 8002")
    
    app.run(
        host='0.0.0.0',
        port=3000,
        debug=True,
        threaded=True
    )
