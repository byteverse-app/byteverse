import { VectorStore } from './vectorStore';
import { Chunk } from './chunker';

const sessionStores = new Map<string, VectorStore>();

function sessionKey(userId: string, sessionId: string): string {
  return `${userId}:${sessionId}`;
}

export function getSessionVectorStore(userId: string, sessionId: string): VectorStore {
  const key = sessionKey(userId, sessionId);
  let store = sessionStores.get(key);
  if (!store) {
    store = new VectorStore();
    sessionStores.set(key, store);
  }
  return store;
}

export function clearSessionVectorStore(userId: string, sessionId: string): void {
  const key = sessionKey(userId, sessionId);
  const store = sessionStores.get(key);
  if (store) store.clear();
  sessionStores.delete(key);
}

/** Rebuild embeddings from persisted chunk text when serverless instance is cold. */
export async function ensureSessionVectorStore(
  userId: string,
  sessionId: string,
  chunks: Chunk[]
): Promise<VectorStore> {
  const store = getSessionVectorStore(userId, sessionId);
  if (store.size() === 0 && chunks.length > 0) {
    await store.addChunks(chunks);
  }
  return store;
}

export function getVectorStoreForRequest(
  userId: string,
  contextSessionId?: string
): VectorStore {
  const sessionId = contextSessionId?.trim() || 'default';
  return getSessionVectorStore(userId, sessionId);
}
