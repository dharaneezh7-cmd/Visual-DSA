export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'min' | 'key' | 'overwriting';

export interface SortBar {
  value: number;
  state: BarState;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
  passes: number;
}

export interface SortFrame {
  states: SortBar[];
  stats: SortStats;
  note: string;
}

export type SortAlgorithm = (initial: number[]) => AsyncGenerator<SortFrame>;

const makeBuilder = (a: number[], sorted: Set<number>) => {
  return (extra: Record<number, BarState>): SortBar[] =>
    a.map((value, i) => ({
      value,
      state: extra[i] ?? (sorted.has(i) ? 'sorted' : 'default'),
    }));
};

export const bubbleSort: SortAlgorithm = async function* (initial: number[]) {
  const a = [...initial];
  const n = a.length;
  const sorted = new Set<number>();
  const build = makeBuilder(a, sorted);
  let comparisons = 0;
  let swaps = 0;

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      comparisons++;
      yield { states: build({ [i]: 'comparing', [i + 1]: 'comparing' }), stats: { comparisons, swaps, passes: pass + 1 }, note: `Compare ${a[i]} and ${a[i + 1]}` };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swaps++;
        swapped = true;
        yield { states: build({ [i]: 'swapping', [i + 1]: 'swapping' }), stats: { comparisons, swaps, passes: pass + 1 }, note: `Swap ${a[i + 1]} and ${a[i]}` };
      }
    }
    sorted.add(n - 1 - pass);
    yield { states: build({ [n - 1 - pass]: 'sorted' }), stats: { comparisons, swaps, passes: pass + 1 }, note: `${a[n - 1 - pass]} is now in its final sorted position` };
    if (!swapped) break;
  }

  for (let i = 0; i < n; i++) sorted.add(i);
  yield { states: build({}), stats: { comparisons, swaps, passes: n - 1 }, note: 'Array sorted!' };
};

export const selectionSort: SortAlgorithm = async function* (initial: number[]) {
  const a = [...initial];
  const n = a.length;
  const sorted = new Set<number>();
  const build = makeBuilder(a, sorted);
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield { states: build({ [j]: 'comparing', [minIdx]: 'min' }), stats: { comparisons, swaps, passes: i + 1 }, note: `Compare ${a[j]} with current minimum ${a[minIdx]}` };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { states: build({ [j]: 'min' }), stats: { comparisons, swaps, passes: i + 1 }, note: `${a[j]} is the new minimum` };
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
    }
    sorted.add(i);
    yield { states: build({ [minIdx]: 'swapping' }), stats: { comparisons, swaps, passes: i + 1 }, note: `Swap ${a[i]} into sorted position ${i}` };
  }
  for (let i = 0; i < n; i++) sorted.add(i);
  yield { states: build({}), stats: { comparisons, swaps, passes: n - 1 }, note: 'Array sorted!' };
};

export const insertionSort: SortAlgorithm = async function* (initial: number[]) {
  const a = [...initial];
  const n = a.length;
  const sorted = new Set<number>([0]);
  const build = makeBuilder(a, sorted);
  let comparisons = 0;
  let switches = 0;

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield { states: build({ [i]: 'key' }), stats: { comparisons, swaps: switches, passes: i }, note: `Key = ${key} (element at index ${i})` };
    while (j >= 0 && a[j] > key) {
      comparisons++;
      yield { states: build({ [j]: 'comparing', [i]: 'key' }), stats: { comparisons, swaps: switches, passes: i }, note: `Compare ${a[j]} with key ${key}` };
      a[j + 1] = a[j];
      switches++;
      sorted.delete(j + 1);
      yield { states: build({ [j + 1]: 'overwriting' }), stats: { comparisons, swaps: switches, passes: i }, note: `Shift ${a[j]} right` };
      j--;
    }
    a[j + 1] = key;
    yield { states: build({ [j + 1]: 'key' }), stats: { comparisons, swaps: switches, passes: i }, note: `Place key ${key} at index ${j + 1}` };
    for (let m = 0; m <= i; m++) sorted.add(m);
  }
  for (let i = 0; i < n; i++) sorted.add(i);
  yield { states: build({}), stats: { comparisons, swaps: switches, passes: n - 1 }, note: 'Array sorted!' };
};

