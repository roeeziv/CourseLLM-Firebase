const React = require('react');

const createIcon = (name) => {
  const Icon = React.forwardRef((props, ref) => {
    return React.createElement('svg', { ...props, ref, 'data-testid': `${name}-icon` }, name);
  });
  Icon.displayName = name;
  return Icon;
};

module.exports = {
  // Existing icons
  Upload: createIcon('Upload'),
  MoreVertical: createIcon('MoreVertical'),
  Trash2: createIcon('Trash2'),
  FileText: createIcon('FileText'),
  File: createIcon('File'),
  Presentation: createIcon('Presentation'),

  // ADD THESE MISSING ICONS:
  FileImage: createIcon('FileImage'),
  FileArchive: createIcon('FileArchive'),
  FileAudio: createIcon('FileAudio'),
  FileVideo: createIcon('FileVideo'),
};