#!/usr/bin/env python3
"""
Generate financial reports (Excel, PowerPoint, PDF) using Anthropic Managed Agents
with official financial services skills.

Usage:
    python scripts/financial_report.py --type xlsx --task "Create a Q3 P&L dashboard"
    python scripts/financial_report.py --type pptx --task "Build an investor deck for Series A"
    python scripts/financial_report.py --type pdf  --task "Write a DCF analysis report for ACME Corp"
"""

import argparse
import os
import sys
import time
import json
import base64
from pathlib import Path

import anthropic

SKILL_MAP = {
    "xlsx": {
        "skill_id": "xlsx",
        "description": "Excel workbooks with formulas, charts, and financial dashboards",
        "packages": ["pandas", "openpyxl", "xlsxwriter"],
        "extension": ".xlsx",
    },
    "pptx": {
        "skill_id": "pptx",
        "description": "PowerPoint presentations with charts and executive summaries",
        "packages": ["pandas", "python-pptx", "matplotlib"],
        "extension": ".pptx",
    },
    "pdf": {
        "skill_id": "pdf",
        "description": "PDF reports with structured financial content",
        "packages": ["pandas", "reportlab", "weasyprint"],
        "extension": ".pdf",
    },
}

SYSTEM_PROMPT = """You are an expert financial analyst agent. Your job is to produce
high-quality, professional financial documents. Always:
- Use realistic but clearly illustrative sample data when no data is provided
- Apply proper financial formatting (currency, percentages, basis points)
- Include executive summary, key metrics, and actionable insights
- Save the output file in the working directory with a descriptive filename
- After completing the file, print the exact filename on a line starting with FILE:"""


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Generate financial reports via Anthropic Managed Agents",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument(
        "--type",
        choices=list(SKILL_MAP.keys()),
        required=True,
        metavar="FORMAT",
        help="Output format: xlsx | pptx | pdf",
    )
    p.add_argument(
        "--task",
        required=True,
        help="Description of the financial report to generate",
    )
    p.add_argument(
        "--output-dir",
        default="./output",
        help="Directory to save the generated file (default: ./output)",
    )
    p.add_argument(
        "--api-key",
        default=os.environ.get("ANTHROPIC_API_KEY"),
        help="Anthropic API key (defaults to ANTHROPIC_API_KEY env var)",
    )
    p.add_argument(
        "--model",
        default="claude-opus-4-8",
        help="Claude model to use (default: claude-opus-4-8)",
    )
    p.add_argument(
        "--timeout",
        type=int,
        default=300,
        help="Max seconds to wait for completion (default: 300)",
    )
    p.add_argument(
        "--verbose",
        action="store_true",
        help="Print agent event stream to stdout",
    )
    return p


def create_environment(client: anthropic.Anthropic, skill_info: dict) -> str:
    print("  Creating sandbox environment...")
    env = client.beta.environments.create(
        name=f"financial-report-{int(time.time())}",
        config={
            "type": "cloud",
            "packages": {"pip": skill_info["packages"]},
            "networking": {"type": "unrestricted"},
        },
    )
    print(f"  Environment ready: {env.id}")
    return env.id


def create_agent(client: anthropic.Anthropic, skill_info: dict, model: str) -> str:
    print(f"  Creating financial agent with {skill_info['skill_id'].upper()} skill...")
    agent = client.beta.agents.create(
        name=f"Financial Report Agent ({skill_info['skill_id'].upper()})",
        model=model,
        system=SYSTEM_PROMPT,
        skills=[
            {"type": "anthropic", "skill_id": skill_info["skill_id"]},
        ],
    )
    print(f"  Agent ready: {agent.id}")
    return agent.id


