import os
from utils.place_info_search import TavilyPlaceSearchTool
from typing import List
from langchain.tools import tool
from dotenv import load_dotenv


class PlaceSearchTools:
    def __init__(self):
        load_dotenv()
        self.tavily_search = TavilyPlaceSearchTool()
        self.place_search_tool_list = self._setup_tools()

    def _setup_tools(self) -> List:
        """Setup all Tavily-based place search tools"""

        @tool(name="SearchAttractions", description="Get top tourist attractions with descriptions, timings, and reasons they are famous.")
        def search_attractions(place: str) -> str:
            """Searches top attractions in the given place"""
            result = self.tavily_search.search_attractions(place)
            return f"📍 Top tourist attractions in {place}:\n\n{result}"

        @tool(name="SearchRestaurants", description="Find the best vegetarian and non-vegetarian restaurants in a place with popular dishes.")
        def search_restaurants(place: str) -> str:
            """Searches veg and non-veg restaurants in the given place"""
            veg = self.tavily_search.search_veg_restaurants(place)
            nonveg = self.tavily_search.search_nonveg_restaurants(place)
            return f"🍀 Vegetarian restaurants in {place}:\n\n{veg}\n\n🍗 Non-vegetarian restaurants in {place}:\n\n{nonveg}"

        @tool(name="SearchActivities", description="Suggest must-try cultural, adventure, and local experiences for travelers.")
        def search_activities(place: str) -> str:
            """Searches popular cultural and adventure activities in the given place"""
            result = self.tavily_search.search_activities(place)
            return f"🎯 Activities and experiences in {place}:\n\n{result}"

        @tool(name="SearchTransportation", description="Lists all transportation options available in the city for tourists.")
        def search_transportation(place: str) -> str:
            """Searches available modes of transportation for tourists in the given place"""
            result = self.tavily_search.search_transportation(place)
            return f"🚌 Transportation options in {place}:\n\n{result}"

        return [search_attractions, search_restaurants, search_activities, search_transportation]
