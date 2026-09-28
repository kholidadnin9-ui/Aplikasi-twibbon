import { CustomTwibbonFrame } from '../types/twibbon';

const STORAGE_KEY = 'widodo-guru-sd-custom-twibbons-v1';

export class StorageQuotaError extends Error {
  constructor() {
    super('Penyimpanan penuh');
    this.name = 'StorageQuotaError';
  }
}

/**
 * Read the full custom twibbon library from localStorage
 */
export function loadCustomFrames(): CustomTwibbonFrame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CustomTwibbonFrame[];
  } catch {
    return [];
  }
}

/**
 * Persist the full library, throwing StorageQuotaError if the browser storage is full
 */
function persist(frames: CustomTwibbonFrame[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frames));
  } catch (err) {
    if (
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      throw new StorageQuotaError();
    }
    throw err;
  }
}

/**
 * Create/Add a new custom twibbon frame
 */
export function addCustomFrame(
  frames: CustomTwibbonFrame[],
  data: Omit<CustomTwibbonFrame, 'id' | 'createdAt' | 'updatedAt'>
): CustomTwibbonFrame[] {
  const now = Date.now();
  const newFrame: CustomTwibbonFrame = {
    ...data,
    id: `custom-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  const next = [newFrame, ...frames];
  persist(next);
  return next;
}

/**
 * Update/Edit an existing custom twibbon frame (metadata and/or artwork)
 */
export function updateCustomFrame(
  frames: CustomTwibbonFrame[],
  id: string,
  updates: Partial<Omit<CustomTwibbonFrame, 'id' | 'createdAt'>>
): CustomTwibbonFrame[] {
  const next = frames.map((f) =>
    f.id === id ? { ...f, ...updates, updatedAt: Date.now() } : f
  );
  persist(next);
  return next;
}

/**
 * Delete a custom twibbon frame from the library
 */
export function deleteCustomFrame(
  frames: CustomTwibbonFrame[],
  id: string
): CustomTwibbonFrame[] {
  const next = frames.filter((f) => f.id !== id);
  persist(next);
  return next;
}

/**
 * Rough estimate of used storage in MB for display purposes
 */
export function estimateStorageUsageMB(frames: CustomTwibbonFrame[]): number {
  try {
    const bytes = new Blob([JSON.stringify(frames)]).size;
    return Number((bytes / (1024 * 1024)).toFixed(2));
  } catch {
    return 0;
  }
}
