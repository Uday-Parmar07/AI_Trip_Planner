import os
import logging
from utils.currency_converter import CurrencyConverter
from typing import List, Union
from langchain.tools import tool
from dotenv import load_dotenv

class CurrencyConverterTool:
    def __init__(self):
        load_dotenv()
        self.logger = logging.getLogger(__name__)
        self.api_key = os.environ.get("EXCHANGE_RATE_API_KEY")
        if not self.api_key:
            self.logger.warning("Currency conversion tool disabled: EXCHANGE_RATE_API_KEY not set")
            self.currency_service = None
            self.currency_converter_tool_list = []
        else:
            self.currency_service = CurrencyConverter(self.api_key)
            self.currency_converter_tool_list = self._setup_tools()

    def _setup_tools(self) -> List:
        """Setup all tools for the currency converter tool"""
        @tool
        def convert_currency(amount:Union[float, int, str], from_currency:str, to_currency:str):
            """Convert amount from one currency to another"""
            try:
                numerical_amount = float(amount)
            except (TypeError, ValueError):
                raise ValueError("Amount must be numeric")
            try:
                return self.currency_service.convert(numerical_amount, from_currency, to_currency)
            except Exception as exc:
                self.logger.error(f"Currency conversion failed: {exc}")
                raise ValueError("Currency conversion service unavailable")
        
        return [convert_currency]