# Clone the repository
git clone https://github.com/priyambuilds/recreating-instantly.git
cd recreating-instantly\backend

# Create and activate a virtual environment
python -m venv env
.\env\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run the FastAPI server (adjust main.py path/module if needed)
uvicorn app.main:app --reload --host 0.0.0.0 --port 



- visit http://localhost:8000/docs to open OPENAPI documentation