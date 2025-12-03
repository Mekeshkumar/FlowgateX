import classNames from 'classnames';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-600',
  className = '',
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-100',
  };

  const changeIcons = {
    positive: 'trending_up',
    negative: 'trending_down',
    neutral: 'remove',
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div
              className={classNames(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2',
                changeColors[changeType]
              )}
            >
              <span className="material-icons text-sm">
                {changeIcons[changeType]}
              </span>
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={classNames(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              iconBg
            )}
          >
            <span className={classNames('material-icons-outlined text-xl', iconColor)}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
