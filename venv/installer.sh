#!/bin/sh

# Check if pyenv is installed
if ! pyenv --version >/dev/null 2>&1; then
  echo "Pyenv is not installed. Follow the installation guide on:"
  echo "  https://github.com/pyenv/pyenv"
  exit 1
fi

# Check if the venv helper already exists
if [ -f /usr/local/bin/venv ]; then
  echo "You already have an executable at '/usr/local/bin/venv'"
  exit 1
fi

# Try creating the venv helper
if ! touch /usr/local/bin/venv 2>/dev/null; then
  echo "Permission denied! Run the script with admin permissions!"
  exit 1
fi

# Write the venv helper script
cat << EOF > /usr/local/bin/venv
#!/bin/bash
if [[ ! -d .venv ]]; then
  pyenv local 2>/dev/null || (
    if [[ "$1" == "" ]]; then
      echo "No version specified for this directory, please specify on the first run"
      exit 1
    else
      pyenv local "$1" || (
        pyenv install "$1" && pyenv local "$1"
      )
    fi
  ) && (echo "Creating Python Virtual Environment..."; pyenv exec python -m venv ./.venv && echo "\n# Python Venv\n.venv" >> .gitignore)
fi && source .venv/bin/activate
EOF

chmod +x /usr/local/bin/venv
echo "venv helper installed! To remove, run 'rm /usr/local/bin/venv'"
