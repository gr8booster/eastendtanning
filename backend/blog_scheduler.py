import asyncio
from datetime import datetime, timezone, timedelta
import uuid
from typing import List, Dict, Any

from ai_engine import ai_engine

DEFAULT_REASONS = [
    "wedding",
    "vacation",
    "birthday",
    "prom",
    "homecoming",
    "valentines day",
    "holiday parties",
    "getting ready for summer",
    "base tan",
    "self care",
    "seasonal affective disorder",
    "trip",
]

async def ensure_default_config(db):
    cfg = await db.blog_config.find_one({"id": "people_of_eastend"})
    if not cfg:
        cfg = {
            "id": "people_of_eastend",
            "enabled": True,  # enabled by default per user request
            "cadence_days": 2,  # every other day
            "reasons": DEFAULT_REASONS,
            "last_post_at": None,
            "next_reason_index": 0
        }
        await db.blog_config.insert_one(cfg)
    return cfg

async def pick_next_reason(cfg: Dict[str, Any]):
    reasons: List[str] = cfg.get("reasons") or DEFAULT_REASONS
    idx = int(cfg.get("next_reason_index", 0)) % len(reasons)
    return reasons[idx], idx

async def scheduler_loop(db):
    await ensure_default_config(db)
    while True:
        try:
            cfg = await db.blog_config.find_one({"id": "people_of_eastend"})
            if cfg and cfg.get("enabled"):
                last = cfg.get("last_post_at")
                now = datetime.now(timezone.utc)
                due = False
                if not last:
                    due = True
                else:
                    if isinstance(last, str):
                        try:
                            last = datetime.fromisoformat(last)
                        except Exception:
                            last = now - timedelta(days=10)
                    if last.tzinfo is None:
                        last = last.replace(tzinfo=timezone.utc)
                    due = (now - last) >= timedelta(days=int(cfg.get("cadence_days", 2)))
                if due:
                    reason, idx = await pick_next_reason(cfg)
                    topic = f"{reason.title()}: Stories from Mount Vernon"
                    try:
                        post = await ai_engine.generate_blog_post(topic, service="tanning")
                        if isinstance(post, dict):
                            title = post.get("title") or topic
                            meta_description = post.get("meta_description") or ""
                            content = post.get("content") or ""
                            if isinstance(content, str) and content.strip().startswith("```)":
                                raw = content.strip()
                                if raw.startswith("```json"):
                                    raw = raw[7:].strip()
                                if raw.startswith("```"):
                                    raw = raw[3:].strip()
                                if raw.endswith("```"):
                                    raw = raw[:-3].strip()
                                content = raw
                            keywords = post.get("keywords") or []
                            cta = post.get("cta") or ""
                        else:
                            title = topic
                            meta_description = ""
                            content = str(post)
                            keywords = []
                            cta = ""
                        await db.blog_posts.insert_one({
                            "id": str(uuid.uuid4()),
                            "created_at": now.isoformat(),
                            "topic": topic,
                            "service": "tanning",
                            "title": title,
                            "meta_description": meta_description,
                            "content": content,
                            "keywords": keywords,
                            "cta": cta,
                            "status": "published",
                            "ai_model": "gpt-4"
                        })
                        await db.blog_config.update_one(
                            {"id": "people_of_eastend"},
                            {"$set": {"last_post_at": now.isoformat(), "next_reason_index": (idx + 1)}},
                            upsert=True
                        )
                    except Exception as e:
                        print(f"blog scheduler error: {e}")
            await asyncio.sleep(3600)  # check hourly
        except Exception as e:
            print(f"blog scheduler loop error: {e}")
            await asyncio.sleep(3600)
