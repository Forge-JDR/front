import React from 'react';
import { useTranslation } from 'react-i18next';
import WikiEditor from '../../UI/organisms/wikiEditor/WikiEditor';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <WikiEditor/>
    </div>
  );
};

export default Home;