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
  splitName = false,
  firstNamePlaceholder = 'First Name',
  lastNamePlaceholder = 'Last Name',
  ...props
}) => {
  const [field, meta] = useField(name);
  const [firstField, firstMeta] = useField(`firstName`);
  const [lastField, lastMeta] = useField(`lastName`);

  const hasError = meta.touched && meta.error;
  const firstHasError = firstMeta?.touched && firstMeta?.error;
  const lastHasError = lastMeta?.touched && lastMeta?.error;

  // If splitName is true, split the name field into first and last name
  if (splitName) {
    return (
      <div className={classNames('mb-4 grid grid-cols-2 gap-3', className)}>
        {/* First Name Input */}
        <div>
          {label && (
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-icons-outlined text-lg">{leftIcon}</span>
              </span>
            )}
            <input
              {...firstField}
              {...props}
              id="firstName"
              type="text"
              placeholder={firstNamePlaceholder}
              className={classNames(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200',
                firstHasError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-transparent',
                leftIcon && 'pl-10'
              )}
            />
          </div>
          {firstHasError && <p className="mt-1 text-sm text-red-500">{firstMeta.error}</p>}
        </div>

        {/* Last Name Input */}
        <div>
          {label && (
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
          )}
          <div className="relative">
            <input
              {...lastField}
              {...props}
              id="lastName"
              type="text"
              placeholder={lastNamePlaceholder}
              className={classNames(
                'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200',
                lastHasError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-transparent',
                rightIcon && 'pr-10'
              )}
            />
            {rightIcon && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="material-icons-outlined text-lg">{rightIcon}</span>
              </span>
            )}
          </div>
          {lastHasError && <p className="mt-1 text-sm text-red-500">{lastMeta.error}</p>}
        </div>
      </div>
    );
  }

  // Default single input behavior
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
