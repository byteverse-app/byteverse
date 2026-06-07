# Deploy with Sudar — Integration Guide

## Overview

ByteVerse **creates** microlearning modules. **Sudar** hosts, publishes, and delivers them with adaptive learning and the memory-aware tutor.

## v1 — Manual handoff (shipped)

1. In ByteVerse, finish a module and open **Export**.
2. Download **SCORM 1.2 ZIP** (or standalone HTML if not using Sudar).
3. In [Sudar Studio](https://teachwithsudar.com), sign in and use **Import SCORM** (Studio API: `POST /api/courses/import-scorm`).
4. Edit if needed, publish to Sudar Learn for learners.

### Links

- Product story: https://teachwithsudar.com
- Open source: https://github.com/Dhanikesh-Karunanithi/Sudar

## Export formats from ByteVerse

| Format | Use case |
|--------|----------|
| SCORM 1.2 ZIP | Sudar Studio import, Moodle, Canvas, etc. |
| HTML ZIP | Standalone hosting, email, intranet |
| JSON | Re-open project in ByteVerse |

## v2 — API publish (future)

Optional authenticated publish from ByteVerse to Sudar Studio when a stable course-create + SCORM upload API is exposed with org API keys. Requires separate Supabase projects and explicit user consent.

## Testing compatibility

After exporting from ByteVerse, import the ZIP into a Sudar Studio dev environment and verify launch file + quiz tracking in preview.
