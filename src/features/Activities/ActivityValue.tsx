import { IconMapping } from '../../components/_types';
import Icon from '../../components/icon';

export default function ActivityValue({
  iconName,
  value,
}: {
  iconName: keyof IconMapping;
  value: string;
  colSpan?: number;
}) {
  return (
    <div className='flex flex-row gap-2 justify-start items-center'>
      <Icon iconId={iconName} />
      <span>{value}</span>
    </div>
  );
}
