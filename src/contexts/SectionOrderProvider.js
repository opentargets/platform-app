import React, { useState } from 'react';
import ls from 'local-storage';

import usePlatformApi from '../hooks/usePlatformApi';

const SectionOrderContext = React.createContext();

function SectionOrderProvider({ sections, children }) {
  const { data, entity } = usePlatformApi();
  const [sectionOrder, setSectionOrder] = useState(
    ls.get(`${entity}SectionsOrder`) ||
      sections.map(section => section.definition.id)
  );

  const updateSectionOrder = newSectionOrder => {
    setSectionOrder(newSectionOrder);
    ls.set(`${entity}SectionsOrder`, newSectionOrder);
  };

  const shouldRender = section => {
    const { hasData } = section.props.definition;
    return (data && hasData(data?.[entity])) || false;
  };

  return (
    <SectionOrderContext.Provider
      value={{ sectionOrder, updateSectionOrder, shouldRender }}
    >
      {children}
    </SectionOrderContext.Provider>
  );
}

export default SectionOrderProvider;
export { SectionOrderContext };
