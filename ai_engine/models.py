from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict, Any

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    action: Literal["EXPLAIN", "DEBUG", "GENERAL"]
    thread_id: str = Field(..., description="Unique thread identifier")
    code: Optional[str] = Field(None, description="Python code to analyze (for EXPLAIN/DEBUG)")
    message: Optional[str] = Field(None, description="User message (for GENERAL)")
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "action": "EXPLAIN",
                    "thread_id": "thread_123",
                    "code": "def hello():\n    print('Hello World')"
                },
                {
                    "action": "DEBUG", 
                    "thread_id": "thread_123",
                    "code": "def hello()\n    print('Hello World')"
                },
                {
                    "action": "GENERAL",
                    "thread_id": "thread_123", 
                    "message": "What are Python decorators?"
                }
            ]
        }

class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    response: str = Field(..., description="AI assistant response")
    action: str = Field(..., description="Action that was performed")
    thread_id: str = Field(..., description="Thread identifier")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional response metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "This function defines a simple greeting that prints 'Hello World' to the console.",
                "action": "EXPLAIN",
                "thread_id": "thread_123",
                "metadata": None
            }
        }