# Backend for Deepfake Detect

This is the FastAPI application that handles the processing and detection of deepfakes. It provides the necessary API endpoints for the frontend to interact with.

## Getting Started

### Prerequisites

- Python 3.9 or later
- pip
### Note
- Aws key for accessing dynamo db to be present in global config
- Update the settings.py file with appropriate changes

### Installation

1. Clone the repository and navigate to the `backend/` directory.

2. Create a virtual environment:
- Linux
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
- Windows
```bash
python -m venv venv
venv\scripts\activate
pip install -r requirements.txt
```

3. start the server
```bash
  uvicorn app:app --reload
```
