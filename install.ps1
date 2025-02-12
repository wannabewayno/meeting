# This script deploys the plugin by copying over the main.js, styles.css, and manifest.json files to your vault directory.
# If you opted to --build it from source, it will...
# 1. First detect a compatible Node runtime.
# 2. Install dependencies if missing.
# 3. Build the main.js file.
# 4. Deploy the files.

$ErrorActionPreference = "Stop"

function Main {
  param (
      [string[]]$args
  )

  Parse-Args $args
  Determine-PluginId
  Setup-PluginDir

  if ($Build -eq 1) {
      Build
  }

  Deploy
}

############################
#   Function Declarations  #
############################

# Parse command line arguments
function Parse-Args {
  param (
      [string[]]$args
  )

  $script:Build = 0

  if ($args[0] -eq "--build") {
      $script:Build = 1
      $args = $args[1..($args.Length - 1)]
  }

  if ($args.Length -ne 1) {
      Write-Host "Usage: $0 [--build] <path/to/vault>"
      exit 1
  }

  $script:VaultDir = $args[0]
}

# Determine PluginId from manifest.json or use a fallback
function Determine-PluginId {
  if (Get-Command jq -ErrorAction SilentlyContinue) {
      $script:PluginId = (Get-Content ./manifest.json | jq -r '.id')
  } else {
      $script:PluginId = "meeting"
  }
}

# Set up the plugin directory path
function Setup-PluginDir {
  $script:PluginDir = Join-Path $VaultDir ".obsidian/plugins/$PluginId"
}

# Detect the available JavaScript runtime
function Detect-Runtime {
  if (Get-Command bun -ErrorAction SilentlyContinue) {
      return "bun"
  } elseif (Get-Command node -ErrorAction SilentlyContinue) {
      return "node"
  } else {
      return "none"
  }
}

# Install dependencies based on the runtime
function Install {
  param (
      [string]$runtime
  )

  if ($runtime -eq "bun") {
      Install-Bun
  } else {
      Install-Node
  }
}

# Install dependencies using Bun
function Install-Bun {
  if (-Not (Test-Path "bun.lockb")) {
      Write-Host "No bun.lockb detected - installing dependencies with Bun..."
      bun install
  }
}

# Install dependencies using Node.js (npm)
function Install-Node {
  if (-Not (Test-Path "package-lock.json")) {
      Write-Host "No package-lock.json detected - installing dependencies with npm..."
      npm install
  }
}

# Build the plugin based on the runtime
function Build {
  Write-Host "Initializing build process..."
  $runtime = Detect-Runtime

  if ($runtime -eq "none") {
      Write-Host "Error: No JavaScript runtime found - please install bun or Node.js"
      exit 1
  }

  Install $runtime

  Write-Host "Building with $runtime..."
  if ($runtime -eq "bun") {
      Build-Bun
  } else {
      Build-Node
  }
}

# Build the plugin using Bun
function Build-Bun {
  bun run build:bun
}

# Build the plugin using Node.js
function Build-Node {
  npm run build:node
}

# Deploy the plugin to the Obsidian vault
function Deploy {
  Write-Host "Deploying plugin to vault..."
  if (-Not (Test-Path $PluginDir)) {
      New-Item -ItemType Directory -Path $PluginDir | Out-Null
  }
  Copy-Item main.js $PluginDir
  Copy-Item styles.css $PluginDir
  Copy-Item manifest.json $PluginDir
  Write-Host "✅ Deployment complete to: $PluginDir"
}

############################
#           END            #
############################

# Run the main function
Main $args