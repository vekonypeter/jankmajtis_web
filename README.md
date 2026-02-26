# jankmajtis_web

Official website for the village of Jánkmajtis, Hungary.

## Deployment

The `deploy.sh` script uploads changed files to the FTP server.

### Prerequisites

```bash
brew install lftp
```

### Password storage (optional, macOS only)

Store the FTP password in macOS Keychain to avoid entering it each time:

```bash
security add-generic-password -a jankmajtishu -s jankmajtis-ftp -w
```

If the password is not in Keychain, the script will prompt for it.

### Usage

```bash
# Dry run — shows what would change, uploads nothing
./deploy.sh --dry-run

# Deploy
./deploy.sh
```

The script works in two passes:
1. **Source files** — full sync (uploads changed files + deletes files on the server that no longer exist locally)
2. **`news/` and `docs/`** — uploads newer files only, never deletes from the server