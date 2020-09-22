import React from 'react';
import { gql } from '@apollo/client';

import { createSummaryFragment } from '../../components/Summary/utils';
import PlatformApiProvider from '../../contexts/PlatformApiProvider';
import ProfileHeader from './ProfileHeader';

import sections from './sections';
import SummaryContainer from '../../components/Summary/SummaryContainer';
import SectionContainer from '../../components/Section/SectionContainer';

const PROFILE_SUMMARY_FRAGMENT = createSummaryFragment(sections, 'Target');
const PROFILE_QUERY = gql`
  query ProfileQuery($ensgId: String!) {
    target(ensemblId: $ensgId) {
      id
      ...TargetProfileHeaderFragment
      ...TargetProfileSummaryFragment
    }
  }
  ${ProfileHeader.fragments.profileHeader}
  ${PROFILE_SUMMARY_FRAGMENT}
`;

function Profile({ match }) {
  const { ensgId } = match.params;

  return (
    <PlatformApiProvider
      entity="target"
      query={PROFILE_QUERY}
      variables={{ ensgId }}
    >
      <ProfileHeader />

      <SummaryContainer>
        {sections.map(({ Summary, definition }) => (
          <Summary
            key={definition.id}
            ensgId={ensgId}
            definition={definition}
          />
        ))}
      </SummaryContainer>

      <SectionContainer>
        {sections.map(({ Body, definition }) => (
          <Body key={definition.id} ensgId={ensgId} definition={definition} />
        ))}
      </SectionContainer>
    </PlatformApiProvider>
  );
}

export default Profile;
