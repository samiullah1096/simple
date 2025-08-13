import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AudioConverter() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState('');
  const audioRef = useRef(null);

  const supportedFormats = [
    { value: 'mp3', label: 'MP3', description: 'Most common audio format' },
    { value: 'wav', label: 'WAV', description: 'High quality uncompressed' },
    { value: 'ogg', label: 'OGG', description: 'Open source format' },
    { value: 'webm', label: 'WebM', description: 'Web optimized format' },
    { value: 'm4a', label: 'M4A', description: 'Apple audio format' }
  ];

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError('');
      setConvertedFile(null);
      
      // Create audio preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAudioPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select a valid audio file');
    }
  }, []);

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

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setProcessing(true);
    setError('');
    setConvertedFile(null);

    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Read the file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create offline context for rendering
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      // Create buffer source
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      // Render the audio
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to the desired format
      const blob = await audioBufferToBlob(renderedBuffer, outputFormat);
      
      const originalExtension = file.name.split('.').pop();
      const fileName = file.name.replace(`.${originalExtension}`, `.${outputFormat}`);
      
      setConvertedFile({
        name: fileName,
        blob: blob,
        size: blob.size,
        url: URL.createObjectURL(blob)
      });

    } catch (err) {
      console.error('Conversion error:', err);
      setError('Error converting audio. The format might not be supported by your browser.');
    } finally {
      setProcessing(false);
    }
  };

  // Convert AudioBuffer to Blob
  const audioBufferToBlob = async (audioBuffer, format) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    
    if (format === 'wav') {
      return audioBufferToWavBlob(audioBuffer);
    }
    
    // For other formats, we'll use MediaRecorder API
    return new Promise((resolve, reject) => {
      // Create a new audio context and source
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Create media stream destination
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: getMimeType(format),
        audioBitsPerSecond: 128000
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: getMimeType(format) });
        resolve(blob);
      };
      
      mediaRecorder.onerror = reject;
      
      mediaRecorder.start();
      source.start();
      
      // Stop recording after the audio duration
      setTimeout(() => {
        source.stop();
        mediaRecorder.stop();
      }, (length / sampleRate) * 1000 + 100);
    });
  };

  // Convert AudioBuffer to WAV Blob (manual implementation)
  const audioBufferToWavBlob = (audioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const getMimeType = (format) => {
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      webm: 'audio/webm',
      m4a: 'audio/mp4'
    };
    return mimeTypes[format] || 'audio/mpeg';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-6">
          <i className="fas fa-exchange-alt text-2xl text-purple-400"></i>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Audio Converter
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Convert audio files between different formats. Process files entirely in your browser.
        </p>
      </div>

      {/* Main Tool */}
      <Card className="glassmorphism">
        <CardContent className="p-6 space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="audio-file" className="text-base font-medium">
              Select Audio File
            </Label>
            <Input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {file && (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Selected: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          {/* Audio Preview */}
          {audioPreview && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Audio Preview</Label>
              <Card className="bg-slate-50 dark:bg-slate-800/50">
                <CardContent className="p-4">
                  <audio
                    ref={audioRef}
                    src={audioPreview}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Output Format Selection */}
          {file && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{format.label}</span>
                        <span className="text-sm text-slate-500">{format.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <i className="fas fa-exclamation-triangle w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {file && (
            <Button
              onClick={handleConvert}
              disabled={processing}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              size="lg"
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2" />
                  Converting Audio...
                </>
              ) : (
                <>
                  <i className="fas fa-exchange-alt mr-2" />
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {convertedFile && (
        <Card className="glassmorphism">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-4">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conversion Complete!</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your audio has been converted successfully.
              </p>
            </div>
            
            {/* Converted Audio Preview */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Converted Audio</Label>
              <Card className="bg-slate-50 dark:bg-slate-800/50">
                <CardContent className="p-4 space-y-4">
                  <audio
                    src={convertedFile.url}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{convertedFile.name}</span>
                    <span>{formatFileSize(convertedFile.size)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <Button 
                onClick={() => downloadFile(convertedFile.blob, convertedFile.name)}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <i className="fas fa-download mr-2" />
                Download Converted Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-shield-alt text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold">Privacy First</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            All audio processing happens locally. Files never leave your device.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-play text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold">Preview & Play</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Listen to your audio before and after conversion.
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
            <i className="fas fa-cogs text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold">Multiple Formats</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Convert between MP3, WAV, OGG, WebM, and M4A formats.
          </p>
        </div>
      </div>
    </div>
  );
}