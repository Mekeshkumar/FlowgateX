import { useState } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

const FileUpload = ({
  label,
  name,
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  helperText,
  className = '',
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasError = meta.touched && meta.error;

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > maxSize) {
        helpers.setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }
      helpers.setValue(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={classNames(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : hasError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        )}
      >
        <input
          {...props}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600">{field.value?.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="material-icons-outlined text-4xl text-gray-400 mb-2">
              cloud_upload
            </span>
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-primary-600 font-medium">Click to upload</span> or drag
              and drop
            </p>
            <p className="text-xs text-gray-400">
              {accept.replace(/,/g, ', ')} (Max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FileUpload;
