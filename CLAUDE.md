# CLAUDE.md — @ohif/extension-awatson1978-ohif-viewer

## Project Overview

This is a consolidated OHIF Viewer extension that provides custom viewport commands, ECG waveform rendering, a FHIR R4 data source, hanging protocols, panels, and a minimal layout template. It lives at `Viewers/extensions/ohif-viewer/` inside the OHIF monorepo.

The extension ships with a companion mode (`awatson1978`) bundled in the `mode/` directory.

## Setup

```bash
node scripts/setup.js   # copies mode + patches pluginConfig.json
cd ../..                 # back to Viewers root
yarn install             # link workspace packages
yarn dev                 # start dev server
```

## Manual Setup (fallback)

If the setup script doesn't work, do it by hand:

1. Copy `extensions/ohif-viewer/mode/` → `modes/awatson1978/`
2. Edit `platform/app/pluginConfig.json`:
   - Add to `extensions` array: `{ "packageName": "@ohif/extension-awatson1978-ohif-viewer", "version": "0.0.1" }`
   - Add to `modes` array: `{ "packageName": "awatson1978" }`
3. Run `yarn install` from Viewers root

## Key Identifiers

| What | Value |
|---|---|
| Extension package name | `@ohif/extension-awatson1978-ohif-viewer` |
| Extension ID | read from `package.json` name field via `src/id.js` |
| Mode package name | `awatson1978` |
| Mode route | `/awatson1978` |
| Command prefix | `awatson1978.` (e.g. `awatson1978.logViewportData`) |
| Toolbar button prefix | `awatson1978-ohif-viewer.` |

## Architecture Notes

- **Entry point**: `src/index.tsx` — default export is the extension object with `preRegistration`, `onModeEnter`, and 8 `get*Module` methods
- **ID derivation**: `src/id.js` reads `name` from `package.json`; also exports `SOPClassHandlerId`
- **Commands**: `src/commandsModule.ts` — defines actions and command definitions keyed by `awatson1978.*` names
- **ECG viewport**: `src/viewports/EcgViewport.tsx` — lazy-loaded React component using `dcmjs-ecg`
- **SOP class handler**: `src/getSopClassHandlerModule.js` — maps 7 ECG SOP class UIDs to a display set builder
- **FHIR data source**: `src/FhirDataSource/` — `fhirClient.js` (API calls), `fhirToOhif.js` (resource mapping), `smartAuth.js` (SMART on FHIR), `dicomLoader.js` (instance fetching)
- **Hanging protocols**: `src/hps/chestBodyPart.ts`
- **Panels**: `src/Panels/FhirConfigPanel.tsx`
- **Layout**: `src/MinimalViewerLayout.tsx`
- **Toolbar buttons**: `src/toolbarButtons.ts` — defines buttons registered in `onModeEnter`
- **Customizations**: `src/getCustomizationModule.ts` — right-click context menu

The companion mode at `mode/src/index.tsx` wires everything together: it imports from `@ohif/mode-longitudinal` for base tool groups and toolbar buttons, then overlays custom toolbar sections and registers the extension's ECG viewport/SOP handler.

## Common Tasks

**Add a new command**
1. Add an action function in `src/commandsModule.ts` under `actions`
2. Add a definition entry in `definitions` with key `awatson1978.<commandName>`
3. If it needs a toolbar button, add it in `src/toolbarButtons.ts`
4. Register the button in the mode's `onModeEnter` toolbar sections

**Add a new panel**
1. Create a React component in `src/Panels/`
2. Return it from `src/getPanelModule.tsx` with a `name` key
3. Reference it in the mode's route layout template (`mode/src/index.tsx`)

**Add a new hanging protocol**
1. Create the protocol object in `src/hps/`
2. Add it to the array returned by `src/getHangingProtocolModule.ts`
3. Reference the protocol name in the mode's `hangingProtocol` array

**Add a new SOP class handler**
1. Add the SOP class UID(s) to `src/getSopClassHandlerModule.js`
2. If it needs a custom viewport, create one in `src/viewports/` and register it in `src/index.tsx`
