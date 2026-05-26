#!/bin/bash
# Unlocks git-crypt encrypted files during Vercel CI build.
# Requires GIT_CRYPT_KEY env var set to base64-encoded key output from:
#   git-crypt export-key - | base64 -w0
if [ -f .env.local ] && [ -z "$GIT_CRYPT_KEY" ]; then
  GIT_CRYPT_KEY=$(grep -E '^GIT_CRYPT_KEY=' .env.local | cut -d'=' -f2-)
fi

if [ -n "$GIT_CRYPT_KEY" ]; then
  echo "Unlocking git-crypt..."
  echo "$GIT_CRYPT_KEY" | base64 -d > /tmp/git-crypt-key
  if ! command -v git-crypt &> /dev/null; then
    apt-get update -qq && apt-get install -y git-crypt > /dev/null 2>&1 || true
  fi
  if ! command -v git-crypt &> /dev/null; then
    echo "apt-get failed, downloading git-crypt binary..."
    curl -fsSL "https://github.com/AGWA/git-crypt/releases/download/0.7.0/git-crypt-0.7.0-linux-x86_64" \
      -o /usr/local/bin/git-crypt && chmod +x /usr/local/bin/git-crypt || true
  fi
  if ! command -v git-crypt &> /dev/null; then
    echo "git-crypt not found — skipping unlock."
    rm -f /tmp/git-crypt-key
    exit 0
  fi
  git-crypt unlock /tmp/git-crypt-key
  rm -f /tmp/git-crypt-key
  echo "git-crypt unlock complete."
else
  echo "GIT_CRYPT_KEY not set — skipping git-crypt unlock."
fi
