import Icon from '../../components/icon';
import { DashboardMetricProps } from '../_types';
import adjustValueOutput from '../DataOutputManagement/adjustValueOutput';

import Difference from './Difference';

function DashBoardMetricBlock({ metric }: DashboardMetricProps) {
  let bgColorClass = '';

  switch (metric.comparisonStatus) {
    case 'good':
      bgColorClass = 'green-gradient';
      break;
    case 'medium':
      bgColorClass = 'orange-gradient';
      break;
    case 'bad':
      bgColorClass = 'red-gradient';
      break;
    case 'neutral':
      bgColorClass = 'lightgray';
      break;
    default:
      bgColorClass = 'lightgray';
      break;
  }

  return (
    <section
      className={`flex flex-col pb-6 w-64 h-72 shadow-2xl ${bgColorClass}`}
    >
      <div className='h-12 px-2 bg-black-opacity text-white flex flex-row justify-center items-center'>
        <i className='text-xl mr-2'>
          <Icon iconId={metric.categoryIcon} />
        </i>
        <h2 className='flex justify-center text-base'>{metric.name}</h2>
      </div>
      <div className='px-6 flex flex-col justify-center items-center grow'>
        <div className='flex flex-row justify-center items-center text-6xl'>
          {adjustValueOutput(metric, metric.value)}
          <span className='text-lg pt-8'>{metric.unit}</span>
        </div>
        <p className='flex flex-row gap-x-2 pt-1 items-center text-center m-0 text-sm'>
          <Icon iconId='GiGoalKeeper' />
          {metric.conditionsMode === 'range' && metric.goal}
          {metric.conditionsMode === 'higher' && 'Higher is Better'}
          {metric.conditionsMode === 'lower' && 'Lower is Better'}
        </p>
      </div>
      <p className='flex flex-row justify-center items-center gap-x-2 m-0 text-sm italic'>
        <Difference metric={metric} />
      </p>
    </section>
  );
}

export default DashBoardMetricBlock;
