import FhirConfigPanel from './Panels/FhirConfigPanel';
import FhirCastPanel from './Panels/FhirCastPanel';

function getPanelModule({ servicesManager, commandsManager }) {
  return [
    {
      name: 'fhirConfig',
      iconName: 'tab-patient-info',
      iconLabel: 'FHIR',
      label: 'FHIR',
      component: FhirConfigPanel,
    },
    {
      name: 'fhirCast',
      iconName: 'tab-linear',
      iconLabel: 'FHIRCast',
      label: 'FHIRCast',
      component: FhirCastPanel,
    },
  ];
}

export default getPanelModule;
