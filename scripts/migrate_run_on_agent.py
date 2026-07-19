"""Migração única: troca run_on='server' (ou ausente) para run_on='agent' em todos
os passos de todas as automações já salvas do Studio, alinhando com o novo padrão
(STEP_DEFAULTS.run_on='agent' no frontend, StepConfig.run_on='agent' no backend).

Não mexe nos tipos de step onde run_on é ignorado (IA/pipeline/automação/navegador/
quebrar loop). Uso: python -m scripts.migrate_run_on_agent [--apply]
Sem --apply roda em modo dry-run (só mostra quantos passos mudariam).
"""
import asyncio
import sys

from api.database import studio_automations_col

_RUN_ON_IGNORED_TYPES = {
    "call_ai_agent", "call_pipeline", "call_automation",
    "browser", "browser_open", "browser_click", "browser_type",
    "browser_extract", "browser_wait", "browser_screenshot", "browser_close",
    "break_loop",
}


def _migrate_steps(steps: list) -> int:
    """Muda run_on in-place recursivamente. Retorna quantos passos foram alterados."""
    changed = 0
    for step in steps:
        step_type = step.get("type", "")
        cfg = step.setdefault("config", {})
        if step_type not in _RUN_ON_IGNORED_TYPES and cfg.get("run_on", "server") != "agent":
            cfg["run_on"] = "agent"
            changed += 1
        for branch in ("children", "children_true", "children_false"):
            if step.get(branch):
                changed += _migrate_steps(step[branch])
    return changed


async def main():
    apply = "--apply" in sys.argv
    automations_touched = 0
    steps_touched = 0

    async for doc in studio_automations_col.find({}):
        steps = doc.get("steps", [])
        changed = _migrate_steps(steps)
        if changed:
            automations_touched += 1
            steps_touched += changed
            if apply:
                await studio_automations_col.update_one(
                    {"_id": doc["_id"]}, {"$set": {"steps": steps}}
                )

    mode = "APLICADO" if apply else "DRY-RUN (nada foi salvo — rode com --apply pra gravar)"
    print(f"[{mode}] {automations_touched} automação(ões), {steps_touched} passo(s) run_on: server -> agent")


if __name__ == "__main__":
    asyncio.run(main())
