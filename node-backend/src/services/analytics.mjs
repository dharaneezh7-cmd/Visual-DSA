import { Progress } from '../models/Progress.mjs';
import { Practice } from '../models/Practice.mjs';

export const TOPICS = [
  'Basics',
  'Array',
  'LinkedList',
  'Stack',
  'Queue',
  'CircularQueue',
  'Searching',
  'Sorting',
];

export function formatLearningTime(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}h ${rest}m` : `${hours}h`;
}

export function learningLevel(overallProgress) {
  if (overallProgress >= 80) return 'Advanced';
  if (overallProgress >= 50) return 'Intermediate';
  if (overallProgress >= 20) return 'Beginner';
  return 'Getting Started';
}

export async function buildDashboard(userId) {
  const [progressDocs, practiceDocs] = await Promise.all([
    Progress.find({ userId }).lean(),
    Practice.find({ userId }).lean(),
  ]);

  const topicStats = new Map(
    TOPICS.map((topic) => [
      topic,
      {
        topic,
        count: 0,
        sumPct: 0,
        completedCount: 0,
        sumTime: 0,
        attempts: 0,
        correct: 0,
      },
    ])
  );

  for (const doc of progressDocs) {
    const stat = topicStats.get(doc.topic);
    if (stat) {
      stat.count += 1;
      stat.sumPct += doc.completionPercentage || 0;
      if (doc.completed) stat.completedCount += 1;
      stat.sumTime += doc.timeSpent || 0;
    }
  }

  for (const doc of practiceDocs) {
    const stat = topicStats.get(doc.topic);
    if (stat) {
      stat.attempts += 1;
      if (doc.correct) stat.correct += 1;
    }
  }

  let overallProgress = 0;
  let topicsCompleted = 0;
  let totalPractice = 0;
  let totalCorrect = 0;
  let totalSeconds = 0;

  const strongTopics = [];
  const weakTopics = [];
  const recommendedTopics = [];

  for (const stat of topicStats.values()) {
    if (stat.count > 0) {
      const avgPct = stat.sumPct / stat.count;
      overallProgress += avgPct;
      totalSeconds += stat.sumTime;
      if (stat.completedCount > 0) topicsCompleted += 1;
      if (avgPct >= 70) strongTopics.push(stat.topic);
      else if (avgPct < 40) weakTopics.push(stat.topic);
      if (avgPct < 70) recommendedTopics.push(stat.topic);
    } else {
      recommendedTopics.push(stat.topic);
    }
    totalPractice += stat.attempts;
    totalCorrect += stat.correct;
  }

  overallProgress = topicStats.size > 0 ? Math.min(100, Math.round(overallProgress / topicStats.size)) : 0;
  const practiceAccuracy = totalPractice > 0 ? Math.round((totalCorrect / totalPractice) * 100) : 0;

  const perTopicAnalysis = [];
  for (const stat of topicStats.values()) {
    const completion = stat.count > 0 ? Math.round(Math.min(100, stat.sumPct / stat.count)) : 0;
    const practiceAcc = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0;
    perTopicAnalysis.push({
      topic: stat.topic,
      sectionsCompleted: stat.completedCount,
      completion,
      practiceAccuracy: practiceAcc,
      timeSpent: Math.round(stat.sumTime),
    });
  }

  return {
    overallProgress,
    topicsCompleted,
    totalTopics: TOPICS.length,
    practiceAccuracy,
    learningTime: formatLearningTime(totalSeconds),
    strongTopics,
    weakTopics,
    recommendedTopics: recommendedTopics.slice(0, 3),
    learningLevel: learningLevel(overallProgress),
    perTopicAnalysis,
  };
}
