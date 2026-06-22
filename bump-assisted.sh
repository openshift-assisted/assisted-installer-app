#!/usr/bin/env bash
#
# Bump @openshift-assisted/locales, types, and ui-lib to a new version.
#
# The script updates package.json, runs npm install & build, starts the
# dev server so you can verify the upgrade, then asks for confirmation.
# If confirmed it creates a branch and commits the change; otherwise it
# exits and leaves the working tree as-is.
#
set -euo pipefail

# ── Colors & logging ─────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}${BOLD}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}${BOLD}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}${BOLD}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}${BOLD}[ERROR]${NC} $*" >&2; }

# ── Globals ───────────────────────────────────────────────────────────

PACKAGE_JSON="$(dirname "$0")/package.json"
PROJECT_DIR="$(dirname "$PACKAGE_JSON")"
DEV_SERVER_PID=""
DEV_SERVER_LOG=""
VERSION=""

# ── Cleanup (runs on EXIT / Ctrl+C) ──────────────────────────────────

cleanup() {
  if [[ -n "$DEV_SERVER_PID" ]] && kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
    warn "Stopping dev server (PID $DEV_SERVER_PID) ..."
    kill -- -"$DEV_SERVER_PID" 2>/dev/null || kill "$DEV_SERVER_PID" 2>/dev/null
    sleep 1
    kill -9 -- -"$DEV_SERVER_PID" 2>/dev/null || kill -9 "$DEV_SERVER_PID" 2>/dev/null
    wait "$DEV_SERVER_PID" 2>/dev/null || true
  fi
  if [[ -n "$DEV_SERVER_LOG" && -f "$DEV_SERVER_LOG" ]]; then
    rm -f "$DEV_SERVER_LOG"
  fi
}
trap cleanup EXIT

# ── Step functions ────────────────────────────────────────────────────

prompt_version() {
  if [[ ! -f "$PACKAGE_JSON" ]]; then
    err "package.json not found at $PACKAGE_JSON"
    exit 1
  fi

  read -rp "Enter the new @openshift-assisted version: " VERSION

  if [[ -z "$VERSION" ]]; then
    err "Version cannot be empty"
    exit 1
  fi
}

update_package_json() {
  info "Updating @openshift-assisted packages to ${BOLD}$VERSION${NC} ..."

  for pkg in locales types ui-lib; do
    sed -i "s/\"@openshift-assisted\/$pkg\": \"[^\"]*\"/\"@openshift-assisted\/$pkg\": \"$VERSION\"/" "$PACKAGE_JSON"
  done

  ok "package.json updated."
}

run_npm_install() {
  info "Running npm install ..."
  npm install --prefix "$PROJECT_DIR" || { err "npm install failed"; exit 1; }
  ok "npm install succeeded."
}

run_npm_build() {
  info "Running npm run build ..."
  npm run build --prefix "$PROJECT_DIR" || { err "npm run build failed"; exit 1; }
  ok "Build succeeded."
}

run_npm_start() {
  DEV_SERVER_LOG="$(mktemp /tmp/dev-server-XXXXXX.log)"
  info "Starting dev server in the background ..."
  npm run start --prefix "$PROJECT_DIR" > "$DEV_SERVER_LOG" 2>&1 &
  DEV_SERVER_PID=$!

  sleep 20

  if ! kill -0 "$DEV_SERVER_PID" 2>/dev/null; then
    err "Dev server exited unexpectedly. Check log: $DEV_SERVER_LOG"
    exit 1
  fi

  echo ""
  ok "App will be running on:"
  ok "${BOLD}https://prod.foo.redhat.com:1337/openshift/assisted-installer/clusters/${NC}"
  echo ""
}

confirm_commit_and_push() {
  read -rp "Did the version upgrade go well? (y/n): " ANSWER

  if [[ "$ANSWER" =~ ^[Yy]$ ]]; then
    info "Creating branch ${BOLD}bump-ai-ui-lib-v${VERSION}${NC} ..."
    git checkout -b "bump-ai-ui-lib-v${VERSION}" || { err "Failed to create branch"; exit 1; }

    info "Staging and committing package.json and package-lock.json ..."
    git add "$PACKAGE_JSON"
    git add "$PROJECT_DIR/package-lock.json" 2>/dev/null || true
    git commit -m "Update openshift-assisted-ui-lib to v${VERSION}" || { err "git commit failed"; exit 1; }

    info "Pushing branch to origin ..."
    git push --set-upstream origin "bump-ai-ui-lib-v${VERSION}" || { err "git push failed"; exit 1; }

    ok "Pushed branch ${BOLD}bump-ai-ui-lib-v${VERSION}${NC} to origin."
  else
    warn "Upgrade declined. Exiting."
    exit 1
  fi
}

# ── Main ──────────────────────────────────────────────────────────────

STEPS=(
  prompt_version
  update_package_json
  run_npm_install
  run_npm_build
  run_npm_start
  confirm_commit_and_push
)

echo ""
info "The script will run these steps in order:"
echo ""
for i in "${!STEPS[@]}"; do
  echo "  $((i + 1))) ${STEPS[$i]}"
done
echo ""
read -rp "Which step do you want to start from? " START_STEP
START_STEP="${START_STEP:-1}"

for i in "${!STEPS[@]}"; do
  if (( i + 1 >= START_STEP )); then
    ${STEPS[$i]}
  fi
done
