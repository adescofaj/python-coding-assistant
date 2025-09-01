# 🤖 Python AI Assistant - LangGraph Workflow Engine

An intelligent Python programming assistant powered by **LangGraph**, **LangChain**, and **OpenAI GPT-4o Mini**. Built with a multi-node workflow architecture for specialized code analysis, debugging, and programming assistance.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![LangGraph](https://img.shields.io/badge/LangGraph-Latest-FF6B6B.svg)
![LangChain](https://img.shields.io/badge/LangChain-Latest-1C1C1C.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT4o_Mini-412991.svg)

## 🧠 AI Architecture

### **LangGraph Workflow**
```
START → Router → [EXPLAIN | DEBUG | GENERAL] → Response → END
```

- **Router Node**: Classifies and routes requests
- **Explain Node**: Code analysis and educational explanations  
- **Debug Node**: Error detection and solution generation
- **General Node**: Conversational programming assistance

### **Memory Management**
```python
# Thread-based conversation memory
{
    "thread_id": {
        "memory": ConversationBufferMemory(),
        "last_code": Optional[str]
    }
}
```

### **Model Configuration**
```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.3,
    max_tokens=500
)
```

## 🔬 AI Node Specifications

### **Explain Node**
- Code syntax breakdown and analysis
- Algorithm explanation with step-by-step walkthrough
- Best practices identification

### **Debug Node** 
- Syntax and logic error detection
- Performance issue identification
- Solution generation with corrected code

### **General Node**
- Natural language programming assistance
- Concept explanations and best practices
- Casual programming conversation

## 🚀 Quick Setup

### **Backend**
```bash
# Install dependencies
pip install fastapi uvicorn langchain langchain-openai langgraph python-dotenv

# Environment setup
echo "OPENAI_API_KEY=your-key" > .env

# Run server
uvicorn main:app --reload
```

### **Frontend**
```bash
# Install dependencies  
npm install react-ace ace-builds react-markdown react-syntax-highlighter

# Start app
npm start
```

## 📁 Project Structure

```
python_assistant/
├── ai_engine/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Pydantic models
│   ├── workflow.py      # LangGraph workflow
│   └── .env            # Environment variables
└── frontend/            # React frontend
```

## 🔧 API Usage

```http
POST /chat
{
  "action": "EXPLAIN|DEBUG|GENERAL",
  "thread_id": "unique-id",
  "code": "python code",      # For EXPLAIN/DEBUG
  "message": "question"       # For GENERAL
}
```

## 📊 Performance

- **Response Time**: 1-4 seconds per request
- **Memory**: O(n) storage per conversation thread

## 🏆 Key Features

- ✅ **Multi-node LangGraph workflow** for specialized AI tasks
- ✅ **Conversation memory** with context management
- ✅ **Cost-efficient** GPT-4o Mini integration
- ✅ **Production-ready** FastAPI architecture
- ✅ **Scalable memory management** with thread isolation

---

## Demo

🔗 **[View Demo](https://drive.google.com/drive/folders/1y-01LvVBOTN2ukTnVJz9gNeZtNEahiaI?usp=drive_link)**