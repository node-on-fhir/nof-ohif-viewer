import { chestBodyPart } from './hps/chestBodyPart';
import { xrOneUp } from './hps/xrOneUp';

function getHangingProtocolModule() {
  return [
    {
      name: chestBodyPart.id,
      protocol: chestBodyPart,
    },
    {
      name: xrOneUp.id,
      protocol: xrOneUp,
    },
  ];
}

export default getHangingProtocolModule;
