import os
import subprocess
import sys
import tempfile
from typing import Dict, Any, Tuple


def run_script(script: str, params: Dict[str, Any], timeout: int) -> Tuple[str, str]:
    """
    Executa um script Python em subprocess isolado.
    Parâmetros são passados como variáveis de ambiente HAC_PARAM_<KEY>=<VALUE>.
    O script pode acessá-los com os.environ.get('HAC_PARAM_NOME').
    Retorna (stdout, stderr).
    """
    env = os.environ.copy()
    for key, value in params.items():
        env[f"HAC_PARAM_{key.upper()}"] = str(value)

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env,
        )
        return result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execução ultrapassou {timeout}s"
    except Exception as e:
        return "", str(e)
    finally:
        os.unlink(tmp_path)
