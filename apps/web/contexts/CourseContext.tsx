'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Course, CourseMetadata, CourseFolder } from '@/types/courseMetadata';
import { CourseCreationState } from '@/types/courseCreation';
import { createClient } from '@/lib/supabase/client';
import {
  listProjects,
  createProject as createProjectDb,
  updateProject as updateProjectDb,
  deleteProject as deleteProjectDb,
  listFolders,
  createFolder as createFolderDb,
  updateFolder as updateFolderDb,
  deleteFolder as deleteFolderDb,
  countProjects,
} from '@/lib/projects/repository';
import { hasLocalStorageCourses, importLocalStorageToSupabase } from '@/lib/projects/importLocalStorage';
import type { User } from '@supabase/supabase-js';

const MAX_COURSES = 100;

interface CourseContextValue {
  courses: CourseMetadata[];
  featuredCourses: CourseMetadata[];
  recentCourses: CourseMetadata[];
  folders: CourseFolder[];
  loading: boolean;
  user: User | null;
  importMessage: string | null;
  createCourse: (title: string, state: CourseCreationState, metadata?: Partial<CourseMetadata>) => Promise<string>;
  updateCourse: (id: string, updates: Partial<CourseMetadata> | { state: CourseCreationState }) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourse: (id: string) => Course | null;
  getCourseState: (id: string) => CourseCreationState | null;
  createFolder: (name: string, color?: string) => Promise<string>;
  updateFolder: (id: string, updates: Partial<CourseFolder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveCourseToFolder: (courseId: string, folderId: string | null) => Promise<void>;
  getCoursesByFolder: (folderId: string | null) => CourseMetadata[];
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<CourseMetadata[]>([]);
  const [folders, setFolders] = useState<CourseFolder[]>([]);
  const [workspaceStates, setWorkspaceStates] = useState<Record<string, CourseCreationState>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const supabase = useMemo(() => createClient(), []);

  const reloadFromSupabase = useCallback(async () => {
    const { courses: loadedCourses, states } = await listProjects(supabase);
    setCourses(loadedCourses.slice(0, MAX_COURSES));
    setWorkspaceStates(states);
    const loadedFolders = await listFolders(supabase);
    setFolders(loadedFolders);
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (cancelled) return;

        setUser(authUser);
        if (!authUser) {
          setLoading(false);
          return;
        }

        const projectCount = await countProjects(supabase);
        if (!cancelled && projectCount === 0 && hasLocalStorageCourses()) {
          const imported = await importLocalStorageToSupabase(supabase, authUser.id);
          if (imported > 0) {
            setImportMessage(`Your ${imported} local project${imported === 1 ? '' : 's'} ${imported === 1 ? 'was' : 'were'} migrated to your account.`);
          }
        }

        await reloadFromSupabase();
      } catch (error) {
        console.error('Error loading courses from Supabase:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, reloadFromSupabase]);

  const createCourse = useCallback(async (
    title: string,
    state: CourseCreationState,
    metadata?: Partial<CourseMetadata>
  ): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    const id = await createProjectDb(supabase, user.id, title, state, metadata);
    const now = Date.now();
    const newCourse: CourseMetadata = {
      id,
      title,
      description: metadata?.description,
      category: metadata?.category,
      thumbnail: metadata?.thumbnail,
      icon: metadata?.icon,
      createdAt: now,
      lastModified: now,
      sourceCount: state.uploadedFiles.length,
      stageCount: state.courseData?.course.stages.length,
      isFeatured: metadata?.isFeatured ?? false,
      folderId: metadata?.folderId,
    };

    setCourses((prev) => [newCourse, ...prev].slice(0, MAX_COURSES));
    setWorkspaceStates((prev) => ({ ...prev, [id]: state }));
    return id;
  }, [supabase, user]);

  const updateCourse = useCallback(async (
    id: string,
    updates: Partial<CourseMetadata> | { state: CourseCreationState }
  ): Promise<void> => {
    const hasState = 'state' in updates;

    setCourses((prev) => {
      const course = prev.find((c) => c.id === id);
      if (!course) return prev;

      const updated: CourseMetadata = {
        ...course,
        ...('state' in updates ? {} : updates),
        lastModified: Date.now(),
        ...(hasState ? {
          sourceCount: updates.state.uploadedFiles.length,
          stageCount: updates.state.courseData?.course.stages.length,
        } : {}),
      };

      return prev.map((c) => (c.id === id ? updated : c));
    });

    if (hasState) {
      setWorkspaceStates((prev) => ({ ...prev, [id]: updates.state }));

      if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
      saveTimers.current[id] = setTimeout(async () => {
        try {
          await updateProjectDb(supabase, id, {}, updates.state);
        } catch (error) {
          console.error('Error saving course state:', error);
        }
      }, 800);
      return;
    }

    try {
      await updateProjectDb(supabase, id, updates);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }, [supabase]);

  const deleteCourse = useCallback(async (id: string): Promise<void> => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setWorkspaceStates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await deleteProjectDb(supabase, id);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }, [supabase]);

  const getCourse = useCallback((id: string): Course | null => {
    const metadata = courses.find((c) => c.id === id);
    if (!metadata) return null;
    const state = workspaceStates[id];
    if (!state) return null;
    return { ...metadata, state };
  }, [courses, workspaceStates]);

  const getCourseState = useCallback((id: string): CourseCreationState | null => {
    return workspaceStates[id] ?? null;
  }, [workspaceStates]);

  const createFolderFn = useCallback(async (name: string, color?: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    const id = await createFolderDb(supabase, user.id, name, color);
    const now = Date.now();
    setFolders((prev) => [...prev, { id, name, color: color ?? '#6366f1', createdAt: now, lastModified: now }]);
    return id;
  }, [supabase, user]);

  const updateFolderFn = useCallback(async (id: string, updates: Partial<CourseFolder>): Promise<void> => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, ...updates, lastModified: Date.now() } : folder
      )
    );
    try {
      await updateFolderDb(supabase, id, updates);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  }, [supabase]);

  const deleteFolderFn = useCallback(async (id: string): Promise<void> => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setCourses((prev) =>
      prev.map((course) => (course.folderId === id ? { ...course, folderId: undefined } : course))
    );
    try {
      await deleteFolderDb(supabase, id);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  }, [supabase]);

  const moveCourseToFolder = useCallback(async (courseId: string, folderId: string | null): Promise<void> => {
    await updateCourse(courseId, { folderId: folderId ?? undefined });
  }, [updateCourse]);

  const getCoursesByFolder = useCallback(
    (folderId: string | null): CourseMetadata[] => {
      if (folderId === null) {
        return courses.filter((c) => !c.folderId && !c.isFeatured);
      }
      return courses.filter((c) => c.folderId === folderId);
    },
    [courses]
  );

  const featuredCourses = courses.filter((c) => c.isFeatured).slice(0, 10);
  const recentCourses = courses
    .filter((c) => !c.isFeatured)
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 20);

  const value: CourseContextValue = {
    courses,
    featuredCourses,
    recentCourses,
    folders,
    loading,
    user,
    importMessage,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getCourseState,
    createFolder: createFolderFn,
    updateFolder: updateFolderFn,
    deleteFolder: deleteFolderFn,
    moveCourseToFolder,
    getCoursesByFolder,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
