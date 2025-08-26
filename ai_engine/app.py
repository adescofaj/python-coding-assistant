from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from langchain.memory import ConversationBufferMemory
import asyncio

from workflow import PythonAssistantWorkflow
from models import ChatRequest, ChatResponse

app = FastAPI(title="Python AI Assistant API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage for thread memories
thread_memories: Dict[str, Dict[str, Any]] = {}

def get_thread_memory(thread_id: str) -> ConversationBufferMemory:
    """Get or create memory for a thread"""
    if thread_id not in thread_memories:
        thread_memories[thread_id] = {
            "memory": ConversationBufferMemory(),
            "last_code": None
        }
    return thread_memories[thread_id]["memory"]

def update_last_code(thread_id: str, code: str):
    """Update the last code for a thread"""
    if thread_id in thread_memories:
        thread_memories[thread_id]["last_code"] = code

# Initialize workflow
workflow = PythonAssistantWorkflow()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Get memory for this thread
        memory = get_thread_memory(request.thread_id)
        
        # Update last code if provided
        if request.code:
            update_last_code(request.thread_id, request.code)
        
        # Prepare state for workflow
        state = {
            "action": request.action,
            "code": request.code,
            "message": request.message,
            "memory": memory,
            "thread_id": request.thread_id
        }
        
        # Run workflow
        result = await workflow.run(state)
        
        return ChatResponse(
            response=result["response"],
            action=request.action,
            thread_id=request.thread_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Python AI Assistant API is running"}

@app.get("/threads/{thread_id}/memory")
async def get_thread_info(thread_id: str):
    """Get thread memory info (for debugging)"""
    if thread_id not in thread_memories:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    memory = thread_memories[thread_id]["memory"]
    return {
        "thread_id": thread_id,
        "message_count": len(memory.chat_memory.messages),
        "last_code": thread_memories[thread_id]["last_code"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)