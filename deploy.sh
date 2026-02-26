#!/bin/bash
# Uploads the website to the FTP server

SERVER="ftp.hosting.atw.hu"
USER="jankmajtishu"

# Try macOS Keychain first, fall back to manual prompt
PASSWORD=$(security find-generic-password -a jankmajtishu -s jankmajtis-ftp -w 2>/dev/null)
if [ -z "$PASSWORD" ]; then
  read -s -p "FTP password: " PASSWORD
  echo
fi

EXCLUDES="\
  --exclude .git/ \
  --exclude .gitignore \
  --exclude CLAUDE.md \
  --exclude v2/ \
  --exclude node_modules/ \
  --exclude .DS_Store \
  --exclude .vscode/ \
  --exclude .github/ \
  --exclude deploy.sh \
  --exclude news/ \
  --exclude docs/ \
  --exclude etc/ \
  --exclude dev/"

# Step 1: Show what would change
echo "Checking for changes..."
echo
lftp -u "$USER","$PASSWORD" "$SERVER" <<EOF
mirror --reverse --delete --verbose --dry-run $EXCLUDES . .
mirror --reverse --only-newer --verbose --dry-run news/ news/
mirror --reverse --only-newer --verbose --dry-run docs/ docs/
quit
EOF

# Step 2: Ask for confirmation
echo
read -p "Proceed with upload? [y/N] " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

# Step 3: Deploy
echo
echo "Deploying..."
lftp -u "$USER","$PASSWORD" "$SERVER" <<EOF
mirror --reverse --delete --verbose $EXCLUDES . .
mirror --reverse --only-newer --verbose news/ news/
mirror --reverse --only-newer --verbose docs/ docs/
quit
EOF

echo "Done."
