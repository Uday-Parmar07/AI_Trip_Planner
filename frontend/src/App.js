import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Alert,
  ThemeProvider,
  createTheme
} from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import './index.css';

const defaultForm = {
  origin: '',
  destination: '',
  numberOfPeople: '1',
  duration: '',
  budget: '',
  travelDates: '',
  accommodation: 'hotel',
  tripType: 'family',
  transportation: 'flight'
};

const parseAIResponse = (text) => {
  if (!text) return [];

  const blocks = [];
  const lines = text.split('\n');
  let paragraph = [];
  let list = [];
  let table = [];

  const stripMarkdown = (value) =>
    value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
      .trim();

  const shouldHighlight = (value) =>
    /[$€₹]/.test(value) || /^\s*(morning|afternoon|evening|night|arrival|departure|check[-\s]?in|check[-\s]?out)/i.test(value);

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const content = paragraph.join(' ');
    blocks.push({
      type: 'paragraph',
      content,
      highlight: shouldHighlight(content)
    });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: 'list', items: [...list] });
    list = [];
  };

  const flushTable = () => {
    if (!table.length) return;

    const rows = table
      .map((row) => row.filter(Boolean))
      .filter((row) => row.length)
      .filter((row) => !row.every((cell) => /^[-–—]+$/.test(cell.replace(/\s+/g, ''))));

    table = [];

    if (!rows.length) return;

    if (rows.length === 1) {
      paragraph.push(rows[0].join(' · '));
      return;
    }

    const [header, ...body] = rows;
    blocks.push({ type: 'table', header, rows: body });
  };

  lines.forEach((rawLine) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushTable();
      return;
    }

    if (/^#{2,}\s*/.test(trimmed)) {
      flushParagraph();
      flushList();
      flushTable();
      const headingContent = stripMarkdown(trimmed.replace(/^#+\s*/, ''));
      if (/^Day\s+\d+/i.test(headingContent)) {
        blocks.push({ type: 'day', content: headingContent });
      } else if (trimmed.startsWith('###')) {
        blocks.push({ type: 'subheading', content: headingContent });
      } else {
        blocks.push({ type: 'heading', content: headingContent });
      }
      return;
    }

    const cleanedLine = stripMarkdown(trimmed);

    if (/^Day\s+\d+/i.test(cleanedLine)) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push({ type: 'day', content: cleanedLine });
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushTable();
      const itemContent = stripMarkdown(trimmed.replace(/^[-*]\s+/, ''));
      list.push({ content: itemContent, highlight: shouldHighlight(itemContent) });
      return;
    }

    if (trimmed.includes('|')) {
      const cells = trimmed
        .split('|')
        .map((cell) => stripMarkdown(cell))
        .filter(Boolean);

      if (cells.length > 1) {
        flushParagraph();
        flushList();
        table.push(cells);
        return;
      }
    }

    flushList();
    flushTable();
    paragraph.push(cleanedLine);
  });

  flushParagraph();
  flushList();
  flushTable();

  return blocks;
};

