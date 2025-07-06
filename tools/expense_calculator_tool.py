from utils.calculator import Calculator
from typing import List
from langchain.tools import tool

class CalculatorTool:
    def __init__(self):
        self.calculator = Calculator()
        self.calculator_tool_list = self._setup_tools()

    def _setup_tools(self) -> List:
        """Set up calculator tools for trip planning."""

        @tool(name="EstimateHotelCost", description="Estimate total hotel cost for a given price per night and number of nights.")
        def estimate_total_hotel_cost(price_per_night: str, total_days: str) -> float:
            return self.calculator.multiply(float(price_per_night), float(total_days))
        
        @tool(name="CalculateTotalExpense", description="Calculate total trip expense by adding up multiple individual costs.")
        def calculate_total_expense(*costs: float) -> float:
            return self.calculator.calculate_total(*costs)

        @tool(name="CalculateDailyBudget", description="Calculate average daily budget from total cost and number of days.")
        def calculate_daily_expense_budget(total_cost: str, days: str) -> float:
            return self.calculator.calculate_daily_budget(float(total_cost), int(days))

        return [
            estimate_total_hotel_cost,
            calculate_total_expense,
            calculate_daily_expense_budget
        ]
