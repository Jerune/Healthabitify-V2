import { SettingsViewProps } from '../_types';

function SettingsViewSelection({ setDetailView }: SettingsViewProps) {
  return (
    <div className='w-full h-full grow flex flex-col justify-center md:flex-row items-center gap-12'>
      <button
        type='button'
        className='h-24 w-52 rounded-lg border-solid border-2 text-lg bg-white hover:bg-palette-600 hover:italic hover:font-bold hover:border-0 hover:text-2xl hover:transition-colors hover:text-white hover:underline hover:underline-offset-4c cursor-pointer'
        onClick={() => setDetailView('metrics')}
      >
        Metrics
      </button>
      <button
        type='button'
        className='h-24 w-52 rounded-lg border-solid border-2 text-lg bg-white hover:bg-palette-600 hover:italic hover:font-bold hover:border-0 hover:text-xl hover:transition-colors hover:text-white hover:underline hover:underline-offset-4 cursor-pointer'
        onClick={() => setDetailView('wearables')}
      >
        Wearables
      </button>
    </div>
  );
}

export default SettingsViewSelection;
