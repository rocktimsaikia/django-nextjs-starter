FROM python:3.10-slim

# Set env varibales to ensure Python runs in unbuffered mode
# and from prevents Python from writing pyc files to disc
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
		gcc \
		default-libmysqlclient-dev \
		pkg-config \
		libsasl2-dev

# Set the working directory in the container
WORKDIR /main

# Install dependencies
COPY requirements.txt /main/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the code into the container
COPY . /main/
