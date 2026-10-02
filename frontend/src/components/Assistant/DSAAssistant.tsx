import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import mascotImg from '../../assets/assistant-lemming.png';
import { TOPIC_DATA, GENERAL_DSA_FAQS, type TopicAssistantInfo } from './assistantData';
import { assistantAPI } from '../../services/api';
import './DSAAssistant.css';

type AssistantTab = 'chat' | 'cheatsheet' | 'challenge' | 'eli5';
type MascotEmotion = 'idle' | 'excited' | 'thinking' | 'talking';
type MascotAction = 'none' | 'backflip' | 'rocket' | 'sleep' | 'munch' | 'dizzy';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: 'rtx4050' | 'builtin';
}

interface Position {
  x: number;
  y: number;
}

interface MascotParticle {
  id: string;
  emoji: string;
  tx: string;
  ty: string;
  rot: string;
}

export default function DSAAssistant() {
  const location = useLocation();

  // Route matching to topic
  const currentTopicKey = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('array')) return 'array';
    if (path.includes('linkedlist')) return 'linkedlist';
    if (path.includes('circular-queue')) return 'circular-queue';
    if (path.includes('stack')) return 'stack';
    if (path.includes('queue')) return 'queue';
    if (path.includes('searching')) return 'searching';
    if (path.includes('sorting')) return 'sorting';
    if (path.includes('practice')) return 'practice';
    if (path.includes('progress')) return 'progress';
    if (path.includes('basics')) return 'basics';
    return 'home';
  }, [location.pathname]);

  const activeTopicInfo: TopicAssistantInfo = TOPIC_DATA[currentTopicKey] || TOPIC_DATA.home;

  // Assistant states
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('chat');
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [bubbleMessage, setBubbleMessage] = useState(activeTopicInfo.greeting);
  const [emotion, setEmotion] = useState<MascotEmotion>('idle');
  const [currentAction, setCurrentAction] = useState<MascotAction>('none');
  const [showActionBar, setShowActionBar] = useState(false);
  const [particles, setParticles] = useState<MascotParticle[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [aiStatus, setAiStatus] = useState<{
    online: boolean;
    model: string;
    checking: boolean;
  }>({ online: false, model: 'llama3.2:3b', checking: true });

  // Draggable Mascot Position
  const [mascotPos, setMascotPos] = useState<Position | null>(null);
  const [isDraggingMascot, setIsDraggingMascot] = useState(false);
  const mascotDragRef = useRef<{
    pointerX: number;
    pointerY: number;
    mascotX: number;
    mascotY: number;
    isDragging: boolean;
  } | null>(null);

  // Double click detection
  const lastClickTimeRef = useRef(0);

  // Draggable Window Position
  const [windowPos, setWindowPos] = useState<Position | null>(null);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const windowDragRef = useRef<{
    pointerX: number;
    pointerY: number;
    windowX: number;
    windowY: number;
    isDragging: boolean;
  } | null>(null);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: activeTopicInfo.greeting,
    },
  ]);
  const [userInput, setUserInput] = useState('');

  // Challenge quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // ID counters and references
  const idCounter = useRef(1);
  const jokeIndexRef = useRef(0);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Default coordinates getter
  const getDefaultMascotPos = useCallback((): Position => {
    if (typeof window === 'undefined') return { x: 500, y: 500 };
    return {
      x: Math.max(16, window.innerWidth - 115),
      y: Math.max(16, window.innerHeight - 135),
    };
  }, []);

  const getDefaultWindowPos = useCallback((mPos: Position): Position => {
    if (typeof window === 'undefined') return { x: 200, y: 100 };
    const winWidth = Math.min(410, window.innerWidth - 32);
    const isRightHalf = mPos.x > window.innerWidth / 2;
    const targetX = isRightHalf
      ? Math.max(16, mPos.x - winWidth - 16)
      : Math.min(window.innerWidth - winWidth - 16, mPos.x + 95);
    const targetY = Math.min(
      Math.max(16, mPos.y - 480),
      Math.max(16, window.innerHeight - 590)
    );
    return { x: targetX, y: targetY };
  }, []);

  // Web Audio Synthesizer for rich cute cartoon sound effects
  const playChime = useCallback((type: 'pop' | 'success' | 'boing' | 'click' | 'rocket' | 'munch' | 'dizzy' | 'sleep') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'boing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'rocket') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.6);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'munch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.setValueAtTime(250, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'dizzy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(350, now + 0.1);
        osc.frequency.linearRampToValueAtTime(550, now + 0.2);
        osc.frequency.linearRampToValueAtTime(300, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'sleep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.4);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // AudioContext policy fallback
    }
  }, [soundEnabled]);

  // Speech synthesis
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.35;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Trigger emotion with timeout back to idle
  const triggerEmotion = (newEmotion: MascotEmotion, durationMs = 2000) => {
    setEmotion(newEmotion);
    setTimeout(() => {
      setEmotion('idle');
    }, durationMs);
  };

  // Trigger Particle Eruption
  const emitParticles = (emojis: string[]) => {
    const newParticles: MascotParticle[] = emojis.map((emoji, index) => {
      const angle = (index / emojis.length) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 45;
      const tx = `${Math.cos(angle) * distance}px`;
      const ty = `${Math.sin(angle) * distance - 25}px`;
      const rot = `${(Math.random() - 0.5) * 90}deg`;
      return {
        id: `p-${Date.now()}-${index}`,
        emoji,
        tx,
        ty,
        rot,
      };
    });

    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1400);
  };

  // Perform Special Action Moves
  const performAction = useCallback((action: MascotAction) => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
    }
    setCurrentAction(action);

    if (action === 'backflip') {
      playChime('boing');
      triggerEmotion('excited', 1200);
      emitParticles(['🤸', '💫', '⭐', '✨', '🔥']);
      const msg = "Whoosh! 360 backflip! My Big-O complexity just inverted in mid-air!";
      setBubbleMessage(msg);
      setShowSpeechBubble(true);
      if (voiceEnabled) speakText(msg);
      actionTimeoutRef.current = setTimeout(() => setCurrentAction('none'), 950);
    } else if (action === 'rocket') {
      playChime('rocket');
      triggerEmotion('excited', 1800);
      emitParticles(['🚀', '🔥', '✨', '💨', '⚡']);
      const msg = "Blast off! Launching straight into O(1) orbital velocity!";
      setBubbleMessage(msg);
      setShowSpeechBubble(true);
      if (voiceEnabled) speakText(msg);
      actionTimeoutRef.current = setTimeout(() => setCurrentAction('none'), 1700);
    } else if (action === 'sleep') {
      playChime('sleep');
      triggerEmotion('idle', 3000);
      emitParticles(['💤', '🌙', '⭐', '☁️', '💤']);
      const msg = "Zzz... dreaming of perfectly balanced AVL trees... Click me to wake up!";
      setBubbleMessage(msg);
      setShowSpeechBubble(true);
      if (voiceEnabled) speakText("Zzz... sleeping... click to wake up...");
      // Stays sleeping until user clicks or triggers another action
    } else if (action === 'munch') {
      playChime('munch');
      triggerEmotion('excited', 1400);
      emitParticles(['🌰', '✨', '😋', '🌟', '🥜']);
      const msg = "Crunch crunch! Devouring delicious golden algorithm acorns!";
      setBubbleMessage(msg);
      setShowSpeechBubble(true);
      if (voiceEnabled) speakText(msg);
      actionTimeoutRef.current = setTimeout(() => setCurrentAction('none'), 1400);
    } else if (action === 'dizzy') {
      playChime('dizzy');
      triggerEmotion('thinking', 1600);
      emitParticles(['🤯', '⚡', '💥', '💨', '😵']);
      const msg = "Stack Overflow! Infinite recursion loop! My little brain is dizzy!";
      setBubbleMessage(msg);
      setShowSpeechBubble(true);
      if (voiceEnabled) speakText(msg);
      actionTimeoutRef.current = setTimeout(() => setCurrentAction('none'), 1600);
    }
  }, [playChime, voiceEnabled, speakText]);

  // Handle Mascot Pointer Drag
  const handleMascotPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const curPos = mascotPos || getDefaultMascotPos();
    mascotDragRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      mascotX: curPos.x,
      mascotY: curPos.y,
      isDragging: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleMascotPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!mascotDragRef.current) return;
    const dx = e.clientX - mascotDragRef.current.pointerX;
    const dy = e.clientY - mascotDragRef.current.pointerY;

    if (!mascotDragRef.current.isDragging && Math.hypot(dx, dy) > 4) {
      mascotDragRef.current.isDragging = true;
      setIsDraggingMascot(true);
    }

    if (mascotDragRef.current.isDragging) {
      const maxX = Math.max(10, window.innerWidth - 95);
      const maxY = Math.max(10, window.innerHeight - 115);
      const newX = Math.min(Math.max(10, mascotDragRef.current.mascotX + dx), maxX);
      const newY = Math.min(Math.max(10, mascotDragRef.current.mascotY + dy), maxY);
      setMascotPos({ x: newX, y: newY });
    }
  };

  const handleMascotPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!mascotDragRef.current) return;
    const wasDragging = mascotDragRef.current.isDragging;
    mascotDragRef.current = null;
    setIsDraggingMascot(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!wasDragging) {
      // Check for double-click surprise trick
      const now = Date.now();
      if (now - lastClickTimeRef.current < 320) {
        // Double click: perform random surprise action!
        const actions: MascotAction[] = ['backflip', 'rocket', 'munch', 'dizzy'];
        const surprise = actions[Math.floor(Math.random() * actions.length)];
        performAction(surprise);
        lastClickTimeRef.current = 0;
        return;
      }
      lastClickTimeRef.current = now;

      // Wake up if sleeping
      if (currentAction === 'sleep') {
        setCurrentAction('none');
        playChime('boing');
        setBubbleMessage("Yawn! I'm awake and ready for more DSA!");
        setShowSpeechBubble(true);
        return;
      }

      // Normal click: toggle open/close
      const nextOpen = !isOpen;
      setIsOpen(nextOpen);
      playChime('boing');
      triggerEmotion('excited', 1200);

      // If opening and no windowPos yet, compute smart placement
      if (nextOpen && !windowPos) {
        const curMascot = mascotPos || getDefaultMascotPos();
        setWindowPos(getDefaultWindowPos(curMascot));
      }
    }
  };

  // Handle Window Header Drag
  const handleWindowHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;

    const curPos = windowPos || getDefaultWindowPos(mascotPos || getDefaultMascotPos());
    windowDragRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      windowX: curPos.x,
      windowY: curPos.y,
      isDragging: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWindowHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!windowDragRef.current) return;
    const dx = e.clientX - windowDragRef.current.pointerX;
    const dy = e.clientY - windowDragRef.current.pointerY;

    if (!windowDragRef.current.isDragging && Math.hypot(dx, dy) > 4) {
      windowDragRef.current.isDragging = true;
      setIsDraggingWindow(true);
    }

    if (windowDragRef.current.isDragging) {
      const maxX = Math.max(10, window.innerWidth - 380);
      const maxY = Math.max(10, window.innerHeight - 200);
      const newX = Math.min(Math.max(10, windowDragRef.current.windowX + dx), maxX);
      const newY = Math.min(Math.max(10, windowDragRef.current.windowY + dy), maxY);
      setWindowPos({ x: newX, y: newY });
    }
  };

  const handleWindowHeaderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!windowDragRef.current) return;
    windowDragRef.current = null;
    setIsDraggingWindow(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Reset Position back to default bottom-right
  const handleResetPosition = () => {
    playChime('click');
    setMascotPos(null);
    setWindowPos(null);
    triggerEmotion('excited', 1200);
  };

  // When route changes, update topic greeting and quiz
  useEffect(() => {
    const greeting = activeTopicInfo.greeting;
    const topicTitle = activeTopicInfo.topicName;
    setBubbleMessage(greeting);
    setShowSpeechBubble(true);
    setSelectedAnswer(null);
    setHasAnswered(false);

    idCounter.current += 1;
    const newId = `topic-${idCounter.current}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: newId,
        sender: 'assistant',
        text: `📍 Entered ${topicTitle}! ${greeting}`,
      },
    ]);

    if (voiceEnabled) {
      speakText(greeting);
    }

    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 9000);

    return () => clearTimeout(timer);
  }, [currentTopicKey, activeTopicInfo, voiceEnabled, speakText]);

  // Periodic check for local AI on RTX 4050
  useEffect(() => {
    let mounted = true;
    const checkAI = async () => {
      try {
        const res = await assistantAPI.getStatus();
        if (mounted && res.success && res.available && res.hasConfiguredModel) {
          setAiStatus({ online: true, model: res.configuredModel, checking: false });
        } else if (mounted) {
          setAiStatus({ online: false, model: res.configuredModel || 'llama3.2:3b', checking: false });
        }
      } catch {
        if (mounted) {
          setAiStatus({ online: false, model: 'llama3.2:3b', checking: false });
        }
      }
    };
    checkAI();
    const interval = setInterval(checkAI, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle Question Answering (powered by RTX 4050 / Ollama with graceful fallback)
  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;

    playChime('click');
    idCounter.current += 1;
    const userMsg: ChatMessage = {
      id: `user-${idCounter.current}`,
      sender: 'user',
      text: question,
    };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setUserInput('');
    triggerEmotion('thinking', 2500);

    let answer = '';
    let isFromAI = false;

    // 1. Try querying local Ollama on RTX 4050 via backend
    try {
      const res = await assistantAPI.chat({
        message: question,
        topic: activeTopicInfo.topicName,
        history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
      });
      if (res.success && res.answer) {
        answer = res.answer;
        isFromAI = true;
      }
    } catch {
      // Graceful fallback to built-in knowledge engine
    }

    // 2. Fallback if AI is offline or model still loading
    if (!answer) {
      const qLower = question.toLowerCase();

      const topicMatch = activeTopicInfo.suggestedQuestions.find(
        (sq) => sq.q.toLowerCase().includes(qLower) || qLower.includes(sq.q.toLowerCase().slice(0, 15))
      );

      if (topicMatch) {
        answer = topicMatch.a;
      } else {
        const faqMatch = GENERAL_DSA_FAQS.find((faq) =>
          faq.keywords.some((k) => qLower.includes(k))
        );

        if (faqMatch) {
          answer = faqMatch.answer;
        } else if (qLower.includes('complexity') || qLower.includes('big o')) {
          answer = `For ${activeTopicInfo.topicName}: ${activeTopicInfo.cheatSheet.keyRule}. Space is ${activeTopicInfo.cheatSheet.spaceComplexity}.`;
        } else if (qLower.includes('hint') || qLower.includes('help')) {
          answer = activeTopicInfo.eli5;
        } else {
          answer = `Great question about ${activeTopicInfo.topicName}! Here's Lemmy's key takeaway: ${activeTopicInfo.eli5} Remember: ${activeTopicInfo.interviewGotcha}`;
        }
      }
    }

    idCounter.current += 1;
    const answerMsgId = `assistant-${idCounter.current}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: answerMsgId,
        sender: 'assistant',
        text: answer,
        source: isFromAI ? 'rtx4050' : 'builtin',
      },
    ]);
    playChime('boing');
    triggerEmotion('excited', 1500);

    if (voiceEnabled) {
      speakText(answer);
    }
  };

  // Handle Challenge Answer Submission
  const handleAnswerChallenge = (index: number) => {
    setSelectedAnswer(index);
    setHasAnswered(true);

    if (index === activeTopicInfo.challenge.correctIndex) {
      playChime('success');
      triggerEmotion('excited', 2500);
      emitParticles(['🎉', '⭐', '✨', '🏆', '🎊']);
      if (voiceEnabled) {
        speakText('Boom! Spot on! You nailed it!');
      }
    } else {
      playChime('boing');
      triggerEmotion('thinking', 2000);
      if (voiceEnabled) {
        speakText('Oops! Not quite, check the explanation and try again!');
      }
    }
  };

  // Quick Fun Actions
  const handleDance = () => {
    performAction('backflip');
  };

  const handleJoke = () => {
    playChime('boing');
    const jokes = [
      "Why did the binary tree cross the road? To balance itself on the other side!",
      "An algorithm is what programmers use when they don't want to explain what they did!",
      "A SQL query walks into a bar, strolls up to two tables and asks: 'Can I join you?'",
      "Why do programmers prefer dark mode? Because light attracts bugs!"
    ];
    const joke = jokes[jokeIndexRef.current % jokes.length];
    jokeIndexRef.current += 1;
    handleAskQuestion(joke);
  };

  const handleCheer = () => {
    playChime('success');
    triggerEmotion('excited', 2500);
    emitParticles(['🎉', '🎊', '⭐', '✨', '🔥']);
    const cheers = [
      "You are a DSA wizard in the making! Keep coding!",
      "O(1) mindset, O(log n) efficiency! You got this!",
      "Big-O fears nobody who practices consistently!",
    ];
    const msg = cheers[Math.floor(Math.random() * cheers.length)];
    setBubbleMessage(msg);
    setShowSpeechBubble(true);
    if (voiceEnabled) speakText(msg);
  };

  // Determine speech bubble placement based on mascot position
  const currentMascotCoords = mascotPos || (typeof window !== 'undefined' ? getDefaultMascotPos() : { x: 500, y: 500 });
  const isNearRight = typeof window !== 'undefined' ? currentMascotCoords.x > window.innerWidth - 220 : true;

  return (
    <>
      {/* Draggable Mascot Root */}
      <div
        className={`dsa-assistant-root state-${emotion} action-${currentAction} ${isDraggingMascot ? 'is-dragging' : ''}`}
        style={
          mascotPos
            ? {
                left: `${mascotPos.x}px`,
                top: `${mascotPos.y}px`,
                right: 'auto',
                bottom: 'auto',
              }
            : undefined
        }
      >
        {/* Floating Particles Layer */}
        {particles.length > 0 && (
          <div className="mascot-particles-layer">
            {particles.map((p) => (
              <span
                key={p.id}
                className="mascot-particle"
                style={
                  {
                    '--p-tx': p.tx,
                    '--p-ty': p.ty,
                    '--p-rot': p.rot,
                  } as React.CSSProperties
                }
              >
                {p.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Quick Action Toolbar directly attached to Lemmy */}
        {showActionBar && !isOpen && (
          <div className="mascot-action-bar">
            <button
              className="action-trigger-btn"
              onClick={() => performAction('backflip')}
              title="Acrobatic Backflip 🤸"
            >
              🤸
            </button>
            <button
              className="action-trigger-btn"
              onClick={() => performAction('rocket')}
              title="Rocket Boost 🚀"
            >
              🚀
            </button>
            <button
              className="action-trigger-btn"
              onClick={() => performAction('munch')}
              title="Snack on Acorns 🌰"
            >
              🌰
            </button>
            <button
              className="action-trigger-btn"
              onClick={() => performAction('dizzy')}
              title="Mind Blown 🤯"
            >
              🤯
            </button>
            <button
              className="action-trigger-btn"
              onClick={() => performAction('sleep')}
              title="Take a Nap 💤"
            >
              💤
            </button>
            <button
              className="action-trigger-btn"
              onClick={handleCheer}
              title="Cheer Me On! 🎉"
            >
              🎉
            </button>
          </div>
        )}

        {/* Speech Bubble */}
        {showSpeechBubble && !isOpen && (
          <div
            className="assistant-speech-bubble"
            style={
              isNearRight
                ? { position: 'absolute', right: '100%', marginRight: '12px', bottom: '10px' }
                : { position: 'absolute', left: '100%', marginLeft: '12px', bottom: '10px' }
            }
            onClick={() => {
              setIsOpen(true);
              setShowSpeechBubble(false);
              playChime('click');
              if (!windowPos) {
                setWindowPos(getDefaultWindowPos(currentMascotCoords));
              }
            }}
            title="Click to talk with Lemmy"
          >
            <button
              className="bubble-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
              }}
            >
              ×
            </button>
            <span className="bubble-topic-tag">{activeTopicInfo.topicName}</span>
            <p>{bubbleMessage}</p>
          </div>
        )}

        {/* Mascot Avatar Button */}
        <div className="assistant-mascot-wrapper">
          <button
            className="mascot-avatar-btn"
            onPointerDown={handleMascotPointerDown}
            onPointerMove={handleMascotPointerMove}
            onPointerUp={handleMascotPointerUp}
            onPointerCancel={handleMascotPointerUp}
            aria-label="Drag Lemmy or double-click for action tricks!"
            title="Click to open, drag anywhere, or double-click for action tricks!"
          >
            <span className="mascot-drag-hint">🖐️ Drag me!</span>
            <div className="mascot-img-wrapper">
              <img
                src={mascotImg}
                alt="Visual DSA Assistant Lemmy"
                className="mascot-img"
                draggable={false}
              />
            </div>
            <div className="mascot-nametag">
              <span className="mascot-badge-dot" />
              Lemmy
            </div>
          </button>

          {/* Action Menu Toggle Button */}
          {!isOpen && (
            <button
              className="action-menu-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowActionBar(!showActionBar);
                playChime('click');
              }}
              title="Toggle Lemmy's Special Moves"
            >
              ⚡ Moves
            </button>
          )}
        </div>
      </div>

      {/* Expandable Draggable Assistant Dialog Window */}
      {isOpen && (
        <div
          className={`assistant-window ${isDraggingWindow ? 'is-dragging-window' : ''}`}
          role="dialog"
          aria-labelledby="assistant-title"
          style={
            windowPos
              ? {
                  left: `${windowPos.x}px`,
                  top: `${windowPos.y}px`,
                  right: 'auto',
                  bottom: 'auto',
                }
              : undefined
          }
        >
          {/* Draggable Header */}
          <div
            className="assistant-header"
            onPointerDown={handleWindowHeaderPointerDown}
            onPointerMove={handleWindowHeaderPointerMove}
            onPointerUp={handleWindowHeaderPointerUp}
            onPointerCancel={handleWindowHeaderPointerUp}
            title="Drag window by header"
          >
            <div className="header-mascot-info">
              <img src={mascotImg} alt="Lemmy" className="header-avatar-thumb" draggable={false} />
              <div className="header-title-wrap">
                <h3 id="assistant-title">Lemmy • DSA Assistant</h3>
                <p>
                  <span>{activeTopicInfo.topicName}</span>
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', opacity: 0.85 }}>
                    {aiStatus.checking ? '• Checking AI...' : aiStatus.online ? '• ⚡ RTX AI Online' : '• 🧠 Built-in Engine'}
                  </span>
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className={`header-action-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  playChime('click');
                  if (!voiceEnabled) speakText("Voice assistance enabled!");
                }}
                title={voiceEnabled ? 'Mute Voice' : 'Enable Voice Readout'}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              <button
                className={`header-action-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title="Toggle Sound Effects"
              >
                🎵
              </button>
              <button
                className="header-action-btn"
                onClick={handleResetPosition}
                title="Reset Lemmy position to corner"
              >
                ↺
              </button>
              <button
                className="header-action-btn"
                onClick={() => {
                  setIsOpen(false);
                  playChime('click');
                }}
                title="Minimize Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="assistant-tabs">
            <button
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('chat');
                playChime('click');
              }}
            >
              Ask
            </button>
            <button
              className={`tab-btn ${activeTab === 'cheatsheet' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('cheatsheet');
                playChime('click');
              }}
            >
              Cheat Sheet
            </button>
            <button
              className={`tab-btn ${activeTab === 'challenge' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('challenge');
                playChime('click');
              }}
            >
              Quiz
            </button>
            <button
              className={`tab-btn ${activeTab === 'eli5' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('eli5');
                playChime('click');
              }}
            >
              Intuition
            </button>
          </div>

          {/* Body Content */}
          <div className="assistant-body">
            {/* TAB 1: CHAT */}
            {activeTab === 'chat' && (
              <>
                <div className="chat-conversation">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-msg ${msg.sender === 'user' ? 'msg-user' : 'msg-assistant'}`}
                    >
                      {msg.text}
                      {msg.source === 'rtx4050' && (
                        <span className="msg-source-tag">⚡ Powered by RTX 4050 (Ollama)</span>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="suggested-prompts-label">Quick Questions for {activeTopicInfo.topicName}</div>
                <div className="suggested-prompts-list">
                  {activeTopicInfo.suggestedQuestions.map((sq, i) => (
                    <button
                      key={i}
                      className="prompt-chip"
                      onClick={() => handleAskQuestion(sq.q)}
                    >
                      {sq.q}
                    </button>
                  ))}
                </div>

                <form
                  className="chat-input-bar"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskQuestion(userInput);
                  }}
                >
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Lemmy anything about DSA..."
                  />
                  <button type="submit" className="chat-send-btn">
                    Ask
                  </button>
                </form>
              </>
            )}

            {/* TAB 2: CHEAT SHEET */}
            {activeTab === 'cheatsheet' && (
              <div className="cheatsheet-card">
                <div className="cheatsheet-title">
                  <span>📊</span> {activeTopicInfo.cheatSheet.title}
                </div>

                <div className="complexity-grid">
                  {Object.entries(activeTopicInfo.cheatSheet.timeComplexity).map(([key, val]) => (
                    <div key={key} className="complexity-box">
                      <div className="complexity-label">{key}</div>
                      <div className="complexity-val">{val}</div>
                    </div>
                  ))}
                  <div className="complexity-box" style={{ gridColumn: 'span 2' }}>
                    <div className="complexity-label">Space Complexity</div>
                    <div className="complexity-val">{activeTopicInfo.cheatSheet.spaceComplexity}</div>
                  </div>
                </div>

                <div className="key-rule-box">
                  <strong>💡 Key Golden Rule:</strong> {activeTopicInfo.cheatSheet.keyRule}
                </div>

                <div className="pros-cons-wrap">
                  <div>
                    <strong>Pros:</strong>
                    <ul className="pros-list">
                      {activeTopicInfo.cheatSheet.pros.map((p, idx) => (
                        <li key={idx}>+ {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Cons & Trade-offs:</strong>
                    <ul className="cons-list">
                      {activeTopicInfo.cheatSheet.cons.map((c, idx) => (
                        <li key={idx}>- {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CHALLENGE / MICRO QUIZ */}
            {activeTab === 'challenge' && (
              <div className="challenge-box">
                <div className="challenge-question">
                  {activeTopicInfo.challenge.question}
                </div>
                <div className="challenge-options">
                  {activeTopicInfo.challenge.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeTopicInfo.challenge.correctIndex;
                    let btnClass = 'option-btn';
                    if (hasAnswered) {
                      if (isCorrect) btnClass += ' correct';
                      else if (isSelected) btnClass += ' wrong';
                    }

                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => handleAnswerChallenge(idx)}
                        disabled={hasAnswered}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={`challenge-feedback ${
                      selectedAnswer === activeTopicInfo.challenge.correctIndex
                        ? 'success'
                        : 'retry'
                    }`}
                  >
                    <strong>
                      {selectedAnswer === activeTopicInfo.challenge.correctIndex
                        ? '🎉 Awesome Job!'
                        : '😅 Nice try!'}
                    </strong>{' '}
                    {activeTopicInfo.challenge.explanation}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ELI5 & INTUITION */}
            {activeTab === 'eli5' && (
              <div className="eli5-card">
                <div className="eli5-headline">Explain Like I'm 5</div>
                <div className="eli5-text">{activeTopicInfo.eli5}</div>

                <div className="fun-fact-box">
                  <strong>🦫 Lemmy's Fun Fact:</strong> {activeTopicInfo.funFact}
                </div>

                <div className="interview-trap-box">
                  <strong>⚠️ Interview Gotcha:</strong> {activeTopicInfo.interviewGotcha}
                </div>
              </div>
            )}
          </div>

          {/* Footer Quick Action Bar with Special Moves */}
          <div className="assistant-quick-actions">
            <button className="quick-action-pill" onClick={handleDance} title="Acrobatic Backflip">
              🤸 Flip
            </button>
            <button className="quick-action-pill" onClick={() => performAction('rocket')} title="Rocket Jump">
              🚀 Rocket
            </button>
            <button className="quick-action-pill" onClick={() => performAction('munch')} title="Munch Acorns">
              🌰 Munch
            </button>
            <button className="quick-action-pill" onClick={() => performAction('dizzy')} title="Mind Blown">
              🤯 Dizzy
            </button>
            <button className="quick-action-pill" onClick={handleJoke} title="Tell a DSA Joke">
              🃏 Joke
            </button>
            <button className="quick-action-pill" onClick={handleCheer} title="Cheer me on">
              🎉 Cheer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
