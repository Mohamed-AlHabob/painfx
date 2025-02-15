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
COPY ./requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Expose the application port (adjust if necessary)
EXPOSE 8000

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Command to run migrations, create superuser, and start supervisord
CMD sh -c "\
    echo 'Running migrations...' && \
    python manage.py makemigrations && \
    python manage.py migrate && \
    echo 'Run Migrations and Download cities_light Data' && \
    python python manage.py cities_light && \
    echo 'Collecting static files...' && \
    python manage.py collectstatic --noinput && \
    echo 'Creating superuser...' && \
    python manage.py shell -c \"\
from apps.authentication.models import User; \
User.objects.filter(email='admin@painfx.in').exists() or \
User.objects.create_superuser(email='admin@painfx.in',password='admin')\" && \
    echo 'Starting Daphne...' && \
    daphne -b 0.0.0.0 -p 8000 core.asgi:application"
