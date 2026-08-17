import re
import json
from pathlib import Path

import yaml
import markdown
from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).parent
env = Environment(loader=FileSystemLoader(ROOT / "templates"))

languages = ["en", "jp"]
pages = ["index", "about", "project", "404"]

serve_dir = "public"

# matches front-matter block --- ... ---
FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", re.DOTALL)


def split_markdown_file(path: Path):
    """Split a .md file into (front_matter_dict, remaining_markdown_text)."""
    text = path.read_text(encoding="utf-8")
    match = FRONT_MATTER_RE.match(text)
    if not match:
        return {}, text  # no front matter
    front_matter_yaml, body_md = match.groups()
    metadata = yaml.safe_load(front_matter_yaml) or {}
    return metadata, body_md


for lang in languages:
    common = json.loads(
        (ROOT / "content" / f"common/{lang}.json").read_text(encoding="utf-8")
    )
    out_dir = ROOT / serve_dir / lang
    out_dir.mkdir(parents=True, exist_ok=True)

    for page in pages:
        md_path = ROOT / "content" / lang / f"{page}.md"
        metadata, body_md = split_markdown_file(md_path)
        body_html = markdown.markdown(body_md.strip(), extensions=["extra"])

        # page front matter overrides common
        t = {**common, **metadata}

        template = env.get_template(f"{metadata["template"]}.html")
        html = template.render(
            lang=lang, t=t, body=body_html, languages=languages, page=page
        )
        (out_dir / f"{page}.html").write_text(html, encoding="utf-8")

    print(f"Built {lang}: {', '.join(pages)}")

print(f"\nDone. Output in {ROOT / serve_dir}")
