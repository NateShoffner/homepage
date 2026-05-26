#!/bin/bash
# Unlocks git-crypt encrypted files during Vercel CI build.
# Requires GIT_CRYPT_KEY env var set to base64-encoded key output from:
#   git-crypt export-key - | base64 -w0
if [ -n "$GIT_CRYPT_KEY" ]; then
  echo "Unlocking git-crypt..."
  echo "$GIT_CRYPT_KEY" | base64 -d > /tmp/git-crypt-key
  apt-get install -y git-crypt > /dev/null 2>&1 || true
  git-crypt unlock /tmp/git-crypt-key
  rm -f /tmp/git-crypt-key
  echo "git-crypt unlock complete."
else
  echo "GIT_CRYPT_KEY not set — skipping git-crypt unlock."
fi
