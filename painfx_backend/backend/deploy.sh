#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check database readiness
function wait_for_db() {
    echo "Waiting for PostgreSQL to be ready..."
    while ! pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" > /dev/null 2>&1; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
    done
    echo "PostgreSQL is up - continuing"
}

# Wait for the database to be ready
wait_for_db

# Run database migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn server
echo "Starting Gunicorn server..."
exec gunicorn core.wsgi:application --bind=0.0.0.0:8000 --workers=3 --timeout 120
