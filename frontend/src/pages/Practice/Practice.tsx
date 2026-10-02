import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { practiceAPI } from '../../services/api';
import Button from '../../components/Common/Button';
import { StatusMessage } from '../../components/Visualization/VisualizationComponents';
import './Practice.css';

interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questionBank: Question[] = [
  { id: 'basics-1', topic: 'Basics', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'Arrays support random access — you can jump straight to any index in constant time.' },
  { id: 'basics-2', topic: 'Basics', question: 'Which notation represents logarithmic time complexity?', options: ['O(n)', 'O(log n)', 'O(2ⁿ)', 'O(n!)'], correctIndex: 1, explanation: 'O(log n) means the workload roughly halves each step, like binary search.' },
  { id: 'basics-3', topic: 'Basics', question: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Array', 'Stack', 'LinkedList'], correctIndex: 2, explanation: 'A stack is Last In, First Out — the last element pushed is the first popped.' },

  { id: 'array-1', topic: 'Array', question: 'What is the time complexity of inserting an element at the beginning of an array with n elements?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'Every element must shift right by one position to make room.' },
  { id: 'array-2', topic: 'Array', question: 'Array index numbering starts from:', options: ['1', '0', '-1', 'It varies'], correctIndex: 1, explanation: 'Arrays are zero-indexed — the first element is at index 0.' },
  { id: 'array-3', topic: 'Array', question: 'Updating a value at a known index takes:', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correctIndex: 0, explanation: 'Direct random access lets you update any index in constant time.' },

  { id: 'stack-1', topic: 'Stack', question: 'Push and Pop on a stack both take:', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'Both operations only touch the top element — constant time.' },
  { id: 'stack-2', topic: 'Stack', question: 'Attempting to push onto a full stack is called:', options: ['Underflow', 'Overflow', 'Deadlock', 'Leak'], correctIndex: 1, explanation: 'Stack overflow happens when you push past the maximum capacity.' },
  { id: 'stack-3', topic: 'Stack', question: 'Which operation returns the top element WITHOUT removing it?', options: ['Pop', 'Push', 'Peek', 'Dequeue'], correctIndex: 2, explanation: 'Peek/Top inspects the top element, leaving the stack unchanged.' },

  { id: 'queue-1', topic: 'Queue', question: 'A queue follows which principle?', options: ['LIFO', 'FIFO', 'LILO with priority', 'Random access'], correctIndex: 1, explanation: 'First In, First Out — the element inserted first is removed first.' },
  { id: 'queue-2', topic: 'Queue', question: 'Enqueue inserts at the ____ and dequeue removes from the ____.', options: ['front, front', 'rear, rear', 'front, rear', 'rear, front'], correctIndex: 3, explanation: 'New elements join at the rear; the longest-waiting element leaves from the front.' },
  { id: 'queue-3', topic: 'Queue', question: 'In a circular queue, when the rear reaches the last index, the next rear position is:', options: ['index 0', 'index -1', 'capacity - 1', 'rear + 1 (until capacity)'], correctIndex: 0, explanation: 'Wrap-around: (rear + 1) % capacity brings the rear back to index 0.' },

  { id: 'linkedlist-1', topic: 'LinkedList', question: 'Each node in a singly linked list stores:', options: ['data only', 'data and a next pointer', 'two pointers', 'index only'], correctIndex: 1, explanation: 'A node has a value plus a reference to the next node.' },
  { id: 'linkedlist-2', topic: 'LinkedList', question: 'Inserting at the beginning of a linked list takes:', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'Just create a node, point it at the old head, and update head — constant time.' },
  { id: 'linkedlist-3', topic: 'LinkedList', question: 'To find a value in a singly linked list, you must:', options: ['jump to the index', 'compute a hash', 'traverse node by node', 'use binary search'], correctIndex: 2, explanation: 'Lists have no index access — you follow next pointers until you find the value.' },

  { id: 'search-1', topic: 'Searching', question: 'Linear search worst-case time complexity:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2, explanation: 'The target may be the last element, or not present at all.' },
  { id: 'search-2', topic: 'Searching', question: 'Binary search requires the array to be:', options: ['random', 'sorted', 'of even length', 'of unique values'], correctIndex: 1, explanation: 'It relies on halving the search space, which needs sorted order.' },
  { id: 'search-3', topic: 'Searching', question: 'Binary search visits how many elements to find a value in an array of 16 sorted elements in the worst case?', options: ['16', '8', '4', '~4 (log₂16)'], correctIndex: 3, explanation: 'Each comparison halves the search space, so at most log₂16 = 4 comparisons.' },

  { id: 'sort-1', topic: 'Sorting', question: 'Which algorithm has O(n log n) time complexity in ALL cases?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'], correctIndex: 2, explanation: 'Merge sort always divides and merges in O(n log n). Quick sort can degrade to O(n²).' },
  { id: 'sort-2', topic: 'Sorting', question: 'In which pass does bubble sort guarantee one element is in its final place?', options: ['each pass', 'only the last', 'none', 'first pass only'], correctIndex: 0, explanation: 'After every pass, the largest unsorted element bubbles to its final position.' },
  { id: 'sort-3', topic: 'Sorting', question: 'Insertion sort performs best when the input is:', options: ['reverse sorted', 'random', 'nearly sorted', 'duplicate heavy'], correctIndex: 2, explanation: 'Fewer shifts are needed; it degrades to O(n) on an already-sorted array.' },
];

const topics = ['Basics', 'Array', 'Stack', 'Queue', 'LinkedList', 'Searching', 'Sorting'];

export default function Practice() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string>('Basics');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState<{ type: 'info' | 'success' | 'error'; message: string }>({ type: 'info', message: 'Select a topic and answer the questions. Try to get them all right!' });

  const topicQuestions = questionBank.filter(q => q.topic === selectedTopic);
  const currentQuestion = topicQuestions[currentIndex];

  const resetTopic = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setAnswered(0);
    setScore(0);
    setShowSummary(false);
    setMessage({ type: 'info', message: 'Answer the questions and submit to see your score.' });
  };

  const selectTopic = (topic: string) => {
    setSelectedTopic(topic);
    resetTopic();
  };

  const { saveProgress, recordActivity } = useProgress();

  const formatAccuracy = () => (answered > 0 ? Math.round((score / answered) * 100) : 0);

  const submit = async () => {
    if (selectedAnswer === null || submitted) return;
    const correct = selectedAnswer === currentQuestion.correctIndex;
    setSubmitted(true);
    const newScore = score + (correct ? 1 : 0);
    const newAnswered = answered + 1;
    setScore(newScore);
    setAnswered(newAnswered);
    setMessage({ type: correct ? 'success' : 'error', message: correct ? 'Correct!' : `Incorrect. ${currentQuestion.explanation}` });
    
    // Always record activity so Progress shows it
    recordActivity(selectedTopic, 'Practice', `Question ${currentQuestion.id}`, correct ? 'Correct' : 'Incorrect', 30);

    if (isAuthenticated) {
      try {
        await practiceAPI.submit({
          topic: selectedTopic,
          questionId: currentQuestion.id,
          answer: currentQuestion.options[selectedAnswer],
          correct,
          attempts: selectedAnswer === currentQuestion.correctIndex ? 1 : 2,
        });
      } catch {}
    }
  };

  const next = () => {
    if (currentIndex >= topicQuestions.length - 1) {
      setShowSummary(true);
      setMessage({ type: 'info', message: `Topic complete! You scored ${score}/${topicQuestions.length}.` });
      // Update overall progress for this topic based on practice score
      const finalAccuracy = Math.round((score / topicQuestions.length) * 100);
      saveProgress(selectedTopic, 'Practice Quiz', {
        completed: finalAccuracy >= 60,
        completionPercentage: finalAccuracy,
        timeSpent: topicQuestions.length * 30,
        operationsPerformed: topicQuestions.length,
      });
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
    setMessage({ type: 'info', message: 'Next question!' });
  };

  const retry = () => resetTopic();

  const goProgress = () => {
    navigate('/progress');
  };

  return (
    <div className="practice-page">
      <div className="practice-title">
        <h1>Practice Questions</h1>
        <p>Test your understanding of each topic. Your results feed into your learning analytics.</p>
        {!isAuthenticated && (
          <p className="practice-login-note">
            <button className="practice-login-link" onClick={() => navigate('/auth/login')}>Log in</button> to save your practice results and update your progress.
          </p>
        )}
      </div>

      <div className="practice-layout">
        <div className="practice-topics">
          {topics.map(t => (
            <button key={t} className={`practice-topic ${selectedTopic === t ? 'active' : ''}`} onClick={() => selectTopic(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="practice-main">
          <div className="practice-scorebar">
            <span>Score: {score}</span>
            <span>Answered: {answered}/{topicQuestions.length}</span>
            <span>Accuracy: {formatAccuracy()}%</span>
          </div>

          {showSummary ? (
            <div className="practice-summary">
              <h2>Topic Complete!</h2>
              <div className="summary-score">{score}/{topicQuestions.length}</div>
              <p className="summary-accuracy">Accuracy: {formatAccuracy()}%</p>
              <div className="summary-actions">
                <Button variant="primary" onClick={retry}>Retry Topic</Button>
                <Button variant="outline" onClick={selectTopic.bind(null, topics[(topics.indexOf(selectedTopic) + 1) % topics.length])}>Next Topic</Button>
                {isAuthenticated && <Button variant="success" onClick={goProgress}>View Progress</Button>}
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="practice-question">
              <span className="practice-q-badge">Question {currentIndex + 1} of {topicQuestions.length}</span>
              <h2>{currentQuestion.question}</h2>
              <div className="practice-options">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`practice-option ${selectedAnswer === idx ? 'selected' : ''} ${submitted ? (idx === currentQuestion.correctIndex ? 'correct' : selectedAnswer === idx ? 'wrong' : '') : ''}`}
                    onClick={() => !submitted && setSelectedAnswer(idx)}
                    disabled={submitted}
                  >
                    <span className="practice-option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="practice-option-text">{opt}</span>
                    {submitted && idx === currentQuestion.correctIndex && <span className="practice-mark">✓</span>}
                    {submitted && selectedAnswer === idx && idx !== currentQuestion.correctIndex && <span className="practice-mark wrong-mark">✗</span>}
                  </button>
                ))}
              </div>
              <div className="practice-actions">
                {!submitted ? (
                  <Button variant="primary" onClick={submit} disabled={selectedAnswer === null}>Submit Answer</Button>
                ) : (
                  <Button variant="success" onClick={next}>{currentIndex >= topicQuestions.length - 1 ? 'Finish Topic' : 'Next Question'}</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="practice-empty">No questions for this topic yet.</div>
          )}

          <StatusMessage type={message.type} message={message.message} />
        </div>
      </div>
    </div>
  );
}
