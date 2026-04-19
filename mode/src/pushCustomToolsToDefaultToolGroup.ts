export default function pushCustomToolsToDefaultToolGroup(
  extensionManager,
  toolGroupService,
  commandsManager
) {
  const toolGroupId = 'default';

  const tools = {
    active: [],
    passive: [
      {
        toolName: 'Text',
        configuration: {
          getTextCallback: (callback, eventDetails) => {
            commandsManager.runCommand('nof.textCallback', {
              callback,
              eventDetails,
            });
          },
          changeTextCallback: (data, eventDetails, callback) => {
            commandsManager.runCommand('nof.textCallback', {
              callback,
              data,
              eventDetails,
            });
          },
        },
      },
    ],
    enabled: [],
    disabled: [],
  };

  toolGroupService.addToolsToToolGroup(toolGroupId, tools);
}
