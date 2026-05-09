"""
Exemplo de agente HAC.

Para receber parâmetros do job, leia as variáveis de ambiente:
  HAC_PARAM_<NOME_EM_MAIÚSCULAS>

Exemplo: se o job foi criado com params={"url": "https://...", "limite": 10},
os valores estarão em:
  os.environ["HAC_PARAM_URL"]
  os.environ["HAC_PARAM_LIMITE"]

Tudo escrito em stdout fica salvo no campo 'output' do job.
Qualquer erro escrito em stderr marca o job como 'failed'.
"""
import os
import json
from datetime import datetime

url = os.environ.get("HAC_PARAM_URL", "https://exemplo.com")
limite = int(os.environ.get("HAC_PARAM_LIMITE", "5"))

print(f"[{datetime.utcnow().isoformat()}] Iniciando agente")
print(f"URL alvo: {url}")
print(f"Limite: {limite}")

# --- sua lógica aqui ---
resultados = [{"item": i, "url": url} for i in range(limite)]
print(json.dumps(resultados, indent=2, ensure_ascii=False))

print("Agente finalizado com sucesso.")
