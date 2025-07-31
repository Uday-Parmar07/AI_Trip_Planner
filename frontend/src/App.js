import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [formData, setFormData] = useState({
    currentLocation: '',
    destination: '',
    numberOfPeople: 1,
    duration: '',
    budget: '',
    travelStyle: 'budget',
    interests: []
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interests: checked 
          ? [...prev.interests, value]
          : prev.interests.filter(interest => interest !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatAIResponse = (text) => {
    if (!text) return null;
    
    // Split the text into sections based on common patterns
    const sections = text.split(/\*\*([^*]+)\*\*/g);
    const formatted = [];
    
    for (let i = 0; i < sections.length; i++) {
      if (i % 2 === 0) {
        // Regular text
        if (sections[i].trim()) {
          const lines = sections[i].split('\n').map(line => line.trim()).filter(line => line);
          lines.forEach((line, lineIndex) => {
            if (line.startsWith('Day ') || line.startsWith('* ')) {
              formatted.push(
                <div key={`${i}-${lineIndex}`} style={{ 
                  marginTop: '15px', 
                  marginBottom: '8px',
                  paddingLeft: line.startsWith('* ') ? '20px' : '0px',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  {line.startsWith('* ') ? 
                    <span>• {line.substring(2)}</span> : 
                    <span>{line}</span>
                  }
                </div>
              );
            } else if (line.includes('€') || line.includes('$') || line.includes('₹')) {
              formatted.push(
                <div key={`${i}-${lineIndex}`} style={{ 
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  {line}
                </div>
              );
            } else if (line.includes('|')) {
              // Table rows
              const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
              if (cells.length > 1) {
                formatted.push(
                  <div key={`${i}-${lineIndex}`} style={{ 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    margin: '8px 0',
                    fontSize: '14px'
                  }}>
                    {cells.map((cell, cellIndex) => (
                      <div key={cellIndex} style={{ 
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        fontWeight: cellIndex === 0 ? 'bold' : 'normal'
                      }}>
                        {cell}
                      </div>
                    ))}
                  </div>
                );
              } else {
                formatted.push(
                  <div key={`${i}-${lineIndex}`} style={{ 
                    marginTop: '8px',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {line}
                  </div>
                );
              }
            } else {
              formatted.push(
                <div key={`${i}-${lineIndex}`} style={{ 
                  marginTop: '8px',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  {line}
                </div>
              );
            }
          });
        }
      } else {
        // Bold headings
        formatted.push(
          <h3 key={i} style={{ 
            marginTop: '25px',
            marginBottom: '15px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '8px'
          }}>
            {sections[i]}
          </h3>
        );
      }
    }
    
    return formatted;
  };

  const generateTripQuestion = () => {
    const { currentLocation, destination, numberOfPeople, duration, budget, travelStyle, interests } = formData;
    
    let question = `Plan a ${travelStyle} trip from ${currentLocation} to ${destination} for ${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'}`;
    
    if (duration) {
      question += ` for ${duration}`;
    }
    
    if (budget) {
      question += ` with a budget of ${budget}`;
    }
    
    if (interests.length > 0) {
      question += `. I'm interested in ${interests.join(', ')}`;
    }
    
    question += '. Please provide detailed information including places to visit, accommodation suggestions, transportation options, estimated costs, weather information, and any important travel tips.';
    
    return question;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const question = generateTripQuestion();
      
      // Use unified API endpoint - no more separate middleware
      const apiUrl = '/api/query';
      
      // Enhanced API call with better error handling and headers
      const response = await axios.post(apiUrl, {
        question: question
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Client': 'React-Frontend',
          'X-Request-Source': 'AI-Trip-Planner'
        },
        timeout: 60000, // 60 seconds timeout for AI processing
        withCredentials: true
      });

      setResult({
        answer: response.data.answer,
        processingTime: response.data.processing_time,
        timestamp: new Date(response.data.timestamp).toLocaleString(),
        formData: formData,
        // Include middleware info if available
        middlewareInfo: response.data.app_info || null,
        // Debug info
        debugInfo: {
          responseStatus: response.status,
          responseData: response.data,
          apiUrl: apiUrl
        }
      });
      
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - The AI is taking longer than expected. Please try again.');
      } else if (err.response?.status === 503) {
        setError('Backend service unavailable. Please check if the server is running.');
      } else if (err.response?.status === 504) {
        setError('Gateway timeout. The AI processing took too long. Please try again.');
      } else {
        setError(err.response?.data?.detail || err.response?.data?.message || 'An error occurred while planning your trip');
      }
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = [
    'Adventure Sports', 'Cultural Sites', 'Food & Cuisine', 'Nature & Wildlife',
    'Photography', 'Shopping', 'Nightlife', 'Relaxation', 'Historical Sites',
    'Art & Museums', 'Beaches', 'Mountains', 'Local Experiences'
  ];

  return (
    <div className="container">
      <div className="header">
        <h1>🌍 AI Trip Planner</h1>
        <p>Plan your perfect journey with AI-powered recommendations</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currentLocation">Current Location *</label>
              <input
                type="text"
                id="currentLocation"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleInputChange}
                placeholder="e.g., New York, USA"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination *</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Paris, France"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numberOfPeople">Number of People *</label>
              <select
                id="numberOfPeople"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleInputChange}
                required
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Trip Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 5 days, 1 week, 10 days"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget (Optional)</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., $2000, ₹50000, €1500"
              />
            </div>

            <div className="form-group">
              <label htmlFor="travelStyle">Travel Style</label>
              <select
                id="travelStyle"
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleInputChange}
              >
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
                <option value="backpacking">Backpacking</option>
                <option value="family-friendly">Family-friendly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Interests (Select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {interestOptions.map(interest => (
                <label key={interest} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px', width: 'auto' }}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !formData.currentLocation || !formData.destination}
          >
            {loading ? 'Planning Your Trip...' : 'Plan My Trip 🚀'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="form-container">
          <div className="loading">
            <div className="spinner"></div>
            <span>AI is planning your perfect trip...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="form-container">
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {result && (
        <div className="result-container">
          <div className="result-header">
            <h2>🌟 Your AI-Generated Travel Plan</h2>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              <p><strong>From:</strong> {result.formData.currentLocation}</p>
              <p><strong>To:</strong> {result.formData.destination}</p>
              <p><strong>Travelers:</strong> {result.formData.numberOfPeople} {result.formData.numberOfPeople === 1 ? 'person' : 'people'}</p>
              {result.formData.duration && <p><strong>Duration:</strong> {result.formData.duration}</p>}
              {result.formData.budget && <p><strong>Budget:</strong> {result.formData.budget}</p>}
              <p><strong>Style:</strong> {result.formData.travelStyle}</p>
              {result.formData.interests.length > 0 && (
                <p><strong>Interests:</strong> {result.formData.interests.join(', ')}</p>
              )}
              <p><strong>Generated:</strong> {result.timestamp}</p>
              <p><strong>Processing Time:</strong> {result.processingTime.toFixed(2)}s</p>
              {result.middlewareInfo && (
                <p><strong>App:</strong> {result.middlewareInfo.type} v{result.middlewareInfo.version}</p>
              )}
            </div>
          </div>
          
          <div className="result-content">
            <div style={{ 
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333'
            }}>
              {formatAIResponse(result.answer)}
            </div>
            
            {/* Debug info */}
            {result.debugInfo && (
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f4fd', borderRadius: '5px', fontSize: '12px' }}>
                <strong>Debug Info:</strong>
                <p>API URL: {result.debugInfo.apiUrl}</p>
                <p>Response Status: {result.debugInfo.responseStatus}</p>
                <p>Answer Length: {result.answer ? result.answer.length : 'No answer'} characters</p>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '14px', color: '#666' }}>
            <p><em>⚠️ This travel plan was generated by AI. Please verify all information, especially prices, operating hours, and travel requirements before your trip.</em></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
