# Use a specific Python version for consistency
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

# Install system dependencies for GDAL and other required tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    libgdal-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Set Python environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy the entrypoint script and make it executable
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose the application port (adjust if necessary)
EXPOSE 8000

# Default command (can be overridden in docker-stack.yml)
CMD ["/app/entrypoint.sh"]
