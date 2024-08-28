#!/bin/bash


URL="http://localhost:6005/api/product/uploads"

JSON_FILE="product_list.json"

if [[ ! -f "$JSON_FILE" ]]; then
  echo "Error: $JSON_FILE not found."
  exit 1
fi

curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d @"$JSON_FILE"