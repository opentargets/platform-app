// TODO: see if this can be done dynamically
// or try @babel/plugin-proposal-export-namespace-from (may need eject)

import * as bibliographyRaw from './sections/Bibliography';
import * as cancerBiomarkersRaw from './sections/CancerBiomarkers';
import * as hallmarksRaw from './sections/CancerHallmarks';
import * as chemicalProbesRaw from './sections/ChemicalProbes';
import * as knownDrugsRaw from './sections/KnownDrugs';
import * as expressionRaw from './sections/Expression';
import * as geneOntologyRaw from './sections/GeneOntology';
import * as comparativeGenomicsRaw from './sections/ComparativeGenomics';
import * as mousePhenotypesRaw from './sections/MousePhenotypes';
import * as pathwaysRaw from './sections/Pathways';
import * as proteinRaw from './sections/ProteinInformation';
// import * as proteinInteractionsRaw from './sections/ProteinInteractions';
import * as relatedTargetsRaw from './sections/RelatedTargets';
import * as safetyRaw from './sections/Safety';
import * as tepRaw from './sections/Tep';
import * as tractabilityRaw from './sections/Tractability';
import * as variationRaw from './sections/Variation';
import * as abcRaw from './sections/ABC';

export const bibliography = bibliographyRaw;
export const cancerBiomarkers = cancerBiomarkersRaw;
export const hallmarks = hallmarksRaw;
export const chemicalProbes = chemicalProbesRaw;
export const knownDrugs = knownDrugsRaw;
export const expression = expressionRaw;
export const geneOntology = geneOntologyRaw;
export const comparativeGenomics = comparativeGenomicsRaw;
export const mousePhenotypes = mousePhenotypesRaw;
export const pathways = pathwaysRaw;
export const protein = proteinRaw;
// export const proteinInteractions = proteinInteractionsRaw;
export const relatedTargets = relatedTargetsRaw;
export const safety = safetyRaw;
export const tep = tepRaw;
export const variation = variationRaw;
export const tractability = tractabilityRaw;
export const abc = abcRaw;