export const mergeSort: SortAlgorithm = async function* (initial: number[]) {
  const a = [...initial];
  const n = a.length;
  const sorted = new Set<number>();
  const build = makeBuilder(a, sorted);
  let comparisons = 0;
  let writes = 0;

  const doMerge = async function* (lo: number, mid: number, hi: number): AsyncGenerator<SortFrame> {
    let i = lo;
    let j = mid + 1;
    const merged: number[] = [];
    while (i <= mid && j <= hi) {
      comparisons++;
      yield { states: build({ [i]: 'comparing', [j]: 'comparing' }), stats: { comparisons, swaps: writes, passes: 0 }, note: `Compare ${a[i]} and ${a[j]}` };
      if (a[i] <= a[j]) {
        merged.push(a[i]);
        i++;
      } else {
        merged.push(a[j]);
        j++;
      }
    }
    while (i <= mid) { merged.push(a[i]); i++; }
    while (j <= hi) { merged.push(a[j]); j++; }
    for (let k = 0; k < merged.length; k++) {
      a[lo + k] = merged[k];
      writes++;
      yield { states: build({ [lo + k]: 'overwriting' }), stats: { comparisons, swaps: writes, passes: 0 }, note: `Write ${merged[k]} to index ${lo + k}` };
    }
  };

  const doSplit = async function* (lo: number, hi: number): AsyncGenerator<SortFrame> {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* doSplit(lo, mid);
    yield* doSplit(mid + 1, hi);
    yield* doMerge(lo, mid, hi);
    yield { states: build({}), stats: { comparisons, swaps: writes, passes: hi - lo }, note: `Segment ${lo}..${hi} merged` };
  };

  yield* doSplit(0, n - 1);
  for (let i = 0; i < n; i++) sorted.add(i);
  yield { states: build({}), stats: { comparisons, swaps: writes, passes: 1 }, note: 'Array sorted!' };
};

export const quickSort: SortAlgorithm = async function* (initial: number[]) {
  const a = [...initial];
  const n = a.length;
  const sorted = new Set<number>();
  const build = makeBuilder(a, sorted);
  let comparisons = 0;
  let swaps = 0;

  const doPartition = async function* (lo: number, hi: number): AsyncGenerator<{ pivotIndex: number; frame: SortFrame }> {
    const pivot = a[hi];
    yield { pivotIndex: hi, frame: { states: build({ [hi]: 'pivot' }), stats: { comparisons, swaps, passes: 0 }, note: `Pivot = ${pivot} (last element)` } };
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      yield { pivotIndex: hi, frame: { states: build({ [j]: 'comparing', [hi]: 'pivot' }), stats: { comparisons, swaps, passes: 0 }, note: `Compare ${a[j]} with pivot ${pivot}` } };
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          yield { pivotIndex: hi, frame: { states: build({ [i]: 'swapping', [j]: 'swapping', [hi]: 'pivot' }), stats: { comparisons, swaps, passes: 0 }, note: `Swap ${a[i]} and ${a[j]}` } };
        }
      }
    }
    const finalPivotPos = i + 1;
    [a[finalPivotPos], a[hi]] = [a[hi], a[finalPivotPos]];
    swaps++;
    yield { pivotIndex: finalPivotPos, frame: { states: build({ [finalPivotPos]: 'swapping', [hi]: 'pivot' }), stats: { comparisons, swaps, passes: 0 }, note: `Place pivot ${pivot} at index ${finalPivotPos}` } };
  };

  const doSortAll = async function* (lo: number, hi: number): AsyncGenerator<SortFrame> {
    if (lo >= hi) return;
    const frames: SortFrame[] = [];
    let finalIndex = -1;
    for await (const result of doPartition(lo, hi)) {
      finalIndex = result.pivotIndex;
      frames.push(result.frame);
      yield result.frame;
    }
    sorted.add(finalIndex);
    yield { states: build({ [finalIndex]: 'sorted' }), stats: { comparisons, swaps, passes: 0 }, note: `Pivot settled at index ${finalIndex}. Recursing.` };
    yield* doSortAll(lo, finalIndex - 1);
    yield* doSortAll(finalIndex + 1, hi);
  };

  yield* doSortAll(0, n - 1);
  for (let i = 0; i < n; i++) sorted.add(i);
  yield { states: build({}), stats: { comparisons, swaps, passes: 1 }, note: 'Array sorted!' };
};

export const algorithms: Record<string, SortAlgorithm> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};

export function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}