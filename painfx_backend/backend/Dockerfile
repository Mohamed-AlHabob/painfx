FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Expose the application port (adjust if necessary)
EXPOSE 8000

# Copy and set permissions for the deployment script
COPY ./deploy.sh /app/deploy.sh
RUN chmod +x /app/deploy.sh

# Set the entry point to the deployment script
CMD ["/app/deploy.sh"]
