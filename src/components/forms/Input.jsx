import classNames from 'classnames';
import { useField } from 'formik';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  helperText,
  leftIcon,
  rightIcon,
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
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-icons-outlined text-lg">{leftIcon}</span>
          </span>
        )}
        <input
          {...field}
          {...props}
          id={name}
          type={type}
          placeholder={placeholder}
          className={classNames(
            'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200',
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-transparent',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10'
          )}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-icons-outlined text-lg">{rightIcon}</span>
          </span>
        )}
      </div>
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
