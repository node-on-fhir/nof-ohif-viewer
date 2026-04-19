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
            commandsManager.runCommand('awatson1978.textCallback', {
              callback,
              eventDetails,
            });
          },
          changeTextCallback: (data, eventDetails, callback) => {
            commandsManager.runCommand('awatson1978.textCallback', {
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
