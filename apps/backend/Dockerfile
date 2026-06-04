# Use an official lightweight Python wrapper image
FROM python:3.10-slim

# Set the active directory inside the container space
WORKDIR /app

# Install system dependencies needed for compiling database drivers
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy your dependency list file first to leverage cache optimization
COPY requirements.txt .

# Install your app's libraries cleanly
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the actual backend application files into the container image
COPY . .

# Open up the port for your container deployment
EXPOSE 8001

# Fire up Uvicorn binding to all incoming networks inside the container environment
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]