#!/bin/bash
# Decrypts SOPS-encrypted resume.yml before next build.
# Requires AGE_SECRET_KEY env var (age private key).
if [ -f .env.local ] && [ -z "$AGE_SECRET_KEY" ]; then
  AGE_SECRET_KEY=$(grep -E '^AGE_SECRET_KEY=' .env.local | cut -d'=' -f2-)
fi

if [ -z "$AGE_SECRET_KEY" ]; then
  echo "AGE_SECRET_KEY not set — skipping resume decrypt."
  exit 0
fi

if ! command -v sops &> /dev/null; then
  echo "Downloading sops..."
  curl -fsSL "https://github.com/getsops/sops/releases/download/v3.9.4/sops-v3.9.4.linux.amd64" \
    -o /usr/local/bin/sops && chmod +x /usr/local/bin/sops
fi

if ! command -v sops &> /dev/null; then
  echo "sops not found — skipping resume decrypt."
  exit 0
fi

echo "Decrypting resume..."
export SOPS_AGE_KEY="$AGE_SECRET_KEY"
sops --decrypt --in-place src/_data/resume.yml
echo "Resume decrypted."
