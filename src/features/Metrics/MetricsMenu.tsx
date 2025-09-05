import { MetricsMenuProps } from '../_types';

function MetricsMenu({ metrics, setMetric, activeMetric }: MetricsMenuProps) {
  const activeMetrics = metrics.map(metric => {
    return (
      <button
        className={`w-full flex flex-row gap-2 justify-center items-center p-6 border border-gray-300 shadow-lg  hover:bg-palette-600 hover:text-white hover:transition-colors hover:underline cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap ${
          activeMetric.id === metric.id
            ? 'bg-palette-600 italic text-white underline'
            : 'bg-white'
        }`}
        type='button'
        key={metric.name}
        onClick={() => {
          setMetric(metric);
        }}
      >
        <h2 className='text-lg font-normal'>{metric.name}</h2>
      </button>
    );
  });

  return (
    <section className='flex gap-4 w-full px-8 pb-6 bg-gray-50'>
      {activeMetrics}
    </section>
  );
}

export default MetricsMenu;
