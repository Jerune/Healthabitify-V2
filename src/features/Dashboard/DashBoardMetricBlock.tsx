import Link from 'next/link';

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
    <Link href={`/metrics/${metric.categoryId}`}>
      <article
        className={`flex flex-col rounded-full justify-between py-12 px-10 w-72 h-72 shadow-2xl border border-black ${bgColorClass}`}
      >
        <div className='text-black flex flex-row justify-center items-center'>
          <i className='text-2xl mr-2'>
            <Icon iconId={metric.categoryIcon} />
          </i>
          <h2 className='flex justify-center text-md'>{metric.name}</h2>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <div className='flex flex-row justify-center items-center text-6xl'>
            {adjustValueOutput(metric, metric.value)}
            <span className='text-lg pt-8'>{metric.unit}</span>
          </div>
          <p className='flex flex-row gap-x-2 items-center text-center m-0 text-sm'>
            <Icon iconId='GiGoalKeeper' />
            {metric.conditionsMode === 'range' && metric.goal}
            {metric.conditionsMode === 'higher' && 'Higher is Better'}
            {metric.conditionsMode === 'lower' && 'Lower is Better'}
          </p>
        </div>
        <p className='flex flex-row justify-center items-center gap-x-2 m-0 text-sm italic'>
          <Difference metric={metric} />
        </p>
      </article>
    </Link>
  );
}

export default DashBoardMetricBlock;
