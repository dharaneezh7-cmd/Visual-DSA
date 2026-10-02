from statistics import mean

from pydantic import BaseModel

TOPICS = ["Basics", "Array", "LinkedList", "Stack", "Queue", "CircularQueue", "Searching", "Sorting"]


class ProgressRecord(BaseModel):
    topic: str
    concept: str = ""
    completed: bool = False
    completionPercentage: float = 0
    timeSpent: float = 0
    operationsPerformed: int = 0


class PracticeRecord(BaseModel):
    topic: str
    questionId: str = ""
    answer: str = ""
    correct: bool = False
    attempts: int = 1


def _level(pct: float) -> str:
    if pct >= 80:
        return "Advanced"
    if pct >= 50:
        return "Intermediate"
    if pct >= 20:
        return "Beginner"
    return "Getting Started"


def _format_time(seconds: float) -> str:
    minutes = round(seconds / 60)
    if minutes < 60:
        return f"{minutes} min"
    hours, rest = divmod(minutes, 60)
    return f"{hours}h {rest}m" if rest else f"{hours}h"


def analyze_progress(progress: list[ProgressRecord], practices: list[PracticeRecord]) -> dict:
    buckets = {topic: {"count": 0, "sum": 0.0, "completed": 0, "time": 0.0, "correct": 0, "attempts": 0} for topic in TOPICS}

    for record in progress:
        bucket = buckets.get(record.topic)
        if not bucket:
            continue
        bucket["count"] += 1
        bucket["sum"] += record.completionPercentage
        bucket["completed"] += 1 if record.completed else 0
        bucket["time"] += record.timeSpent

    for record in practices:
        bucket = buckets.get(record.topic)
        if not bucket:
            continue
        bucket["attempts"] += record.attempts
        if record.correct:
            bucket["correct"] += record.attempts

    per_topic = []
    overall = 0.0
    topics_completed = 0
    total_time = 0.0
    strong, weak, recommended = [], [], []

    for topic in TOPICS:
        bucket = buckets[topic]
        if bucket["count"]:
            avg = min(100.0, bucket["sum"] / bucket["count"])
            overall += avg
            total_time += bucket["time"]
            if bucket["completed"]:
                topics_completed += 1
            if avg >= 70:
                strong.append(topic)
            elif avg < 40:
                weak.append(topic)
            if avg < 70:
                recommended.append(topic)
        else:
            recommended.append(topic)

        per_topic.append(
            {
                "topic": topic,
                "sectionsCompleted": bucket["count"],
                "completion": round(min(100.0, bucket["sum"] / bucket["count"]), 1) if bucket["count"] else 0.0,
                "practiceAccuracy": round((bucket["correct"] / bucket["attempts"]) * 100) if bucket["attempts"] else 0,
                "timeSpent": round(bucket["time"]),
            }
        )

    per_topic.sort(key=lambda item: item["completion"], reverse=True)

    active = len(TOPICS)
    overall_pct = min(100.0, round(overall / active)) if active else 0
    practice_total = sum(b["attempts"] for b in buckets.values())
    practice_correct = sum(b["correct"] for b in buckets.values())
    accuracy = round((practice_correct / practice_total) * 100) if practice_total else 0

    return {
        "overallProgress": overall_pct,
        "topicsCompleted": topics_completed,
        "totalTopics": active,
        "practiceAccuracy": accuracy,
        "learningTime": _format_time(total_time),
        "strongTopics": strong,
        "weakTopics": weak,
        "recommendedTopics": recommended[:3],
        "learningLevel": _level(overall_pct),
        "perTopicAnalysis": per_topic,
        "insight": _build_insight(overall_pct, strong, weak),
    }


def _build_insight(overall: float, strong: list[str], weak: list[str]) -> str:
    parts = [f"Overall learning progress is {overall}%."]
    if weak:
        parts.append(f"Focus next on the weaker areas: {', '.join(weak)}.")
    if strong:
        parts.append(f"You are strongest in: {', '.join(strong)}.")
    if overall >= 80:
        parts.append("Keep it up — you are in great shape for interviews!")
    return " ".join(parts)