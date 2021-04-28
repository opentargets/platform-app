import React, { useState, useEffect } from 'react';

import productionClient from '../client';

const PlatformApiContext = React.createContext();

function PlatformApiProvider({
  entity,
  query,
  client = productionClient,
  variables,
  children,
}) {
  const [data, setData] = useState();
  const [extData, setExtData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let isCurrent = true;
    client
      .query({
        query,
        variables,
      })
      .then(({ data }) => {
        if (isCurrent) {
          setLoading(false);
          setData(data);
        }
      })
      .catch(err => {
        if (isCurrent) {
          setLoading(false);
          setError(err);
        }
      });

    return () => (isCurrent = false);
  }, []);

  function setExternalData(sectionData, section) {
    // console.log('entity', entity);
    // console.log('section', section);
    // console.log('sectionData', sectionData);
    // console.log('data LOL', data);

    // console.log('newData', newData);
    setExtData({
      ...extData,
      [section]: sectionData,
    });
  }

  return (
    <PlatformApiContext.Provider
      value={{ data, loading, error, entity, extData, setExternalData }}
    >
      {children}
    </PlatformApiContext.Provider>
  );
}

export default PlatformApiProvider;
export { PlatformApiContext };
