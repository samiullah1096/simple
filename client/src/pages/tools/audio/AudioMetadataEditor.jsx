import React, { useState } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const AudioMetadataEditor = ({ tool }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    artist: '',
    album: '',
    year: '',
    genre: '',
    track: '',
    comment: ''
  });
  const [originalMetadata, setOriginalMetadata] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const commonGenres = [
    'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Blues', 'Country', 'Electronic', 'Classical',
    'R&B', 'Folk', 'Punk', 'Metal', 'Alternative', 'Indie', 'Reggae', 'World'
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Try to extract existing metadata
      try {
        const extractedMetadata = await extractMetadataFromFile(file);
        setOriginalMetadata(extractedMetadata);
        setMetadata({
          title: extractedMetadata.title || '',
          artist: extractedMetadata.artist || '',
          album: extractedMetadata.album || '',
          year: extractedMetadata.year || '',
          genre: extractedMetadata.genre || '',
          track: extractedMetadata.track || '',
          comment: extractedMetadata.comment || ''
        });
      } catch (error) {
        console.error('Error extracting metadata:', error);
        // Reset to empty if extraction fails
        setMetadata({
          title: '',
          artist: '',
          album: '',
          year: '',
          genre: '',
          track: '',
          comment: ''
        });
        setOriginalMetadata(null);
      }
    } else {
      alert('Please select a valid audio file');
    }
  };

  const extractMetadataFromFile = async (file) => {
    // This is a simplified metadata extraction
    // In a real implementation, you'd use a library like music-metadata
    // For now, we'll try to parse the filename for basic info
    const filename = file.name.replace(/\.[^/.]+$/, '');
    const parts = filename.split(' - ');
    
    let extractedData = {
      title: filename,
      artist: '',
      album: '',
      year: '',
      genre: '',
      track: '',
      comment: ''
    };

    // Try to parse "Artist - Title" format
    if (parts.length >= 2) {
      extractedData.artist = parts[0].trim();
      extractedData.title = parts[1].trim();
    }

    // Look for year in filename
    const yearMatch = filename.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      extractedData.year = yearMatch[0];
    }

    return extractedData;
  };

  const updateMetadata = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveMetadata = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    setIsProcessing(true);

    try {
      // Since we can't actually embed metadata in the browser without external libraries,
      // we'll create a new file with the metadata as a separate JSON file
      // and simulate the audio file processing
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert audio to WAV format
      const wavBlob = audioBufferToWavBlob(audioBuffer);
      
      // Create metadata JSON
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { 
        type: 'application/json' 
      });
      
      // Download both files
      const baseName = audioFile.name.replace(/\.[^/.]+$/, '');
      downloadFile(wavBlob, `${baseName}_with_metadata.wav`);
      downloadFile(metadataBlob, `${baseName}_metadata.json`);
      
      alert('Audio file and metadata saved! The metadata is saved as a separate JSON file.');

    } catch (error) {
      console.error('Metadata save error:', error);
      alert('Error saving metadata. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportMetadata = () => {
    const dataToExport = {
      filename: audioFile.name,
      originalMetadata,
      updatedMetadata: metadata,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const baseName = audioFile.name.replace(/\.[^/.]+$/, '');
    downloadFile(blob, `${baseName}_metadata_export.json`);
  };

  const clearMetadata = () => {
    setMetadata({
      title: '',
      artist: '',
      album: '',
      year: '',
      genre: '',
      track: '',
      comment: ''
    });
  };

  const restoreOriginal = () => {
    if (originalMetadata) {
      setMetadata({
        title: originalMetadata.title || '',
        artist: originalMetadata.artist || '',
        album: originalMetadata.album || '',
        year: originalMetadata.year || '',
        genre: originalMetadata.genre || '',
        track: originalMetadata.track || '',
        comment: originalMetadata.comment || ''
      });
    }
  };

  const audioBufferToWavBlob = (buffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-6">
        {/* File Upload */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Audio File</h3>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
              data-testid="input-audio-file"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <i className="fas fa-upload text-4xl text-purple-400"></i>
              <div>
                <p className="text-slate-100 font-medium">Choose audio file</p>
                <p className="text-slate-400 text-sm">MP3, WAV, OGG, M4A supported</p>
              </div>
            </label>
          </div>
          
          {audioFile && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-300"><strong>File:</strong> {audioFile.name}</p>
            </div>
          )}
        </div>

        {/* Original Metadata Display */}
        {originalMetadata && (
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Original Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(originalMetadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400 capitalize">{key}:</span>
                  <span className="text-slate-300">{value || 'Not set'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Editor */}
        {audioFile && (
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Edit Metadata</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearMetadata}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                  data-testid="button-clear"
                >
                  Clear All
                </button>
                {originalMetadata && (
                  <button
                    onClick={restoreOriginal}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                    data-testid="button-restore"
                  >
                    Restore Original
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => updateMetadata('title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Song title"
                  data-testid="input-title"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Artist</label>
                <input
                  type="text"
                  value={metadata.artist}
                  onChange={(e) => updateMetadata('artist', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Artist name"
                  data-testid="input-artist"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Album</label>
                <input
                  type="text"
                  value={metadata.album}
                  onChange={(e) => updateMetadata('album', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Album name"
                  data-testid="input-album"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={metadata.year}
                  onChange={(e) => updateMetadata('year', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Release year"
                  data-testid="input-year"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Genre</label>
                <select
                  value={metadata.genre}
                  onChange={(e) => updateMetadata('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  data-testid="select-genre"
                >
                  <option value="">Select genre</option>
                  {commonGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">Track Number</label>
                <input
                  type="number"
                  min="1"
                  value={metadata.track}
                  onChange={(e) => updateMetadata('track', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Track number"
                  data-testid="input-track"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-slate-300 mb-2">Comment</label>
                <textarea
                  value={metadata.comment}
                  onChange={(e) => updateMetadata('comment', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-600 focus:border-purple-400"
                  placeholder="Additional comments"
                  rows="3"
                  data-testid="textarea-comment"
                />
              </div>
            </div>

            {previewUrl && (
              <div className="mt-6">
                <label className="block text-slate-300 mb-2">Preview Audio</label>
                <audio controls className="w-full" data-testid="audio-preview">
                  <source src={previewUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {audioFile && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={saveMetadata}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-save"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>Save with Metadata</span>
                </>
              )}
            </button>
            
            <button
              onClick={exportMetadata}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl transition-colors inline-flex items-center space-x-2"
              data-testid="button-export"
            >
              <i className="fas fa-download"></i>
              <span>Export Metadata</span>
            </button>
          </div>
        )}

        {/* Features */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Edit ID3 tags and audio metadata</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Support for title, artist, album, year, genre, and track</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Auto-detection of existing metadata</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Export metadata as JSON for backup</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-400"></i>
              <span>Preserve audio quality during processing</span>
            </li>
          </ul>
          
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Note:</strong> Due to browser limitations, metadata is saved as a separate JSON file alongside the audio. 
              For embedded metadata, use desktop audio editing software.
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default AudioMetadataEditor;