import os
from typing import Dict, Any, TypedDict
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class WorkflowState(TypedDict):
    action: str
    code: str
    message: str
    memory: Any  # ConversationBufferMemory
    thread_id: str
    response: str

class PythonAssistantWorkflow:
    def __init__(self):
        # Initialize OpenAI client
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            max_tokens=500
        )
        
        # Build the graph
        self.workflow = self._build_workflow()
    
    def _build_workflow(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(WorkflowState)
        
        # Add nodes
        workflow.add_node("router", self._router_node)
        workflow.add_node("explain", self._explain_node)
        workflow.add_node("debug", self._debug_node)
        workflow.add_node("general", self._general_node)
        
        # Set entry point
        workflow.set_entry_point("router")
        
        # Add conditional edges from router
        workflow.add_conditional_edges(
            "router",
            self._route_decision,
            {
                "explain": "explain",
                "debug": "debug", 
                "general": "general"
            }
        )
        
        # All nodes end the workflow
        workflow.add_edge("explain", END)
        workflow.add_edge("debug", END)
        workflow.add_edge("general", END)
        
        return workflow.compile()
    
    def _router_node(self, state: WorkflowState) -> WorkflowState:
        """Router node - just passes state through"""
        return state
    
    def _route_decision(self, state: WorkflowState) -> str:
        """Decide which node to route to"""
        action = state["action"].lower()
        if action == "explain":
            return "explain"
        elif action == "debug":
            return "debug"
        else:
            return "general"
    
    def _explain_node(self, state: WorkflowState) -> WorkflowState:
        """Explain code node"""
        code = state["code"]
        memory = state["memory"]
        
        # Get conversation history
        history = self._get_memory_context(memory)
        
        # Build prompt
        prompt = f"""You are a Python programming tutor. Explain the following Python code clearly and concisely.

Previous conversation context:
{history}

Code to explain:
{code}

Provide a clear, educational explanation in 3-6 sentences. Focus on what the code does, how it works, and key concepts. Use markdown formatting for any code snippets with ```python blocks."""

        # Get response from LLM
        response = self.llm.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        # Save to memory
        memory.save_context(
            {"input": f"Explain: {code}"},
            {"output": response_text}
        )
        
        state["response"] = response_text
        return state
    
    def _debug_node(self, state: WorkflowState) -> WorkflowState:
        """Debug code node"""
        code = state["code"]
        memory = state["memory"]
        
        # Get conversation history
        history = self._get_memory_context(memory)
        
        # Build prompt
        prompt = f"""You are a Python debugging expert. Analyze the following Python code for errors and issues.

Previous conversation context:
{history}

Code to debug:
{code}

Identify any syntax errors, logic issues, or potential problems. Provide clear explanations and suggest fixes in 4-8 sentences. Include corrected code examples using ```python markdown blocks when helpful."""

        # Get response from LLM
        response = self.llm.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        # Save to memory
        memory.save_context(
            {"input": f"Debug: {code}"},
            {"output": response_text}
        )
        
        state["response"] = response_text
        return state
    
    def _general_node(self, state: WorkflowState) -> WorkflowState:
        """General Python Q&A node"""
        message = state["message"]
        memory = state["memory"]
        
        # Get conversation history
        history = self._get_memory_context(memory)
        
        # Build prompt
        prompt = f"""You are a friendly Python programming assistant. Respond naturally to the user's message.

Previous conversation context:
{history}

User message:
{message}

Guidelines:
- If it's a greeting (hi, hello, etc.), introduce yourself warmly as a Python programming assistant
- For general questions about programming concepts, provide clear explanations  
- For specific coding questions, include ```python examples when helpful
- For casual conversation, respond naturally and conversationally
- Keep responses helpful and encouraging

Provide a natural, conversational response in 2-5 sentences."""

        # Get response from LLM
        response = self.llm.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        # Save to memory
        memory.save_context(
            {"input": message},
            {"output": response_text}
        )
        
        state["response"] = response_text
        return state
    
    def _get_memory_context(self, memory, max_messages: int = 6) -> str:
        """Get formatted conversation history from memory"""
        messages = memory.chat_memory.messages
        
        if not messages:
            return "No previous conversation."
        
        # Get last few messages
        recent_messages = messages[-max_messages:] if len(messages) > max_messages else messages
        
        context_parts = []
        for msg in recent_messages:
            if isinstance(msg, HumanMessage):
                context_parts.append(f"User: {msg.content}")
            elif isinstance(msg, AIMessage):
                context_parts.append(f"Assistant: {msg.content}")
        
        return "\n".join(context_parts) if context_parts else "No previous conversation."
    
    async def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """Run the workflow"""
        try:
            result = await self.workflow.ainvoke(initial_state)
            return result
        except Exception as e:
            # Fallback response
            return {
                "response": f"I encountered an error processing your request. Please try again. Error: {str(e)}",
                "action": initial_state.get("action", "UNKNOWN"),
                "thread_id": initial_state.get("thread_id", "unknown")
            }