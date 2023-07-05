#!/bin/bash

# Variables
accion=""

# Options
show_help() {
  echo "Uso: $0 [OPCIÓN]"
  echo "Options:"
  echo "  --dev            Run dev container"
  echo "  --prod           Run prod container"
  echo "  --stop           Stop container"
  echo "  --clear          Clear container and volumes (db) and images (todo-api)"
  echo "  --help           Show help"
  exit 1
}

# Arguments
while getopts ":h-:" opt; do
  case $opt in 
    (-)
      case "${OPTARG}" in
        (dev|prod|stop|clear)
          accion="${OPTARG}"
        ;;
        (help)
          show_help
        ;;
        (*)
          echo "Invalid option: --${OPTARG}" >&2
          show_help
        ;;
      esac
      ;;
    (h)
      show_help
      ;;
    (\?)
      echo "Invalid option: -$OPTARG" >&2
      show_help
      ;;
  esac
done

# Check if a valid action was provided
if [ -z "$accion" ]; then
  echo "Required a valid action. Use --help to get help."
  exit 1
fi

# Run action
case "$accion" in
  (dev)
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
    ;;
  (prod)
    docker-compose -f docker-compose.yml up -d --build
    ;;
  (stop)
    docker-compose down
    ;;
  (clear)
    docker-compose down -v && rm -rf .db && rm -rf node_modules && docker rmi todo-api
    ;;
  (*)
    echo "Action no valid: $accion. Use --help to show options."
    exit 1
    ;;
esac
