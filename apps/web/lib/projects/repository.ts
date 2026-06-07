import type { SupabaseClient } from '@supabase/supabase-js';
import type { CourseCreationState } from '@/types/courseCreation';
import type { CourseFolder, CourseMetadata } from '@/types/courseMetadata';

export interface ProjectMetadata {
  description?: string;
  category?: string;
  thumbnail?: string;
  icon?: string;
  isFeatured?: boolean;
  folderId?: string;
  sourceCount?: number;
  stageCount?: number;
}

interface DbProjectRow {
  id: string;
  user_id: string;
  title: string;
  status: string;
  template_id: string | null;
  metadata: ProjectMetadata | null;
  created_at: string;
  updated_at: string;
  modules: { workspace_state: CourseCreationState | null }[] | null;
}

interface DbFolderRow {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

function toTimestamp(iso: string): number {
  return new Date(iso).getTime();
}

export function metadataToCourse(row: DbProjectRow): CourseMetadata {
  const meta = row.metadata ?? {};
  const state = row.modules?.[0]?.workspace_state;
  return {
    id: row.id,
    title: row.title,
    description: meta.description,
    category: meta.category,
    thumbnail: meta.thumbnail,
    icon: meta.icon,
    createdAt: toTimestamp(row.created_at),
    lastModified: toTimestamp(row.updated_at),
    sourceCount: meta.sourceCount ?? state?.uploadedFiles?.length ?? 0,
    stageCount: meta.stageCount ?? state?.courseData?.course.stages.length,
    isFeatured: meta.isFeatured ?? false,
    folderId: meta.folderId,
  };
}

export function courseMetadataToProjectMetadata(metadata: Partial<CourseMetadata>, state?: CourseCreationState): ProjectMetadata {
  return {
    description: metadata.description,
    category: metadata.category,
    thumbnail: metadata.thumbnail,
    icon: metadata.icon,
    isFeatured: metadata.isFeatured,
    folderId: metadata.folderId,
    sourceCount: metadata.sourceCount ?? state?.uploadedFiles?.length,
    stageCount: metadata.stageCount ?? state?.courseData?.course.stages.length,
  };
}

export function folderRowToCourseFolder(row: DbFolderRow): CourseFolder {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? '#6366f1',
    createdAt: toTimestamp(row.created_at),
    lastModified: toTimestamp(row.updated_at),
  };
}

export async function listProjects(supabase: SupabaseClient): Promise<{ courses: CourseMetadata[]; states: Record<string, CourseCreationState> }> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, user_id, title, status, template_id, metadata, created_at, updated_at, modules(workspace_state)')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as DbProjectRow[];
  const courses = rows.map(metadataToCourse);
  const states: Record<string, CourseCreationState> = {};
  for (const row of rows) {
    const state = row.modules?.[0]?.workspace_state;
    if (state) states[row.id] = state;
  }
  return { courses, states };
}

export async function getProjectState(supabase: SupabaseClient, projectId: string): Promise<CourseCreationState | null> {
  const { data, error } = await supabase
    .from('modules')
    .select('workspace_state')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;
  return (data?.workspace_state as CourseCreationState | null) ?? null;
}

export async function createProject(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  state: CourseCreationState,
  metadata?: Partial<CourseMetadata>
): Promise<string> {
  const projectMetadata = courseMetadataToProjectMetadata(metadata ?? {}, state);

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      title,
      metadata: projectMetadata,
    })
    .select('id')
    .single();

  if (projectError) throw projectError;

  const { error: moduleError } = await supabase.from('modules').insert({
    project_id: project.id,
    workspace_state: state,
  });

  if (moduleError) throw moduleError;
  return project.id;
}

export async function updateProject(
  supabase: SupabaseClient,
  projectId: string,
  updates: Partial<CourseMetadata>,
  state?: CourseCreationState
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.title !== undefined) payload.title = updates.title;
  if (Object.keys(updates).some((k) => k !== 'title' && k !== 'id')) {
    const { data: existing } = await supabase.from('projects').select('metadata').eq('id', projectId).single();
    const currentMeta = (existing?.metadata as ProjectMetadata) ?? {};
    payload.metadata = courseMetadataToProjectMetadata({ ...currentMeta, ...updates }, state);
  }

  const { error: projectError } = await supabase.from('projects').update(payload).eq('id', projectId);
  if (projectError) throw projectError;

  if (state) {
    const { error: moduleError } = await supabase
      .from('modules')
      .update({ workspace_state: state, updated_at: new Date().toISOString() })
      .eq('project_id', projectId);
    if (moduleError) throw moduleError;
  }
}

export async function deleteProject(supabase: SupabaseClient, projectId: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
}

export async function listFolders(supabase: SupabaseClient): Promise<CourseFolder[]> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbFolderRow[]).map(folderRowToCourseFolder);
}

export async function createFolder(supabase: SupabaseClient, userId: string, name: string, color?: string): Promise<string> {
  const { data, error } = await supabase
    .from('folders')
    .insert({ user_id: userId, name, color: color ?? '#6366f1' })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateFolder(supabase: SupabaseClient, folderId: string, updates: Partial<CourseFolder>): Promise<void> {
  const { error } = await supabase
    .from('folders')
    .update({
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.color !== undefined ? { color: updates.color } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', folderId);

  if (error) throw error;
}

export async function deleteFolder(supabase: SupabaseClient, folderId: string): Promise<void> {
  const { error } = await supabase.from('folders').delete().eq('id', folderId);
  if (error) throw error;
}

export async function countProjects(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}
