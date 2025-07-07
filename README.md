
# AI based Trip Planner - Trippy

AI Trip Planning Agent is a modular, LLM-powered travel assistant that generates personalized, multi-day travel itineraries based on user preferences like destination, budget, number of days, and interests. Built using Streamlit, LangChain, and Groq's LLM, the app follows a scalable, agent-based architecture with reusable prompt libraries, custom tools (e.g., weather info), and centralized configuration handling. It outputs structured day-wise plans with suggested activities, food spots, and landmarks, providing a real-world example of using generative AI in a travel context.


Why This Project Is Useful

1. Automates Personalized Itinerary Creation
Saves time and effort for users or travel agencies by generating complete travel plans tailored to user preferences.

2. Real-World Use of LLMs

Demonstrates how Large Language Models (LLMs) can be applied beyond chat — in structured planning and decision-making.

3. Scalable & Modular Architecture

The project uses an agent-based structure, reusable prompts, and modular utilities, making it easy to extend with more tools (e.g., cost estimation, hotel APIs).

4. User-Friendly Interface

Built with Streamlit, allowing users to interact via a simple form-based UI — no technical knowledge needed.

5. Adaptable for Other Domains

The same architecture (agent + tools + prompt orchestration) can be reused in other domains like health advice, education planning, etc


| Component       | Tech Used                          | Purpose                                  |
| --------------- | ---------------------------------- | ---------------------------------------- |
| **Frontend**    | Streamlit                          | Interactive user interface               |
| **LLM Engine**  | Groq (via LangChain)               | Text generation and reasoning            |
| **Framework**   | LangChain                          | Prompt chaining, tool integration        |
| **Prompt Mgmt** | Jinja2 templates                   | Dynamic prompt formatting                |
| **Tooling**     | Custom tools (e.g., weather agent) | Extends LLM functionality                |
| **Config Mgmt** | dotenv, config files               | Centralized environment setup            |
| **Logging**     | Python logger                      | Debugging and monitoring                 |
| **Testing**     | Pytest (optional)                  | Basic functionality verification         |
| **Packaging**   | setup.py, pyproject.toml           | Installable and reproducible environment |




## Features

- Provides offbeat and personalized travel plans for the selected location, focusing on unique and local experiences rather than generic tourist spots.

- Recommends hotels based on the travel group type — whether the user is a couple, family, group of friends, or solo traveler.

- Includes safety ratings for both hotels and places, allowing users to evaluate risk and make safer travel decisions.

- Calculates an estimated total cost and per-day cost of the trip based on the number of days, people, accommodation, and activities.

- Lists dining options for both vegetarian and non-vegetarian preferences, along with highlighting the food specialities of the location.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`OPEN_API_KEY=your_open_api_key_here`

`GROQ_API_KEY=your_groq_here`

`GOOGLE_API_KEY=your_google_api_key_here`

`GPLACE_API_KEY=your_gplace_api_key_here`

`FOURSQUARE_API_KEY=your_foursquare_api_key_here`

`TAVILAY_API_KEY=your_tavilay_api_key_here`

`OPENWEATHER_API_KEY=your_openweather_api_key_here`

`EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here`



## Run Locally

Clone the project

```bash
  git clone https://github.com/Uday-Parmar07/AI_Trip_Planner.git
```

Go to the project directory

```bash
  cd AI_Trip_Planner
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  streamlit run app.py
  uvicorn main:app --reload --port 8000
```

