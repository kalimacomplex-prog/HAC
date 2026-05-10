#!/bin/bash
# Atalho para iniciar o HAC Worker (use após instalar)
INSTALL_DIR="$HOME/.hac-worker"

if [ ! -f "$INSTALL_DIR/worker.py" ]; then
    echo "HAC Worker não instalado. Execute instalar-agente.sh primeiro."
    read -p "Pressione Enter para fechar..."
    exit 1
fi

cd "$INSTALL_DIR"
exec "$INSTALL_DIR/venv/bin/python" worker.py
