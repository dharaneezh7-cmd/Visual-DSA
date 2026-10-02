import { useState, useEffect, useCallback } from 'react';
import { progressAPI, activityAPI } from '../services/api';
import { useAuth } from './useAuth';
import type { LearningProgress, Activity } from '../types';

const LOCAL_PROGRESS_KEY = 'visual_dsa_local_progress';
const LOCAL_ACTIVITIES_KEY = 'visual_dsa_local_activities';

function getLocalProgress(): LearningProgress[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalProgress(list: LearningProgress[]) {
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(list));
  } catch {}
}

function getLocalActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalActivities(list: Activity[]) {
  try {
    localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify(list));
  } catch {}
}

export function useProgress() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<LearningProgress[]>(() => getLocalProgress());
  const [activities, setActivities] = useState<Activity[]>(() => getLocalActivities());
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) {
      setProgress(getLocalProgress());
      setActivities(getLocalActivities());
      return;
    }
    setLoading(true);
    try {
      const [progRes, actRes] = await Promise.allSettled([
        progressAPI.getAll(),
        activityAPI.getAll(),
      ]);

      if (progRes.status === 'fulfilled' && progRes.value.success) {
        setProgress(progRes.value.progress);
        setLocalProgress(progRes.value.progress);
      }
      if (actRes.status === 'fulfilled' && actRes.value.success) {
        setActivities(actRes.value.activities);
        setLocalActivities(actRes.value.activities);
      }
    } catch {}
    setLoading(false);
  }, [isAuthenticated]);

  const saveProgress = async (topic: string, concept: string, data: Partial<LearningProgress>) => {
    // 1. Optimistic / local update immediately
    const now = new Date().toISOString();
    const updatedLocalItem: LearningProgress = {
      _id: `local_${topic}_${concept}`,
      userId: 'local',
      topic,
      concept,
      completed: data.completed ?? false,
      completionPercentage: data.completionPercentage ?? 0,
      timeSpent: data.timeSpent ?? 0,
      operationsPerformed: data.operationsPerformed ?? 0,
      lastAccessed: now,
      updatedAt: now,
      ...data,
    };

    setProgress(prev => {
      const idx = prev.findIndex(p => p.topic === topic && p.concept === concept);
      let next: LearningProgress[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = {
          ...next[idx],
          ...data,
          timeSpent: (next[idx].timeSpent || 0) + (data.timeSpent || 0),
          operationsPerformed: (next[idx].operationsPerformed || 0) + (data.operationsPerformed || 0),
          updatedAt: now,
          lastAccessed: now,
        };
      } else {
        next = [...prev, updatedLocalItem];
      }
      setLocalProgress(next);
      return next;
    });

    // 2. If authenticated, persist to backend
    if (isAuthenticated) {
      try {
        const res = await progressAPI.save({ topic, concept, ...data });
        if (res.success && res.progress) {
          setProgress(prev => {
            const idx = prev.findIndex(p => p.topic === topic && p.concept === concept);
            const next = idx >= 0 ? [...prev] : [...prev, res.progress];
            if (idx >= 0) next[idx] = res.progress;
            setLocalProgress(next);
            return next;
          });
        }
      } catch {}
    }
  };

  const recordActivity = async (
    topic: string,
    activityType: string,
    operation: string,
    result: string,
    duration = 0
  ) => {
    const now = new Date().toISOString();
    const localActivity: Activity = {
      _id: `local_act_${Date.now()}_${Math.random()}`,
      userId: 'local',
      topic,
      activityType,
      operation,
      result,
      duration,
      timestamp: now,
    };

    setActivities(prev => {
      const next = [localActivity, ...prev].slice(0, 200);
      setLocalActivities(next);
      return next;
    });

    if (isAuthenticated) {
      try {
        const res = await activityAPI.record({ topic, activityType, operation, result, duration });
        if (res.success && res.activity) {
          setActivities(prev => {
            const next = [res.activity, ...prev.filter(a => a._id !== localActivity._id)].slice(0, 200);
            setLocalActivities(next);
            return next;
          });
        }
      } catch {}
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, activities, loading, saveProgress, recordActivity, fetchProgress };
}

