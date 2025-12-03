import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Badge } from '@components/common';
import dayjs from 'dayjs';

const EventCard = ({ event, variant = 'default', className = '' }) => {
  const {
    id,
    title,
    description,
    image,
    date,
    time,
    location,
    price,
    category,
    attendees,
    capacity,
    isFeatured,
  } = event;

  const isCompact = variant === 'compact';
  const isFull = variant === 'full';

  const formattedDate = dayjs(date).format('MMM D, YYYY');
  const formattedTime = dayjs(`${date} ${time}`).format('h:mm A');
  const spotsLeft = capacity - (attendees || 0);
  const isSoldOut = spotsLeft <= 0;

  return (
    <Link
      to={`/events/${id}`}
      className={classNames(
        'group block bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200',
        isCompact && 'flex',
        className
      )}
    >
      {/* Image */}
      <div
        className={classNames(
          'relative overflow-hidden',
          isCompact ? 'w-32 h-32 flex-shrink-0' : 'aspect-video'
        )}
      >
        <img
          src={image || '/placeholder-event.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning" size="sm">
              <span className="material-icons text-xs mr-1">star</span>
              Featured
            </Badge>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={classNames('p-4', isCompact && 'flex-1')}>
        {/* Category */}
        <Badge variant="primary" size="sm" className="mb-2">
          {category}
        </Badge>

        {/* Title */}
        <h3 className={classNames(
          'font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2',
          isCompact ? 'text-sm' : 'text-lg mb-2'
        )}>
          {title}
        </h3>

        {/* Description (only on full variant) */}
        {isFull && description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{description}</p>
        )}

        {/* Event Details */}
        <div className={classNames('space-y-1', isCompact ? 'mt-1' : 'mt-3')}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="material-icons-outlined text-base">calendar_today</span>
            <span>{formattedDate}</span>
            {!isCompact && (
              <>
                <span className="text-gray-300">•</span>
                <span>{formattedTime}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="material-icons-outlined text-base">location_on</span>
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Footer */}
        {!isCompact && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <span className="material-icons-outlined text-gray-400 text-base">group</span>
              <span className="text-sm text-gray-500">
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out'}
              </span>
            </div>
            <div className="text-right">
              {price === 0 ? (
                <span className="text-green-600 font-semibold">Free</span>
              ) : (
                <span className="text-gray-900 font-semibold">${price}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
