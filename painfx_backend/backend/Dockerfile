FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install PostgreSQL development packages
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Expose the application port (adjust if necessary)

EXPOSE 8000

CMD sh -c "\
    echo 'Running migrations...' && \
    python manage.py makemigrations && \
    python manage.py migrate && \
    echo 'Collecting static files...' && \
    python manage.py collectstatic --noinput && \
    echo 'Starting Gunicorn server...' && \
    exec gunicorn core.wsgi:application --bind=0.0.0.0:8000 --workers=3 \
"