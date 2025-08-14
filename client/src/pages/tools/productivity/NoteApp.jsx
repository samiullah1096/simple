import React, { useState, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const NoteApp = ({ tool }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', lastModified: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load notes from localStorage on component mount
    const savedNotes = localStorage.getItem('noteapp-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage whenever notes change
    localStorage.setItem('noteapp-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      lastModified: new Date().toISOString(),
      created: new Date().toISOString()
    };
    
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) {
      alert('Please add a title or content to save the note');
      return;
    }

    const updatedNote = {
      ...currentNote,
      lastModified: new Date().toISOString(),
      title: currentNote.title || 'Untitled Note'
    };

    if (currentNote.id) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === currentNote.id ? updatedNote : note
      ));
    } else {
      // Create new note
      const newNote = { ...updatedNote, id: Date.now(), created: new Date().toISOString() };
      setNotes(prev => [newNote, ...prev]);
      setCurrentNote(newNote);
    }
    
    setIsEditing(false);
  };

  const deleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (currentNote.id === noteId) {
        setCurrentNote({ id: null, title: '', content: '', lastModified: null });
        setIsEditing(false);
      }
    }
  };

  const selectNote = (note) => {
    if (isEditing && (currentNote.title !== note.title || currentNote.content !== note.content)) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        setCurrentNote(note);
        setIsEditing(false);
      }
    } else {
      setCurrentNote(note);
      setIsEditing(false);
    }
  };

  const exportNotes = () => {
    const notesText = notes.map(note => 
      `Title: ${note.title}\nCreated: ${new Date(note.created).toLocaleString()}\nLast Modified: ${new Date(note.lastModified).toLocaleString()}\n\n${note.content}\n\n${'='.repeat(50)}\n\n`
    ).join('');

    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-export-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ToolShell
      tool={tool}
      features={[
        "Create and edit notes with rich formatting",
        "Auto-save to browser's local storage",
        "Search through all your notes",
        "Export notes as text file"
      ]}
      faqs={[
        {
          question: "Are my notes saved automatically?",
          answer: "Yes, notes are automatically saved to your browser's local storage when you save them, so they persist between sessions."
        },
        {
          question: "Can I export my notes?",
          answer: "Yes, you can export all your notes as a text file that includes titles, dates, and content."
        },
        {
          question: "How do I search through my notes?",
          answer: "Use the search box to find notes by title or content. The search is case-insensitive and searches through all note text."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
          {/* Notes List Sidebar */}
          <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notes ({notes.length})</h3>
              <button
                onClick={createNewNote}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
              >
                New Note
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-sm"
              />
            </div>
            
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {notes.length === 0 ? 'No notes yet' : 'No notes found'}
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
                      currentNote.id === note.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    } border`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{note.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {note.content.substring(0, 50)}...
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDate(note.lastModified)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notes.length > 0 && (
              <button
                onClick={exportNotes}
                className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 text-sm"
              >
                Export All Notes
              </button>
            )}
          </div>
          
          {/* Note Editor */}
          <div className="lg:w-2/3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            {currentNote.id || isEditing ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => {
                      setCurrentNote(prev => ({ ...prev, title: e.target.value }));
                      setIsEditing(true);
                    }}
                    placeholder="Note title..."
                    className="text-xl font-semibold bg-transparent border-none outline-none flex-1 mr-4"
                  />
                  
                  <div className="flex space-x-2">
                    {isEditing && (
                      <button
                        onClick={saveNote}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                      >
                        Save
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsEditing(true);
                      }}
                      disabled={isEditing}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={currentNote.content}
                  onChange={(e) => {
                    setCurrentNote(prev => ({ ...prev, content: e.target.value }));
                    setIsEditing(true);
                  }}
                  placeholder="Start typing your note..."
                  className="w-full flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 resize-none"
                  readOnly={!isEditing}
                />
                
                {currentNote.lastModified && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Last modified: {formatDate(currentNote.lastModified)}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No Note Selected</h3>
                  <p>Select a note from the sidebar or create a new one to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default NoteApp;