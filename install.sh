#!/bin/bash -e
# This script deploys the plugin by copying over the main.js, styles.css and manifest.json files to your vault directory
# If you opted to --build it from source it will...
# 1. First detect a compatible node runtime
# 2. Install dependencies if missing
# 3. build the main.js file
# 4. deploy the files.
# If you pass the --package flag, it will zip the files into a release package named meeting_<version>.zip.

main() {
  parse_args "$@"
  determine_plugin_id
  setup_plugin_dir

  if [[ "$BUILD" -eq 1 ]]; then
    build
  fi

  if [[ "$PACKAGE" -eq 1 ]]; then
    package
  else
    deploy
  fi
}

############################
#   Function Declarations  #
############################

# Parse command line arguments
parse_args() {
  BUILD=0
  PACKAGE=0

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --build)
        BUILD=1
        shift
        ;;
      --package)
        PACKAGE=1
        shift
        ;;
      *)
        if [[ $# -ne 1 ]]; then
          echo "Usage: $0 [--build] [--package] <path/to/vault>"
          exit 1
        fi
        VAULT_DIR="$1"
        shift
        ;;
    esac
  done

  if [[ -z "$VAULT_DIR" ]]; then
    echo "Usage: $0 [--build] [--package] <path/to/vault>"
    exit 1
  fi
}

# Determine PluginId from manifest.json or use a fallback
determine_plugin_id() {
  if command -v jq >/dev/null 2>&1; then
    PluginId=$(jq -r '.id' ./manifest.json)
  else
    PluginId="meeting"
  fi
}

# Set up the plugin directory path
setup_plugin_dir() {
  PluginDir="$VAULT_DIR/.obsidian/plugins/$PluginId"
}

# Detect the available JavaScript runtime
detect_runtime() {
  if command -v bun >/dev/null 2>&1; then
    echo "bun"
  elif command -v node >/dev/null 2>&1; then
    echo "node"
  else
    echo "none"
  fi
}

# Install dependencies based on the runtime
install() {
  local runtime="$1"
  if [[ "$runtime" == "bun" ]]; then
    install_bun
  else
    install_node
  fi
}

# Install dependencies using Bun
install_bun() {
  if [[ ! -f "bun.lockb" ]]; then
    echo "No bun.lockb detected - installing dependencies with Bun..."
    bun install
  fi
}

# Install dependencies using Node.js (npm)
install_node() {
  if [[ ! -f "package-lock.json" ]]; then
    echo "No package-lock.json detected - installing dependencies with npm..."
    npm install
  fi
}

# Build the plugin based on the runtime
build() {
  echo "Initializing build process..."
  local runtime=$(detect_runtime)

  if [[ "$runtime" == "none" ]]; then
    echo "Error: No JavaScript runtime found - please install bun or Node.js"
    exit 1
  fi

  install "$runtime"

  echo "Building with $runtime..."
  if [[ "$runtime" == "bun" ]]; then
    build_bun
  else
    build_node
  fi
}

# Build the plugin using Bun
build_bun() {
  bun run build:bun
}

# Build the plugin using Node.js
build_node() {
  npm run build:node
}

# Deploy the plugin to the Obsidian vault
deploy() {
  echo "Deploying plugin to vault..."
  mkdir -p "$PluginDir"
  cp main.js styles.css manifest.json "$PluginDir/"
  echo "✅ Deployment complete to: $PluginDir"
}

# Package the plugin into a zip file for GitHub releases
package() {
  echo "Packaging plugin for release..."

  if command -v jq >/dev/null 2>&1; then
    version=$(jq -r '.version' ./manifest.json)
  else
    echo "Error: jq is required to read the version from manifest.json."
    exit 1
  fi

  zip_filename="meeting_${version}.zip"

  # Create a temporary directory for packaging
  temp_dir=$(mktemp -d)
  cp main.js styles.css manifest.json "$temp_dir/"

  # Zip the files
  (cd "$temp_dir" && zip -r "../$zip_filename" .)
  mv "$temp_dir/../$zip_filename" .

  # Clean up the temporary directory
  rm -rf "$temp_dir"

  echo "✅ Package created: $zip_filename"
}

############################
#           END            #
############################

# Run the main function
main "$@"