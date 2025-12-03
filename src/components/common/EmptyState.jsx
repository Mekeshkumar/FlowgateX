import classNames from 'classnames';

const EmptyState = ({
  icon = 'inbox',
  title = 'No data found',
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <span className="material-icons-outlined text-6xl text-gray-300 mb-4">
        {icon}
      </span>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
