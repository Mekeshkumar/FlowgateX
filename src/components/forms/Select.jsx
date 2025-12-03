import classNames from 'classnames';
import { useField } from 'formik';

const Select = ({
  label,
  name,
  options = [],
  placeholder = 'Select an option',
  helperText,
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
      <div className="relative">
        <select
          {...field}
          {...props}
          id={name}
          className={classNames(
            'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white',
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="material-icons text-gray-400">expand_more</span>
        </span>
      </div>
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
