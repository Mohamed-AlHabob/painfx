FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install PostgreSQL development packages and dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker cache
COPY ./requirements.txt /app/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --default-timeout=1000 -r requirements.txt

# Copy the entire backend project (ensure the folder path matches your project structure)
COPY painfx_backend/backend /app/

# Ensure the core module is available in the PYTHONPATH
ENV PYTHONPATH=/app

# Expose port (if needed, for web applications or services)
EXPOSE 8000

# Start the Celery worker (update this command if necessary)
CMD ["celery", "-A", "core", "worker", "--loglevel=info"]