def run_session(
    client: anthropic.Anthropic,
    agent_id: str,
    environment_id: str,
    task: str,
    timeout: int,
    verbose: bool,
) -> tuple[str | None, list[dict]]:
    """
    Creates a session, sends the task, polls for completion.
    Returns (output_filename, all_events).
    """
    print("  Starting session...")
    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=environment_id,
    )
    session_id = session.id
    print(f"  Session started: {session_id}")

    print("  Sending task to agent...")
    client.beta.sessions.events.send(
        session_id,
        events=[
            {
                "type": "user.message",
                "content": [{"type": "text", "text": task}],
            }
        ],
    )

    print("  Waiting for agent to complete", end="", flush=True)
    deadline = time.time() + timeout
    collected_events: list[dict] = []
    output_filename: str | None = None
    poll_interval = 3

    while time.time() < deadline:
        time.sleep(poll_interval)
        print(".", end="", flush=True)

        session_state = client.beta.sessions.retrieve(session_id)
        status = session_state.status

        # Fetch latest events
        events_page = client.beta.sessions.events.list(session_id)
        for event in events_page.data:
            event_dict = event.model_dump() if hasattr(event, "model_dump") else vars(event)
            if event_dict not in collected_events:
                collected_events.append(event_dict)
                if verbose:
                    print(f"\n[EVENT] {json.dumps(event_dict, indent=2)}")

                # Look for FILE: marker in text outputs
                content = event_dict.get("content", [])
                if isinstance(content, list):
                    for block in content:
                        text = block.get("text", "") if isinstance(block, dict) else ""
                        for line in text.splitlines():
                            if line.startswith("FILE:"):
                                output_filename = line.split("FILE:", 1)[1].strip()

        if status in ("completed", "failed", "error"):
            print(f" {status}")
            break
    else:
        print(" timeout")

    return output_filename, collected_events


def download_file(
    client: anthropic.Anthropic,
    session_id: str,
    remote_filename: str,
    output_dir: Path,
    extension: str,
) -> Path:
    """Download the generated file from the session sandbox."""
    output_dir.mkdir(parents=True, exist_ok=True)
    local_name = remote_filename if remote_filename else f"financial_report{extension}"
    local_path = output_dir / Path(local_name).name

    try:
        # Retrieve file content via sessions files API
        file_content = client.beta.sessions.files.retrieve_content(
            session_id, path=remote_filename
        )
        local_path.write_bytes(file_content)
    except Exception:
        # Fallback: ask agent to base64-encode and return inline
        print("\n  Trying inline file retrieval fallback...")
        client.beta.sessions.events.send(
            session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                f"Please output the file '{remote_filename}' as a "
                                "base64-encoded string prefixed with BASE64_FILE: "
                                "on a single line."
                            ),
                        }
                    ],
                }
            ],
        )
        time.sleep(15)
        events_page = client.beta.sessions.events.list(session_id)
        for event in events_page.data:
            event_dict = event.model_dump() if hasattr(event, "model_dump") else vars(event)
            for block in event_dict.get("content", []):
                text = block.get("text", "") if isinstance(block, dict) else ""
                for line in text.splitlines():
                    if line.startswith("BASE64_FILE:"):
                        encoded = line.split("BASE64_FILE:", 1)[1].strip()
                        local_path.write_bytes(base64.b64decode(encoded))
                        return local_path

    return local_path


def cleanup(client: anthropic.Anthropic, agent_id: str, environment_id: str) -> None:
    try:
        client.beta.agents.archive(agent_id)
        client.beta.environments.archive(environment_id)
    except Exception:
        pass


def main() -> int:
    args = build_arg_parser().parse_args()

    if not args.api_key:
        print("Error: ANTHROPIC_API_KEY not set. Use --api-key or export ANTHROPIC_API_KEY.")
        return 1

    skill_info = SKILL_MAP[args.type]
    output_dir = Path(args.output_dir)

    print(f"\nGenerating {args.type.upper()} financial report")
    print(f"Task   : {args.task}")
    print(f"Skill  : {skill_info['description']}")
    print(f"Output : {output_dir.resolve()}\n")

    client = anthropic.Anthropic(api_key=args.api_key)
    environment_id = agent_id = None

    try:
        environment_id = create_environment(client, skill_info)
        agent_id = create_agent(client, skill_info, args.model)

        output_filename, _ = run_session(
            client=client,
            agent_id=agent_id,
            environment_id=environment_id,
            task=args.task,
            timeout=args.timeout,
            verbose=args.verbose,
        )

        if not output_filename:
            print("\nWarning: agent did not report a FILE: path. Trying default name.")
            output_filename = f"financial_report{skill_info['extension']}"

        session = client.beta.sessions.list(agent=agent_id).data[0]
        local_path = download_file(
            client=client,
            session_id=session.id,
            remote_filename=output_filename,
            output_dir=output_dir,
            extension=skill_info["extension"],
        )

        print(f"\nFile saved to: {local_path.resolve()}")
        return 0

    except KeyboardInterrupt:
        print("\nInterrupted.")
        return 130
    except anthropic.APIError as exc:
        print(f"\nAPI error: {exc}")
        return 1
    finally:
        if agent_id or environment_id:
            print("Cleaning up remote resources...")
            cleanup(client, agent_id or "", environment_id or "")


if __name__ == "__main__":
    sys.exit(main())
