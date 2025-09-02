import Icon from '../../../components/icon';
import categoriesList from '../../../data/categoriesMock';
import wearablesCategories from '../../../data/wearablesCategories';
import { SettingsCategoryProps } from '../../_types';

function CategoriesMenu({
  detailView,
  setMetrics,
  setWearables,
  activeCategory,
  hideMenuCategories,
  setHideMenuCategories,
}: SettingsCategoryProps) {
  const hideMenuOnMobile = hideMenuCategories ? 'hidden' : 'flex flex-col';
  const dataSource =
    detailView === 'wearables' ? wearablesCategories : categoriesList;

  const categories = dataSource.map(category => {
    return (
      <button
        className={`w-full flex flex-row gap-2 justify-start items-center text-xl p-8 rounded-lg shadow-lg  hover:bg-palette-600 hover:text-2xl hover:italic hover:text-white hover:transition-colors hover:underline cursor-pointer ${
          activeCategory.id === category.id
            ? 'bg-palette-600 italic text-white'
            : 'bg-white'
        }`}
        type='button'
        key={category.name}
        onClick={() => {
          if (detailView === 'metrics') {
            setMetrics(category.id);
            setHideMenuCategories(true);
          } else {
            setWearables(category.id);
            setHideMenuCategories(true);
          }
        }}
      >
        <i>
          <Icon iconId={category.iconName} />
        </i>
        <h2 className='text-2xl font-normal'>{category.name}</h2>
      </button>
    );
  });

  return (
    <section
      className={`md:flex md:flex-col gap-4 md:w-72 lg:w-96 pb-4 mb-8 ${hideMenuOnMobile}`}
    >
      {categories}
    </section>
  );
}

export default CategoriesMenu;
