import classNames from 'classnames';
import { useField } from 'formik';

const Textarea = ({
  label,
  name,
  placeholder,
  helperText,
  rows = 4,
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        {...field}
        {...props}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={classNames(
          'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none',
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
        )}
      />
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
