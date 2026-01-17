# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build

FROM python:3.10-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
COPY setup.py ./
COPY agent/ ./agent/
COPY config/ ./config/
COPY prompt_library/ ./prompt_library/
COPY tools/ ./tools/
COPY utils/ ./utils/
COPY app/ ./app/
COPY data/ ./data/
COPY database.py ./
COPY main.py ./

COPY --from=frontend-builder /frontend/build ./frontend/build

RUN pip install --upgrade pip \
    && pip install -r requirements.txt

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
