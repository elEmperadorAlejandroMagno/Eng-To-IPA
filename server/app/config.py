"""
Environment configuration for the IPA Transcription API
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class with environment variables and defaults"""
    
    # Server Configuration
    SERVER_PORT: int = int(os.getenv('SERVER_PORT', '8002'))
    SERVER_HOST: str = os.getenv('SERVER_HOST', '0.0.0.0')
    
    # Database Configuration
    DATABASE_PATH: str = os.getenv('DATABASE_PATH', './app/data/ipa_database.db')
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = os.getenv(
        'CORS_ORIGINS', 
        'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000'
    ).split(',')
    
    # API Configuration
    API_TITLE: str = os.getenv('API_TITLE', 'IPA Transcription API')
    API_DESCRIPTION: str = os.getenv(
        'API_DESCRIPTION', 
        'API for English IPA transcriptions with advanced phonetic rules'
    )
    API_VERSION: str = os.getenv('API_VERSION', '1.0.0')
    
    # Environment
    ENVIRONMENT: str = os.getenv('ENVIRONMENT', 'development')
    
    @classmethod
    def is_development(cls) -> bool:
        """Check if running in development mode"""
        return cls.ENVIRONMENT.lower() == 'development'
    
    @classmethod
    def is_production(cls) -> bool:
        """Check if running in production mode"""
        return cls.ENVIRONMENT.lower() == 'production'

# Global config instance
config = Config()