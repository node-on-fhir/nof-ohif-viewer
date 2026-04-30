import { Types } from '@ohif/core';

export const xrOneUp: Types.HangingProtocol.Protocol = {
  id: 'xrOneUp',
  name: 'XR 1-Up',
  description: '1x1 single viewport layout for X-ray (CR/DX) studies',
  toolGroupIds: ['default'],
  protocolMatchingRules: [
    {
      attribute: 'isXrayModality',
      constraint: {
        equals: { value: 'XR' },
      },
      weight: 20,
    },
  ],
  displaySetSelectors: {
    anyDisplaySet: {
      seriesMatchingRules: [],
    },
  },
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
      allowUnmatchedView: true,
    },
    displaySets: [
      {
        id: 'defaultDisplaySetId',
        matchedDisplaySetsIndex: -1,
      },
    ],
  },
  stages: [
    {
      name: 'xrOneUp',
      id: 'xrOneUp_1x1',
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 1,
          columns: 1,
        },
      },
      viewports: [
        {
          viewportOptions: {
            viewportId: 'xr-viewport-0',
            toolGroupId: 'default',
          },
          displaySets: [{ id: 'anyDisplaySet', matchedDisplaySetsIndex: 0 }],
        },
      ],
    },
  ],
};
