#!/bin/bash
set -e

echo "Starting build process..."

echo "Installing Maven dependencies..."
./mvnw clean package -DskipTests

echo "Build completed successfully!"