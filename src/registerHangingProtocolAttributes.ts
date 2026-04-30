import { DicomMetadataStore } from '@ohif/core';

export default function registerHangingProtocolAttributes({ servicesManager }) {
  const { hangingProtocolService } = servicesManager.services;

  hangingProtocolService.addCustomAttribute('BodyPartExamined', 'BodyPartExamined', study => {
    const seriesUID = study?.series?.[0]?.SeriesInstanceUID;
    if (!seriesUID) return undefined;

    const seriesData = DicomMetadataStore.getSeries(study.StudyInstanceUID, seriesUID);
    if (!seriesData?.instances?.length) return undefined;

    return seriesData.instances[0]?.BodyPartExamined;
  });

  hangingProtocolService.addCustomAttribute('isXrayModality', 'Is XR Modality', (study) => {
    const xrayCodes = ['CR', 'DX', 'XR'];
    const { displaySetService } = servicesManager.services;
    const activeDisplaySets = displaySetService.getActiveDisplaySets();

    // Debug: log what display sets are available
    console.log('[isXrayModality] study:', study?.StudyInstanceUID,
      'activeDisplaySets:', activeDisplaySets.length,
      'modalities:', activeDisplaySets.map(ds => ds.Modality));

    // Check active display sets — uses displaySetService directly
    // rather than relying on options threading through ProtocolEngine/HPMatcher
    for (const ds of activeDisplaySets) {
      if (ds.StudyInstanceUID === study?.StudyInstanceUID) {
        const mod = (ds.Modality || '').trim();
        if (xrayCodes.includes(mod)) {
          console.log('[isXrayModality] → XR (from displaySet, Modality:', mod, ')');
          return 'XR';
        }
      }
    }

    // Fallback: check DicomMetadataStore series data
    const seriesUID = study?.series?.[0]?.SeriesInstanceUID;
    if (seriesUID) {
      const seriesData = DicomMetadataStore.getSeries(study.StudyInstanceUID, seriesUID);
      if (seriesData) {
        const seriesMod = (seriesData.Modality || '').trim();
        const instMod = (seriesData.instances?.[0]?.Modality || '').trim();
        if (xrayCodes.includes(seriesMod) || xrayCodes.includes(instMod)) {
          console.log('[isXrayModality] → XR (from DicomMetadataStore)');
          return 'XR';
        }
      }
    }

    console.log('[isXrayModality] → undefined (no XR modality found)');
    return undefined;
  });
}
