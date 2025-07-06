import os
from dotenv import load_dotenv
from typing import Literal, Optional, Any
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from utils.config_loader import load_and_validate_config
import logging

logger = logging.getLogger(__name__)


class ConfigLoader:
    def __init__(self):
        try:
            logger.info("Loading configuration...")
            self.config = load_and_validate_config()
        except Exception as e:
            logger.error(f"Failed to initialize ConfigLoader: {e}")
            raise

    def __getitem__(self, key):
        try:
            return self.config[key]
        except KeyError:
            logger.error(f"Configuration key '{key}' not found")
            available_keys = list(self.config.keys())
            logger.error(f"Available keys: {available_keys}")
            raise KeyError(f"Configuration key '{key}' not found. Available: {available_keys}")

    def get(self, key, default=None):
        """Get config value with optional default."""
        return self.config.get(key, default)


class ModelLoader(BaseModel):
    model_provider: Literal["groq", "openai"] = "groq"
    config: Optional[ConfigLoader] = Field(default=None, exclude=True)

    def __init__(self, **data):
        if 'config' not in data or data['config'] is None:
            data['config'] = ConfigLoader()
        super().__init__(**data)

    class Config:
        arbitrary_types_allowed = True

    def load_llm(self):
        """
        Load and return the LLM model.
        """
        print("LLM loading...")
        print(f"Loading model from provider: {self.model_provider}")
        if self.model_provider == "groq":
            print("Loading LLM from Groq..............")
            groq_api_key = os.getenv("GROQ_API_KEY")
            model_name = self.config["llm"]["groq"]["model_name"]
            llm = ChatGroq(model=model_name, api_key=groq_api_key)
        elif self.model_provider == "openai":
            print("Loading LLM from OpenAI..............")
            openai_api_key = os.getenv("OPENAI_API_KEY")
            model_name = self.config["llm"]["openai"]["model_name"]
            llm = ChatOpenAI(model_name=model_name, api_key=openai_api_key)

        return llm
