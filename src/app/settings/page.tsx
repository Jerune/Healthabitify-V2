'use client';

import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import { CategoryData, WearablesData } from '../../components/_types';
import categoriesList from '../../data/categoriesMock';
import wearablesCategories from '../../data/wearablesCategories';
import ActiveMetrics from '../../features/SettingsMenu/ActiveMetrics';
import CategoriesMenu from '../../features/SettingsMenu/menus/CategoriesMenu';
import MenuContainer from '../../features/SettingsMenu/menus/MenuContainer';
import MenuContentField from '../../features/SettingsMenu/menus/MenuContentField';
import SettingsViewSelection from '../../features/SettingsMenu/SettingsViewSelection';
import WearableCard from '../../features/SettingsMenu/WearableCard';

function Settings() {
  const emptyCategory: CategoryData = {
    id: '',
    name: '',
    iconName: '',
  };

  const [detailView, setDetailView] = useState('none');
  const [activeCategory, setActiveCategory] = useState<
    CategoryData | WearablesData
  >(emptyCategory);
  const [hideMenuCategories, setHideMenuCategories] = useState(false);

  const hasAnActiveCategory = activeCategory.id !== '';

  async function setMetrics(categoryId: string) {
    const activeCat = categoriesList.filter(
      category => category.id === categoryId
    )[0];
    setActiveCategory(activeCat);
    setDetailView('metrics');
  }

  async function setWearables(categoryId: string) {
    const activeCat = wearablesCategories.filter(
      category => category.id === categoryId
    )[0];
    setActiveCategory(activeCat);
    setDetailView('wearables');
  }

  if (detailView === 'none') {
    return <SettingsViewSelection setDetailView={setDetailView} />;
  }

  return (
    <>
      <button
        type='button'
        className='pl-1 mt-6 mb-4 flex flex-row items-center gap-2 cursor-pointer'
        onClick={() => {
          setActiveCategory(emptyCategory);
          setDetailView('none');
          setHideMenuCategories(false);
        }}
      >
        <IoIosArrowBack />
        <p className='flex flex-row items-center'>Back</p>
      </button>
      <MenuContainer>
        <CategoriesMenu
          detailView={detailView}
          setMetrics={setMetrics}
          setWearables={setWearables}
          activeCategory={activeCategory}
          hideMenuCategories={hideMenuCategories}
          setHideMenuCategories={setHideMenuCategories}
        />
        {hasAnActiveCategory && (
          <MenuContentField>
            {detailView === 'metrics' ? (
              <ActiveMetrics activeCategory={activeCategory} />
            ) : (
              <WearableCard activeCategory={activeCategory} />
            )}
          </MenuContentField>
        )}
      </MenuContainer>
    </>
  );
}

export default Settings;
