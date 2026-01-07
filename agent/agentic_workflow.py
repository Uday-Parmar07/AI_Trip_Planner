from utils.model_loader import ModelLoader
from prompt_library.prompts import SYSTEM_PROMPT
from langgraph.graph import StateGraph, MessageGraph, END, START
from langgraph.prebuilt import ToolNode, tools_condition
from utils.config_loader import load_config
from tools.weather_info_tool import WeatherInfoTool
from tools.currency_conversion_tool import CurrencyConverterTool
from langgraph.graph import MessagesState
from tools.place_search_tool import PlaceSearchTool
from tools.expense_calculator_tool import CalculatorTool


from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class GraphBuilder:
    def __init__(self, model_provider: str = "groq", config_path: Optional[str] = None):
        """
        Initialize GraphBuilder with model provider and optional configuration.
        
        Args:
            model_provider: Either "groq" or "openai"
            config_path: Optional path to configuration file
        """
        try:
            logger.info(f"Initializing GraphBuilder with provider: {model_provider}")
            
            self.model_loader = ModelLoader(model_provider=model_provider)
            self.llm = self.model_loader.load_llm()
            
            self.config = load_config(config_path) if config_path else {}
            
            self._initialize_tools()
            self._bind_tools_to_llm()
            
            self.graph = None
            self.system_prompt = SYSTEM_PROMPT
            
            self.validate_setup()
            logger.info("GraphBuilder initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize GraphBuilder: {e}")
            raise
    
    def _initialize_tools(self):
        """Initialize all tools and combine them into a single list"""
        logger.info("Initializing tools...")
        
        self.weather_tools = WeatherInfoTool()
        self.place_search_tools = PlaceSearchTool()
        self.calculator_tools = CalculatorTool()
        self.currency_converter_tools = CurrencyConverterTool()
        
        self.tools = []
        self.tools.extend([
            *self.weather_tools.weather_tool_list,
            *self.place_search_tools.place_search_tool_list,
            *self.calculator_tools.calculator_tool_list,
            *self.currency_converter_tools.currency_converter_tool_list
        ])
        
        logger.info(f"Initialized {len(self.tools)} tools")
    
    def _bind_tools_to_llm(self):
        """Bind tools to the LLM"""
        self.llm_with_tools = self.llm.bind_tools(tools=self.tools)
        logger.info("Tools bound to LLM successfully")
    
    def validate_setup(self):
        """Validate that all components are properly initialized"""
        if not self.llm:
            raise ValueError("LLM not properly initialized")
        
        if not self.tools:
            raise ValueError("No tools available")
        
        if not self.system_prompt:
            raise ValueError("System prompt not set")
        
        logger.info("Graph builder setup validation passed")
    
    def agent_function(self, state: MessagesState):
        """Main agent function with error handling"""
        try:
            logger.debug("Processing user request")
            user_question = state["messages"]
            input_question = [self.system_prompt] + user_question
            
            response = self.llm_with_tools.invoke(input_question)
            
            logger.debug("Agent response generated successfully")
            return {"messages": [response]}
            
        except Exception as e:
            logger.error(f"Error in agent function: {e}")
            raise
    
    def build_graph(self):
        """Build and compile the workflow graph"""
        if self.graph is not None:
            logger.info("Graph already built, returning existing graph")
            return self.graph
        
        logger.info("Building workflow graph...")
        
        graph_builder = StateGraph(MessagesState)
        graph_builder.add_node("agent", self.agent_function)
        graph_builder.add_node("tools", ToolNode(tools=self.tools))
        
        graph_builder.add_edge(START, "agent")
        graph_builder.add_conditional_edges("agent", tools_condition)
        graph_builder.add_edge("tools", "agent")
        graph_builder.add_edge("agent", END)
        
        self.graph = graph_builder.compile()
        logger.info("Workflow graph built and compiled successfully")
        return self.graph
    
    def __call__(self):
        """Make the class callable"""
        return self.build_graph()
    
    # Convenience methods
    def with_custom_prompt(self, prompt: str):
        """Allow custom system prompt"""
        self.system_prompt = prompt
        return self
    
    def add_tools(self, tools: List):
        """Add additional tools"""
        self.tools.extend(tools)
        self._bind_tools_to_llm()
        return self