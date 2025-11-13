FROM python:3.12-slim-bookworm

# Install system dependencies for Postrgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    postgresql-client \
    gdal-bin \
    libgdal-dev \
    binutils \
    libproj-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Copy uv files first
COPY pyproject.toml uv.lock ./

# Create empty env-file to avoid warnings
RUN touch ./.env

# Install uv and project dependencies
RUN pip install -U pip uv && uv pip install --system .
COPY . .

# PYTHONUNBUFFERED=1: Prevents buffering of outputs → better logs.
# PYTHONDONTWRITEBYTECODE=1: Does not write __pycache__ files in the container.
# Set variable for celery
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    COLUMNS=80
