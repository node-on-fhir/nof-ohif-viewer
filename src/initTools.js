import { LabelTool, WindowLevelTool, addTool, annotation } from '@cornerstonejs/tools';
import { getEnabledElement, VolumeViewport } from '@cornerstonejs/core';

/**
 * Initialize custom tools for the extension
 */
export default function initTools() {
  addTool(LabelTool);

  // Patch WindowLevelTool to gracefully handle viewports without loaded image data.
  // Without this, dragging before the image finishes loading throws
  // "Viewport is not a valid type" because voiRange is undefined.
  const originalMouseDragCallback = WindowLevelTool.prototype.mouseDragCallback;
  WindowLevelTool.prototype.mouseDragCallback = function (evt) {
    const { element } = evt.detail;
    const enabledElement = getEnabledElement(element);
    if (!enabledElement?.viewport) {
      return;
    }
    const properties = enabledElement.viewport.getProperties();
    if (!(enabledElement.viewport instanceof VolumeViewport) && !properties?.voiRange) {
      return;
    }
    originalMouseDragCallback.call(this, evt);
  };

  const annotationStyle = {
    textBoxFontSize: '15px',
    lineWidth: '1.5',
  };

  const defaultStyles = annotation.config.style.getDefaultToolStyles();
  annotation.config.style.setDefaultToolStyles({
    global: {
      ...defaultStyles.global,
      ...annotationStyle,
    },
  });
}

export const toolNames = {
  Text: LabelTool.toolName,
};
