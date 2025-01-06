FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies (PostgreSQL development packages and build tools)
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Run Celery as a non-root user
RUN useradd -m celeryuser && chown -R celeryuser:celeryuser /app
USER celeryuser

# Expose port (optional for Celery, but useful if you run a web service alongside)
EXPOSE 8000

# Start Celery worker
CMD ["celery", "-A", "core", "worker", "--loglevel=info", "-c", "4"]
