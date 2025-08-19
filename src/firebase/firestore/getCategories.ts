import { collection, getDocs } from 'firebase/firestore';

import type { Category } from '../../types';
import { db } from '../firebase';

async function getCategories() {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  const categoryList: Category[] = [];
  querySnapshot.forEach(doc => {
    const { id } = doc;
    const { iconName, order, name } = doc.data();
    const data = { id, iconName, order, name };
    categoryList.push(data);
  });

  const sortedCategories = categoryList.sort((a, b) => {
    return a.order - b.order;
  });

  return sortedCategories;
}

export default getCategories;
