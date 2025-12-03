import { useEffect, useRef } from 'react';
import classNames from 'classnames';

const AnalyticsChart = ({
  type = 'line',
  data,
  options = {},
  height = 350,
  className = '',
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !window.ApexCharts) return;

    const defaultOptions = {
      chart: {
        type,
        height,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
        fontFamily: 'Inter, sans-serif',
      },
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      xaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12px',
        fontWeight: 500,
        markers: {
          radius: 2,
        },
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
        },
      },
      ...options,
    };

    const chartOptions = {
      ...defaultOptions,
      ...data,
    };

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new window.ApexCharts(chartRef.current, chartOptions);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, height, options]);

  return (
    <div className={classNames('w-full', className)}>
      <div ref={chartRef} />
    </div>
  );
};

export default AnalyticsChart;
