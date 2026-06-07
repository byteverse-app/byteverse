'use client';

import { useState, useCallback, useEffect } from 'react';
import { CourseMetadata, CourseFolder } from '@/types/courseMetadata';
import AnimatedCourseCard from './AnimatedCourseCard';
import FolderManager from './FolderManager';
import DashboardBulkActionsBar from './DashboardBulkActionsBar';
import { useCourses } from '@/contexts/CourseContext';

interface RecentCoursesProps {
  courses: CourseMetadata[];
  onDeleteCourse?: (id: string) => void | Promise<void>;
}

export default function RecentCourses({ courses, onDeleteCourse }: RecentCoursesProps) {
  const { folders, createFolder, updateFolder, deleteFolder, moveCourseToFolder, getCoursesByFolder } = useCourses();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Group courses by category for auto-categorization
  const coursesByCategory = courses.reduce((acc, course) => {
    const category = course.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {} as Record<string, CourseMetadata[]>);

  const rootCourses = getCoursesByFolder(null);
  const selectedFolderCourses = selectedFolder ? getCoursesByFolder(selectedFolder) : [];
  const displayedCourses = selectedFolder ? selectedFolderCourses : rootCourses;

  const handleSelectCourse = useCallback((courseId: string, selected: boolean) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(courseId);
      } else {
        next.delete(courseId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedCourses.size === displayedCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(displayedCourses.map(c => c.id)));
    }
  }, [selectedCourses.size, displayedCourses]);

  const handleBulkDelete = useCallback(() => {
    if (confirm(`Are you sure you want to delete ${selectedCourses.size} course(s)?`)) {
      selectedCourses.forEach((courseId) => {
        if (onDeleteCourse) {
          onDeleteCourse(courseId);
        }
      });
      setSelectedCourses(new Set());
      setSelectionMode(false);
    }
  }, [selectedCourses, onDeleteCourse]);

  const handleBulkMoveToFolder = useCallback((folderId: string | null) => {
    selectedCourses.forEach((courseId) => {
      moveCourseToFolder(courseId, folderId);
    });
    setSelectedCourses(new Set());
    setSelectionMode(false);
  }, [selectedCourses, moveCourseToFolder]);

  const handleClearSelection = useCallback(() => {
    setSelectedCourses(new Set());
    setSelectionMode(false);
  }, []);

  // Enable selection mode when courses are selected
  useEffect(() => {
    if (selectedCourses.size > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (selectedCourses.size === 0 && selectionMode) {
      setSelectionMode(false);
    }
  }, [selectedCourses.size, selectionMode]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
    // Clear selection when switching folders
    setSelectedCourses(new Set());
    setSelectionMode(false);
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolder(folderId);
    // Clear selection when switching folders
    setSelectedCourses(new Set());
    setSelectionMode(false);
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar with folders and categories */}
      <div className="w-64 flex-shrink-0">
        <FolderManager
          folders={folders}
          onCreateFolder={createFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
        />

        {/* Auto-categorized sections */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Categories</h3>
          <div className="space-y-2">
            {Object.keys(coursesByCategory).map((category) => (
              <button
                key={category}
                onClick={() => handleFolderSelect(null)}
                className="w-full text-left px-3 py-2 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 transition-colors text-text-primary"
              >
                {category} ({coursesByCategory[category].length})
              </button>
            ))}
          </div>
        </div>

        {/* Manual folders */}
        {folders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">My Folders</h3>
            <div className="space-y-1">
              {folders.map((folder) => {
                const folderCourses = getCoursesByFolder(folder.id);
                return (
                  <div key={folder.id}>
                    <button
                      onClick={() => {
                        toggleFolder(folder.id);
                        handleFolderSelect(selectedFolder === folder.id ? null : folder.id);
                      }}
                      className="w-full text-left px-3 py-2 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 transition-colors flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: folder.color }}
                      />
                      <span className="flex-1 text-text-primary">{folder.name}</span>
                      <span className="text-xs text-text-tertiary">({folderCourses.length})</span>
                      <svg
                        className={`w-4 h-4 text-text-tertiary transition-transform ${
                          expandedFolders.has(folder.id) ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <h2 className="neu-section-title">
              {selectedFolder
                ? folders.find((f) => f.id === selectedFolder)?.name || 'Courses'
                : 'Recent Courses'}
            </h2>
            {selectionMode && (
              <span className="px-3 py-1 text-xs font-semibold bg-accent1/10 text-accent1 rounded-full">
                Selection Mode
              </span>
            )}
          </div>
          
          {/* Selection mode toggle and select all */}
          <div className="flex items-center gap-3">
            {selectionMode && displayedCourses.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm bg-bg2 text-text-primary rounded-lg hover:bg-bg3 transition-colors flex items-center gap-2"
              >
                {selectedCourses.size === displayedCourses.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
            <button
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (selectionMode) {
                  setSelectedCourses(new Set());
                }
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                selectionMode
                  ? 'bg-accent1 text-white hover:bg-accent1/90'
                  : 'bg-bg2 text-text-primary hover:bg-bg3'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {selectionMode ? 'Cancel Selection' : 'Select'}
            </button>
          </div>
        </div>
        <main className="animated-cards-container">
          {!selectionMode && (
            <AnimatedCourseCard 
              isCreateNew 
              onDelete={onDeleteCourse} 
              course={{} as CourseMetadata} 
            />
          )}
          {displayedCourses.map((course) => (
            <AnimatedCourseCard
              key={course.id}
              course={course}
              onDelete={onDeleteCourse}
              onMoveToFolder={moveCourseToFolder}
              folders={folders}
              isSelected={selectedCourses.has(course.id)}
              onSelect={handleSelectCourse}
              selectionMode={selectionMode}
            />
          ))}
        </main>
      </div>

      {/* Bulk Actions Bar */}
      <DashboardBulkActionsBar
        selectedCount={selectedCourses.size}
        onDeleteAll={handleBulkDelete}
        onMoveToFolder={handleBulkMoveToFolder}
        onClearSelection={handleClearSelection}
        folders={folders}
      />
    </div>
  );
}
