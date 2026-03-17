#!/usr/bin/env python3
"""
ChangelogAI CLI - Generate AI-powered changelogs from GitHub repos

Usage:
  changelog-ai <owner/repo> [--from v1.0.0] [--to v1.1.0] [--output CHANGELOG.md]
  changelog-ai --help

Install:
  pip install requests anthropic
  chmod +x changelog-ai.py
  ln -s $(pwd)/changelog-ai.py /usr/local/bin/changelog-ai
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime
from typing import Optional

VERSION = "0.1.0"
API_URL = os.environ.get("CHANGELOG_AI_API", "https://changelog-ai.vercel.app/api/generate")


def fetch_commits_github(repo: str, from_tag: str, to_tag: str, token: Optional[str] = None):
    """Fetch commits from GitHub API"""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": f"ChangelogAI-CLI/{VERSION}",
    }
    
    auth_token = token or os.environ.get("GITHUB_TOKEN")
    if auth_token:
        headers["Authorization"] = f"token {auth_token}"

    if from_tag and to_tag:
        url = f"https://api.github.com/repos/{repo}/compare/{from_tag}...{to_tag}"
    else:
        ref = to_tag or from_tag or "HEAD"
        url = f"https://api.github.com/repos/{repo}/commits?sha={ref}&per_page=50"

    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = json.loads(e.read())
        raise RuntimeError(f"GitHub API error: {error_body.get('message', str(e))}")

    if isinstance(data, dict) and "commits" in data:
        commits = data["commits"]
    else:
        commits = data

    return [
        {
            "sha": c["sha"][:7],
            "message": c["commit"]["message"],
            "author": c["commit"]["author"]["name"],
            "date": c["commit"]["author"]["date"],
        }
        for c in commits
    ]


def generate_with_anthropic(repo: str, commits: list, from_tag: str, to_tag: str) -> str:
    """Generate changelog using Anthropic Claude"""
    try:
        import anthropic
    except ImportError:
        return None

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    client = anthropic.Anthropic(api_key=api_key)
    
    commit_list = "\n".join(
        f"- {c['sha']} {c['message'].splitlines()[0]} (by {c['author']})"
        for c in commits[:100]
    )
    
    version = to_tag or "Latest"
    since = f" (since {from_tag})" if from_tag else ""
    
    prompt = f"""You are a technical writer creating professional release notes.

Repository: {repo}
Version: {version}{since}

Commits:
{commit_list}

Generate a clean, professional changelog in Markdown. Rules:
1. Group into: 🚀 New Features, 🐛 Bug Fixes, ⚠️ Breaking Changes, 🔒 Security, 📦 Dependencies, 🔧 Internal
2. Skip empty categories
3. Rewrite commits in user-friendly language
4. Add brief summary at top
5. Add contributors list if multiple authors

Format:
## [{version}] - {datetime.now().strftime('%Y-%m-%d')}

Brief summary.

### 🚀 New Features
- Feature description

etc."""

    message = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    
    return message.content[0].text


def generate_rule_based(repo: str, commits: list, from_tag: str, to_tag: str) -> str:
    """Fallback: rule-based changelog generation"""
    date = datetime.now().strftime("%Y-%m-%d")
    version = to_tag or "v1.0.0"
    
    features, fixes, breaking, internal = [], [], [], []
    
    for c in commits:
        msg = c["message"].splitlines()[0]
        ml = msg.lower()
        
        if ml.startswith(("feat", "add ", "new ")):
            clean = msg.split(":", 1)[-1].strip() if ":" in msg else msg
            features.append(f"- {clean}")
        elif ml.startswith(("fix", "bug", "patch")):
            clean = msg.split(":", 1)[-1].strip() if ":" in msg else msg
            fixes.append(f"- {clean}")
        elif "breaking" in ml or ml.startswith("!"):
            breaking.append(f"- {msg}")
        else:
            internal.append(f"- {msg}")
    
    lines = [f"## [{version}] - {date}", "", f"Release for {repo}.", ""]
    
    if features:
        lines += ["### 🚀 New Features", *features, ""]
    if fixes:
        lines += ["### 🐛 Bug Fixes", *fixes, ""]
    if breaking:
        lines += ["### ⚠️ Breaking Changes", *breaking, ""]
    if internal:
        lines += ["### 🔧 Internal", *internal, ""]
    
    contributors = list({c["author"] for c in commits if c.get("author")})
    if len(contributors) > 1:
        lines += [f"### 👥 Contributors", f"Thank you to {', '.join(contributors)} for this release.", ""]
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="ChangelogAI - Generate AI-powered changelogs from GitHub repos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  changelog-ai vercel/next.js --from v14.0.0 --to v14.1.0
  changelog-ai facebook/react --to v18.3.0
  changelog-ai my-org/my-repo --output CHANGELOG.md
  
Environment variables:
  ANTHROPIC_API_KEY   Use Claude for AI generation
  GITHUB_TOKEN        For private repos / higher rate limits
        """,
    )
    
    parser.add_argument("repo", help="GitHub repository (owner/repo)")
    parser.add_argument("--from", dest="from_tag", default="", help="Start tag/commit")
    parser.add_argument("--to", dest="to_tag", default="", help="End tag/commit")
    parser.add_argument("--token", help="GitHub personal access token")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--version", action="version", version=f"changelog-ai {VERSION}")
    
    args = parser.parse_args()
    
    if "/" not in args.repo:
        print(f"Error: Invalid repo format. Use owner/repo (e.g., vercel/next.js)", file=sys.stderr)
        sys.exit(1)
    
    print(f"📋 ChangelogAI v{VERSION}", file=sys.stderr)
    print(f"📦 Fetching commits from {args.repo}...", file=sys.stderr)
    
    try:
        commits = fetch_commits_github(args.repo, args.from_tag, args.to_tag, args.token)
    except RuntimeError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    
    if not commits:
        print("Error: No commits found in the specified range", file=sys.stderr)
        sys.exit(1)
    
    print(f"✅ Found {len(commits)} commits", file=sys.stderr)
    print("🤖 Generating changelog...", file=sys.stderr)
    
    # Try AI generation first
    changelog = generate_with_anthropic(args.repo, commits, args.from_tag, args.to_tag)
    
    if not changelog:
        if not os.environ.get("ANTHROPIC_API_KEY"):
            print("ℹ️  No ANTHROPIC_API_KEY found. Using rule-based generation.", file=sys.stderr)
            print("   Set ANTHROPIC_API_KEY for AI-powered changelogs.", file=sys.stderr)
        changelog = generate_rule_based(args.repo, commits, args.from_tag, args.to_tag)
    
    if args.format == "json":
        output = json.dumps({
            "repo": args.repo,
            "from": args.from_tag,
            "to": args.to_tag,
            "generated_at": datetime.now().isoformat(),
            "changelog": changelog,
            "stats": {
                "commits": len(commits),
                "contributors": len({c["author"] for c in commits}),
            }
        }, indent=2)
    else:
        output = changelog
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"✅ Saved to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
