import type { SupabaseClient } from '@supabase/supabase-js';
import type { CourseCreationState } from '@/types/courseCreation';
import type { CourseFolder, CourseMetadata } from '@/types/courseMetadata';
import { createProject } from '@/lib/projects/repository';

const COURSES_STORAGE_KEY = 'bytelab_courses';
const FOLDERS_STORAGE_KEY = 'bytelab_folders';

export function hasLocalStorageCourses(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

export async function importLocalStorageToSupabase(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  if (typeof window === 'undefined') return 0;

  let courses: CourseMetadata[] = [];
  let folders: CourseFolder[] = [];

  try {
    const savedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (savedCourses) courses = JSON.parse(savedCourses);
    const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (savedFolders) folders = JSON.parse(savedFolders);
  } catch {
    return 0;
  }

  if (!Array.isArray(courses) || courses.length === 0) return 0;

  const folderIdMap = new Map<string, string>();

  for (const folder of folders) {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        name: folder.name,
        color: folder.color ?? '#6366f1',
      })
      .select('id')
      .single();

    if (!error && data) {
      folderIdMap.set(folder.id, data.id);
    }
  }

  let imported = 0;

  for (const course of courses) {
    let state: CourseCreationState | null = null;
    try {
      const stateJson = localStorage.getItem(`${COURSES_STORAGE_KEY}_state_${course.id}`);
      if (stateJson) state = JSON.parse(stateJson);
    } catch {
      // skip broken state
    }

    const mappedFolderId = course.folderId ? folderIdMap.get(course.folderId) : undefined;

    await createProject(
      supabase,
      userId,
      course.title,
      state ?? {
        uploadedFiles: [],
        totalChunks: 0,
        chatHistory: [],
        chatSessions: [],
        currentChatSessionId: null,
        aiInsights: null,
        courseConfig: null,
        courseData: null,
        generationProgress: null,
        mediaAssets: [],
        createdAt: course.createdAt,
        lastUpdated: course.lastModified,
        currentStage: 1,
        contextSessionId: `session-${Date.now()}`,
      },
      {
        ...course,
        folderId: mappedFolderId,
      }
    );
    imported++;
  }

  localStorage.removeItem(COURSES_STORAGE_KEY);
  localStorage.removeItem(FOLDERS_STORAGE_KEY);
  for (const course of courses) {
    localStorage.removeItem(`${COURSES_STORAGE_KEY}_state_${course.id}`);
  }
  localStorage.removeItem('bytelab_course_creation_state');

  return imported;
}
