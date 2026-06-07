-- Private course-media bucket with user-scoped storage policies

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-media',
  'course-media',
  false,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 52428800;

-- Users can read their own files
create policy "course_media_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can upload to their own folder
create policy "course_media_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own files (upsert requires SELECT + INSERT + UPDATE)
create policy "course_media_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
create policy "course_media_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'course-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
