#!/bin/sh


pyenv --version 2>/dev/null || (echo "Pyenv is not installed, follow the installation guide on [https://github.com/pyenv/pyenv]") && (
  test -f /usr/local/bin/venv && (
    echo "You already have an executable at '/usr/local/bin/venv'"
  ) || (
    echo > /usr/local/bin/venv || (echo "Permission denied! Run the script with admin permissions!") && (
      cat << EOF > /usr/local/bin/venv
#!/bin/sh
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
    )
  )
)