const App = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('trip-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTrips(parsed);
        }
      } catch (err) {
        console.warn('Failed to parse stored trips', err);
      }
    }
  }, []);

  useEffect(() => {
    if (trips.length) {
      window.localStorage.setItem('trip-history', JSON.stringify(trips));
    } else {
      window.localStorage.removeItem('trip-history');
    }
  }, [trips]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          background: {
            default: '#f7f7f5',
            paper: '#ffffff'
          },
          primary: {
            main: '#2f2f2b'
          },
          text: {
            primary: '#1f1f1d',
            secondary: '#60605c'
          }
        },
        typography: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h4: { fontWeight: 600 }
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 20
              }
            }
          }
        }
      }),
    []
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generateTripQuestion = () => {
    const {
      origin,
      destination,
      numberOfPeople,
      duration,
      budget,
      travelDates,
      accommodation,
      tripType,
      transportation
    } = formData;

    let question = `Plan a ${tripType} trip from ${origin} to ${destination} for ${numberOfPeople} ${Number(numberOfPeople) === 1 ? 'person' : 'people'}`;

    if (duration) {
      question += ` lasting ${duration}`;
    }

    if (travelDates) {
      question += ` scheduled for ${travelDates}`;
    }

    if (budget) {
      question += ` with a total budget of ${budget}`;
    }

      question += `. Prefer ${accommodation} accommodations and ${transportation} as the primary transport.`;
      question += ' Provide a concise itinerary, key logistics, and budget breakdown focusing on clarity and brevity.';
      if (budget) {
        question += ' Ensure hotel suggestions respect the stated budget and include indicative nightly pricing.';
      } else {
        question += ' Include indicative nightly pricing for recommended hotels to show expected costs.';
      }

    return question;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = '/api/query';
      const response = await axios.post(
        apiUrl,
        { question: generateTripQuestion() },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client': 'React-Frontend',
            'X-Request-Source': 'AI-Trip-Planner'
          },
          timeout: 60000,
          withCredentials: true
        }
      );

      const enhancedResult = {
        answer: response.data.answer,
        processingTime: response.data.processing_time,
        timestamp: new Date(response.data.timestamp),
        formData: { ...formData }
      };

      setResult(enhancedResult);

      const newTrip = {
        id: Date.now(),
        createdAt: enhancedResult.timestamp,
        form: { ...formData },
        excerpt: response.data.answer?.split('\n').find((line) => line.trim()) || 'Itinerary ready',
        processingTime: enhancedResult.processingTime
      };

      setTrips((prev) => [newTrip, ...prev].slice(0, 10));
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

  const parsedBlocking = useMemo(() => parseAIResponse(result?.answer || ''), [result?.answer]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton edge="start" color="inherit" disableRipple>
                <TravelExploreIcon sx={{ fontSize: 30, color: 'text.primary' }} />
              </IconButton>
              <Box>
                <Typography variant="caption" sx={{ letterSpacing: 4, color: 'text.secondary' }}>
                  PLAN WITH PURPOSE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  TripSketch
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['Home', 'Trips', 'About', 'Contact'].map((item) => (
                <Button key={item} color="inherit" size="small" sx={{ color: 'text.secondary' }}>
                  {item}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={7}>
              <Paper
                component="form"
                elevation={0}
                sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', height: '100%' }}
                onSubmit={handleSubmit}
              >
                <Stack spacing={3} alignItems="flex-start">
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      Trip details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Provide the essentials and we will craft a focused itinerary.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Paris, France"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Number of people"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleInputChange}
                        required
                        fullWidth
                      >
                        {[...Array(10)].map((_, index) => {
                          const value = String(index + 1);
                          return (
                            <MenuItem key={value} value={value}>
                              {value} {value === '1' ? 'person' : 'people'}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Starting place"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="Bhopal, India"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Trip duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="5 days"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="$4,000"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Travel dates"
                        name="travelDates"
                        value={formData.travelDates}
                        onChange={handleInputChange}
                        placeholder="12 Apr – 17 Apr 2026"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Accommodation"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleInputChange}
                        fullWidth
                      >
                        <MenuItem value="hotel">Hotel</MenuItem>
                        <MenuItem value="hostel">Hostel</MenuItem>
                        <MenuItem value="homestay">Homestay</MenuItem>
                        <MenuItem value="apartment">Apartment rental</MenuItem>
                        <MenuItem value="resort">Resort</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Trip type"
                        name="tripType"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        fullWidth
                      >
                        <MenuItem value="family">Family</MenuItem>
                        <MenuItem value="solo">Solo</MenuItem>
                        <MenuItem value="adventure">Adventure</MenuItem>
                        <MenuItem value="honeymoon">Honeymoon</MenuItem>
                        <MenuItem value="leisure">Leisure</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Transportation"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleInputChange}
                        fullWidth
                      >
                        <MenuItem value="flight">Flight</MenuItem>
                        <MenuItem value="train">Train</MenuItem>
                        <MenuItem value="road">Private car / road</MenuItem>
                        <MenuItem value="public">Public transit</MenuItem>
                        <MenuItem value="mixed">Mixed options</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={18} /> : <TravelExploreIcon />}
                    disabled={loading || !formData.origin || !formData.destination}
                    sx={{ px: 4, py: 1.4, borderRadius: 999 }}
                  >
                    {loading ? 'Planning the journey…' : 'Plan My Trip'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Stack spacing={4} sx={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Trip outline
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generated itineraries appear here when ready.
                      </Typography>
                    </Box>

                    {error && <Alert severity="error">{error}</Alert>}

                    {loading && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CircularProgress size={22} />
                        <Typography variant="body2" color="text.secondary">
                          Gathering routes, stays, and highlights…
                        </Typography>
                      </Stack>
                    )}

                    {result && (
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Generated {result.timestamp.toLocaleString()} • {result.processingTime.toFixed(2)}s
                          </Typography>
                          <Chip label={result.formData.tripType} variant="outlined" size="small" sx={{ textTransform: 'capitalize' }} />
                        </Stack>

                        <Divider />

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                              ROUTE
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {result.formData.origin} → {result.formData.destination}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                              TRAVELLERS
                            </Typography>
                            <Typography variant="body1">
                              {result.formData.numberOfPeople} {Number(result.formData.numberOfPeople) === 1 ? 'person' : 'people'}
                            </Typography>
                          </Grid>
                          {result.formData.duration && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                DURATION
                              </Typography>
                              <Typography variant="body1">{result.formData.duration}</Typography>
                            </Grid>
                          )}
                          {result.formData.travelDates && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                DATES
                              </Typography>
                              <Typography variant="body1">{result.formData.travelDates}</Typography>
                            </Grid>
                          )}
                          {result.formData.budget && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                BUDGET
                              </Typography>
                              <Typography variant="body1">{result.formData.budget}</Typography>
                            </Grid>
                          )}
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                              ACCOMMODATION
                            </Typography>
                            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                              {result.formData.accommodation}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                              TRANSPORT
                            </Typography>
                            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                              {result.formData.transportation}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box className="ai-output" aria-label="AI generated itinerary">
                          {parsedBlocking.map((block, index) => {
                            if (block.type === 'heading') {
                              return (
                                <Typography key={`block-${index}`} className="ai-heading">
                                  {block.content}
                                </Typography>
                              );
                            }

                            if (block.type === 'subheading') {
                              return (
                                <Typography key={`block-${index}`} className="ai-subheading">
                                  {block.content}
                                </Typography>
                              );
                            }

                            if (block.type === 'day') {
                              return (
                                <Box key={`block-${index}`} className="ai-day">
                                  {block.content}
                                </Box>
                              );
                            }

                            if (block.type === 'paragraph') {
                              const className = block.highlight ? 'ai-paragraph ai-paragraph--highlight' : 'ai-paragraph';
                              return (
                                <Typography key={`block-${index}`} className={className} component="p">
                                  {block.content}
                                </Typography>
                              );
                            }

                            if (block.type === 'list') {
                              return (
                                <Box component="ul" key={`block-${index}`} className="ai-list">
                                  {block.items.map((item, itemIndex) => {
                                    const itemClass = item.highlight ? 'ai-list-item ai-list-item--highlight' : 'ai-list-item';
                                    return (
                                      <Box component="li" className={itemClass} key={`block-${index}-item-${itemIndex}`}>
                                        {item.content}
                                      </Box>
                                    );
                                  })}
                                </Box>
                              );
                            }

                            if (block.type === 'table') {
                              return (
                                <Box key={`block-${index}`} className="ai-table" role="table">
                                  <Box className="ai-table-row ai-table-header" role="row">
                                    {block.header.map((cell, cellIndex) => (
                                      <Box className="ai-table-cell" role="columnheader" key={`block-${index}-head-${cellIndex}`}>
                                        {cell}
                                      </Box>
                                    ))}
                                  </Box>
                                  {block.rows.map((row, rowIndex) => (
                                    <Box className="ai-table-row" role="row" key={`block-${index}-row-${rowIndex}`}>
                                      {row.map((cell, cellIndex) => (
                                        <Box className="ai-table-cell" role="cell" key={`block-${index}-row-${rowIndex}-cell-${cellIndex}`}>
                                          {cell}
                                        </Box>
                                      ))}
                                    </Box>
                                  ))}
                                </Box>
                              );
                            }

                            return null;
                          })}
                        </Box>

                        <Typography variant="caption" color="text.secondary" className="disclaimer">
                          AI-generated plan. Confirm prices, availability, and entry requirements before booking.
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', flexGrow: 1 }}>
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Trips
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recently planned journeys are stored here for quick reference.
                      </Typography>
                    </Box>

                    <Divider />

                    <Stack spacing={2} sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
                      {trips.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Plan a trip to see it appear in your saved list.
                        </Typography>
                      )}

                      {trips.map((trip) => (
                        <Box key={trip.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {trip.form.origin} → {trip.form.destination}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(trip.createdAt).toLocaleDateString()}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {trip.form.travelDates || 'Dates TBD'} • {trip.form.numberOfPeople} {Number(trip.form.numberOfPeople) === 1 ? 'person' : 'people'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                              {trip.excerpt}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
