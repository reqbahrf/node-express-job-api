import React from 'react';
import FileViewer from './FileViewer';

/**
 * Example usage of the FileViewer component.
 *
 * To use the FileViewer component, simply pass the fileId as a prop.
 * The component will handle fetching the file, displaying loading states,
 * error handling, and rendering the file based on its MIME type.
 */
const FileViewerExample: React.FC = () => {
  return (
    <div className='p-4'>
      <h2 className='mb-4 text-lg font-bold'>File Viewer Example</h2>
      <p className='mb-4'>
        Replace 'your-file-id-here' with an actual file ID from your backend.
      </p>

      {/* Example usage */}
      <FileViewer fileId='your-file-id-here' />

      {/* You can also use it in a conditional render or with dynamic fileId */}
      {/* <FileViewer fileId={selectedFileId} /> */}
    </div>
  );
};

export default FileViewerExample;
