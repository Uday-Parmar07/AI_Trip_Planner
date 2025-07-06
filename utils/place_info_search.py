import os
import dotenv
from langchain_tavily import TavilySearch

dotenv.load_dotenv()

class TavilyPlaceSearchTool:
    def __init__(self):
        self.api_key = os.getenv("TAVILY_API_KEY")
        if not self.api_key:
            raise ValueError("TAVILY_API_KEY is missing in environment variables.")

    def _get_tavily_tool(self):
        return TavilySearch(
            topic="general",
            include_answer="advanced",
            tavily_api_key=self.api_key  # ✅ Inject API Key directly
        )

    def _safe_invoke(self, query: str) -> str:
        """
        Internal helper to invoke Tavily safely and return answer or fallback.
        """
        try:
            tavily_tool = self._get_tavily_tool()
            result = tavily_tool.invoke({"query": query})
            return result.get("answer", str(result))
        except Exception as e:
            return f"⚠️ Failed to retrieve info: {e}"

    def search_attractions(self, place: str) -> str:
        query = (
            f"As a travel planner, give me the top tourist attractions in and around {place}, "
            f"with descriptions, reasons for popularity, and any ticket or timing info."
        )
        return self._safe_invoke(query)

    def search_veg_restaurants(self, place: str) -> str:
        query = (
            f"List the best vegetarian restaurants in and around {place}. "
            f"Include local dishes they are known for and user recommendations."
        )
        return self._safe_invoke(query)

    def search_nonveg_restaurants(self, place: str) -> str:
        query = (
            f"What are the best non-vegetarian restaurants in and around {place}? "
            f"Mention top dishes, cuisines, and chef specialties if any."
        )
        return self._safe_invoke(query)

    def search_activities(self, place: str) -> str:
        query = (
            f"What are the best cultural, adventure, and local activities that a traveler must try in {place}?"
        )
        return self._safe_invoke(query)

    def search_transportation(self, place: str) -> str:
        query = (
            f"What are the different modes of transportation in {place} for tourists, "
            f"including local transit, cabs, and long-distance travel options?"
        )
        return self._safe_invoke(query)
