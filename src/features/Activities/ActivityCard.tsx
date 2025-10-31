import { Activity } from '../../types';
import { getShortDate } from '../../utils/getDateTimeData';

import ActivityValue from './ActivityValue';

export default function ActivityCard(activity: Activity) {
  const {
    activityName,
    date,
    activeDuration,
    duration,
    calories,
    averageHeartRate,
    steps,
    cardioZone,
    peakZone,
    fatBurnZone,
  } = activity;

  return (
    <article
      className={`flex flex-col justify-between px-10 pt-6 pb-8 w-108 h-auto shadow-2xl bg-slate-100`}
    >
      <div className='flex flex-col gap-2 pb-4'>
        <span className='text-sm italic text-right font-bold'>
          {getShortDate(date)}
        </span>
        <h2 className='text-2xl font-bold leading-none'>
          {activityName.toUpperCase()}
        </h2>
      </div>
      <h3 className='text-sm inline-block border-b'>Physical Output</h3>
      <div className='text-black grid grid-cols-2 gap-2 pt-2 pb-4'>
        <ActivityValue iconName='RxTimer' value={`${duration} min`} />
        <ActivityValue iconName='RxLapTimer' value={`${activeDuration} min`} />
        <ActivityValue iconName='FaBurn' value={`${calories} cal`} />
        <ActivityValue iconName='IoFootstepsSharp' value={`${steps} steps`} />
      </div>
      <h3 className='text-sm inline-block border-b'>Intensity</h3>
      <div className='text-black grid grid-cols-3 gap-2 pt-2'>
        <div className='col-span-3'>
          <ActivityValue
            iconName='RiHeartPulseFill'
            value={`${averageHeartRate} bpm`}
          />
        </div>

        <ActivityValue iconName='GiFireZone' value={`${fatBurnZone} min`} />
        <ActivityValue
          iconName='GiBrokenHeartZone'
          value={`${cardioZone} min`}
        />
        <ActivityValue iconName='GiDeathZone' value={`${peakZone} min`} />
      </div>
    </article>
  );
}
