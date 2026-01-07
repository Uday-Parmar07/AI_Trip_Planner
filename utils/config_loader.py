import yaml
import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def load_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to config file. If None, uses CONFIG_PATH env var 
                    or defaults to 'config/config.yaml'
    
    Returns:
        Dictionary containing configuration data
        
    Raises:
        FileNotFoundError: If config file doesn't exist
        yaml.YAMLError: If config file has invalid YAML syntax
        ValueError: If config file is empty or invalid
    """
    # Determine config path
    if config_path is None:
        config_path = os.getenv('CONFIG_PATH', 'config/config.yaml')
    
    config_file = Path(config_path)
    
    # Validate file exists
    if not config_file.exists():
        logger.error(f"Configuration file not found: {config_path}")
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    # Validate it's a file (not a directory)
    if not config_file.is_file():
        logger.error(f"Configuration path is not a file: {config_path}")
        raise ValueError(f"Configuration path is not a file: {config_path}")
    
    try:
        logger.info(f"Loading configuration from: {config_path}")
        
        with open(config_file, "r", encoding="utf-8") as file:
            config = yaml.safe_load(file)
        
        # Validate config is not empty
        if config is None:
            logger.warning("Configuration file is empty")
            return {}
        
        if not isinstance(config, dict):
            raise ValueError(f"Configuration must be a dictionary, got {type(config)}")
        
        logger.info("Configuration loaded successfully")
        logger.debug(f"Loaded config keys: {list(config.keys())}")
        
        return config
        
    except yaml.YAMLError as e:
        logger.error(f"Error parsing YAML file {config_path}: {e}")
        raise yaml.YAMLError(f"Error parsing YAML file {config_path}: {e}")
    
    except Exception as e:
        logger.error(f"Unexpected error loading config from {config_path}: {e}")
        raise

def validate_config_structure(config: Dict[str, Any]) -> bool:
    """
    Validate that the configuration has the expected structure.
    
    Args:
        config: Configuration dictionary to validate
        
    Returns:
        True if valid, raises ValueError if invalid
    """
    required_sections = ['llm']
    
    for section in required_sections:
        if section not in config:
            raise ValueError(f"Missing required configuration section: {section}")
    
    # Validate LLM section
    llm_config = config['llm']
    if not isinstance(llm_config, dict):
        raise ValueError("'llm' section must be a dictionary")
    
    # Check for at least one provider
    valid_providers = ['groq', 'openai']
    has_provider = any(provider in llm_config for provider in valid_providers)
    
    if not has_provider:
        raise ValueError(f"At least one LLM provider must be configured: {valid_providers}")
    
    # Validate each configured provider
    for provider in valid_providers:
        if provider in llm_config:
            provider_config = llm_config[provider]
            if not isinstance(provider_config, dict):
                raise ValueError(f"'{provider}' configuration must be a dictionary")
            
            if 'model_name' not in provider_config:
                raise ValueError(f"'{provider}' configuration missing 'model_name'")
    
    logger.info("Configuration structure validation passed")
    return True

def load_and_validate_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Load and validate configuration in one step.
    
    Args:
        config_path: Path to config file
        
    Returns:
        Validated configuration dictionary
    """
    config = load_config(config_path)
    validate_config_structure(config)
    return config