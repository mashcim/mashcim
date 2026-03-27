

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    nmap \
    curl \
    wget \
    git \
    vim \
    tcpdump \
    netcat-openbsd \
    dnsutils \
    whois \
    openssl \
    ssh \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN groupadd -r security && useradd -r -g security security

COPY . .

RUN chown -R security:security /app

USER security

RUN mkdir -p /app/scans /app/logs /app/reports

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["python", "security_scanner.py"]
