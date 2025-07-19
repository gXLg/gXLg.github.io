#!/bin/sh

# Check if pyenv is installed
if ! pyenv --version >/dev/null 2>&1; then
  echo "Pyenv is not installed. Follow the installation guide on:"
  echo "  https://github.com/pyenv/pyenv"
  exit 1
fi

# Check if the venv helper already exists
if command -v venv >/dev/null; then
  echo "You already have the 'venv' command installed"
  exit 1
fi

# Get the shell
shell_name=$(basename "$SHELL")

# Dotfile
rc_file=""
case "$shell_name" in
  bash)
    rc_file="$HOME/.bashrc"
    ;;
  zsh)
    rc_file="$HOME/.zshrc"
    ;;
  sh)
    # usually no rc file, or .profile
    rc_file="$HOME/.profile"
    ;;
  csh|tcsh)
    rc_file="$HOME/.cshrc"
    ;;
  fish)
    # fish config is usually here
    rc_file="$HOME/.config/fish/config.fish"
    ;;
  *)
    echo "Unknown shell: $shell_name"
    rc_file=""
    ;;
esac

if [ -n "$rc_file" ]; then
  echo "Detected rc file: $rc_file"
else
  echo "No rc file detected for shell: $shell_name"
  exit 1
fi

# Activation
case "$shell_name" in
  bash|sh|zsh)
    activate="activate"
    ;;
  csh|tcsh)
    activate="activate.csh"
    ;;
  fish)
    activate="activate.fish"
    ;;
  *)
    echo "Shell $shell_name not recognized, defaulting to bash activate"
    activate="activate"
    ;;
esac

# Write the venv helper function
cat << EOF >> $rc_file


venv() {
  if [[ ! -d .venv ]]; then
    pyenv local 2>/dev/null || (
      if [[ "\$1" == "" ]]; then
        echo "No version specified for this directory, please specify on the first run"
        exit 1
      else
        pyenv local "\$1" || (
          pyenv install "\$1" && pyenv local "\$1"
        )
      fi
    ) && (echo "Creating Python Virtual Environment..."; pyenv exec python -m venv ./.venv && echo "\n# Python Venv\n.venv" >> .gitignore)
  fi && source .venv/bin/$activate
}


EOF

echo "venv helper installed! To remove, remove the 'venv' function definition from '$rc_file'"
echo "To use the function, restart your shell"
