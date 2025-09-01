'use client';

import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import categoriesList from '../../data/categoriesMock';
import wearablesCategories from '../../data/wearablesCategories';
import ActiveMetrics from '../../features/SettingsMenu/ActiveMetrics';
import SettingsContentField from '../../features/SettingsMenu/SettingsContentField';
import SettingsMenuCategories from '../../features/SettingsMenu/SettingsMenuCategories';
import SettingsMenuContainer from '../../features/SettingsMenu/SettingsMenuContainer';
import SettingsViewSelection from '../../features/SettingsMenu/SettingsViewSelection';
import WearableCard from '../../features/SettingsMenu/WearableCard';

function Settings() {
  const emptyCategory = {
    id: '',
    name: '',
    iconName: '',
  };

  const [detailView, setDetailView] = useState('none');
  const [activeCategory, setActiveCategory] = useState(emptyCategory);
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
        className='pl-1 mt-6 mb-4 flex flex-row items-center gap-2'
        onClick={() => {
          setActiveCategory(emptyCategory);
          setDetailView('none');
          setHideMenuCategories(false);
        }}
      >
        <IoIosArrowBack />
        <p className='flex flex-row items-center'>Back</p>
      </button>
      <SettingsMenuContainer>
        <SettingsMenuCategories
          detailView={detailView}
          setMetrics={setMetrics}
          setWearables={setWearables}
          activeCategory={activeCategory}
          hideMenuCategories={hideMenuCategories}
          setHideMenuCategories={setHideMenuCategories}
        />
        {hasAnActiveCategory && (
          <SettingsContentField>
            {detailView === 'metrics' ? (
              <ActiveMetrics activeCategory={activeCategory} />
            ) : (
              <WearableCard activeCategory={activeCategory} />
            )}
          </SettingsContentField>
        )}
      </SettingsMenuContainer>
    </>
  );
}

export default Settings;
