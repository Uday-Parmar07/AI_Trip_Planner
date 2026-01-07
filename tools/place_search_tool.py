import os
from utils.place_info_search import TavilyPlaceSearchTool
from typing import List
from langchain.tools import tool
from dotenv import load_dotenv


class PlaceSearchTool:
    def __init__(self):
        load_dotenv()
        self.tavily_search = TavilyPlaceSearchTool()
        self.place_search_tool_list = self._setup_tools()

    def _setup_tools(self) -> List:
        """Setup all Tavily-based place search tools."""

        @tool
        def search_attractions(place: str) -> str:
            """
            Get top tourist attractions with descriptions, timings, and reasons they are famous.
            """
            result = self.tavily_search.search_attractions(place)
            return f"📍 Top tourist attractions in {place}:\n\n{result}"

        @tool
        def search_restaurants(place: str) -> str:
            """
            Find the best vegetarian and non-vegetarian restaurants in a place with popular dishes.
            """
            veg = self.tavily_search.search_veg_restaurants(place)
            nonveg = self.tavily_search.search_nonveg_restaurants(place)
            return f"🍀 Vegetarian restaurants in {place}:\n\n{veg}\n\n🍗 Non-vegetarian restaurants in {place}:\n\n{nonveg}"

        @tool
        def search_activities(place: str) -> str:
            """
            Suggest must-try cultural, adventure, and local experiences for travelers.
            """
            result = self.tavily_search.search_activities(place)
            return f"🎯 Activities and experiences in {place}:\n\n{result}"

        @tool
        def search_transportation(place: str) -> str:
            """
            Lists all transportation options available in the city for tourists.
            """
            result = self.tavily_search.search_transportation(place)
            return f"🚌 Transportation options in {place}:\n\n{result}"

        return [
            search_attractions,
            search_restaurants,
            search_activities,
            search_transportation
        ]
