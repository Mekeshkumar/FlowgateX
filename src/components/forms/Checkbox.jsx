import classNames from 'classnames';
import { useField } from 'formik';

const Checkbox = ({ label, name, className = '', ...props }) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;

  return (
    <div className={classNames('mb-4', className)}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          {...field}
          {...props}
          type="checkbox"
          className={classNames(
            'w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors',
            hasError && 'border-red-500'
          )}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};

export default Checkbox;
