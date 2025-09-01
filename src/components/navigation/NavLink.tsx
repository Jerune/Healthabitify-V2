import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { toggleMenu } from '../../redux/reducers/utilsReducer';
import { Category } from '../../types';
import Icon from '../icon';

function NavLink({ category }: { category: Category }) {
  const dispatch = useDispatch();
  return (
    <Link
      href={`/data/${category.name.toLowerCase()}`}
      key={category.name}
      className='flex flex-row items-center gap-3 py-2'
      onClick={() => dispatch(toggleMenu())}
    >
      <button type='button' className='text-2xl'>
        <Icon iconId={category.iconName} />
      </button>
      <span className='text-xl'>{category.name}</span>
    </Link>
  );
}

export default NavLink;
