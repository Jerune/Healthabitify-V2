'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import SettingsMenuCategories from '../../../components/menus/CategoriesMenu';
import SettingsMenuContainer from '../../../components/menus/MenuContainer';
import SettingsContentField from '../../../components/menus/MenuContentField';
import categoriesList from '../../../data/categoriesMock';
import getActiveMetrics from '../../../features/DataGrid/getActiveMetrics';
import { useAppSelector } from '../../../redux/reduxHooks';

function MetricsPage() {
  const { category } = useParams();
  const title = category ? category[0] : '';
  const allMetrics = useAppSelector(state => state.metrics);
  // const allAverages = useAppSelector(state => state.averages);
  // const activeTimeView = useAppSelector(state => state.utils.activeTimeView);

  const emptyCategory = {
    id: '',
    name: '',
    iconName: '',
  };

  const [activeCategory, setActiveCategory] = useState(emptyCategory);
  const hasAnActiveCategory = activeCategory.id !== '';

  console.log(title, allMetrics);

  useEffect(() => {
    if (title !== '') {
      const activeMetrics = getActiveMetrics(allMetrics, title);
      setMetrics(activeMetrics[0].categoryId);
    }
  }, [allMetrics, title]);

  async function setMetrics(categoryId: string) {
    const activeCat = categoriesList.filter(
      category => category.id === categoryId
    )[0];
    setActiveCategory(activeCat);
  }

  return (
    <>
      <h1 className='block text-xl md:text-4xl'>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h1>
      <SettingsMenuContainer>
        <SettingsMenuCategories
          detailView='metrics'
          setMetrics={setMetrics}
          activeCategory={activeCategory}
        />
        {hasAnActiveCategory && (
          <SettingsContentField>
            {/* // Add data grid here */}
          </SettingsContentField>
        )}
      </SettingsMenuContainer>
    </>
  );
}

export default MetricsPage;
