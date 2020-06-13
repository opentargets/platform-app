import React from 'react';

const Summary = ({ data }) => {
  const numActive = data.reduce((acc, project) => {
    return project.status === 'Active' ? acc + 1 : acc;
  }, 0);

  const numClosed = data.reduce((acc, project) => {
    return project.status === 'Closed' ? acc + 1 : acc;
  }, 0);
  return (
    <>
      <span>{numActive} active projects</span>
      <br />
      <span>{numClosed} closed projects</span>
    </>
  );
};

export default Summary;
