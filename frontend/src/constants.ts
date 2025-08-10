export const screenWidth = 1920;
export const screenHeight = 1080;

export const slotsKey = ['cl', 'ic', 'mk', 'sw', 'bk'];
export const slotsKey2 = ['sw', 'ic', 'bk', 'cl'];

export const reel = {
  width: 290,
  height: 680,
  reelsCount: 4,
  slotsCount: 5,
  speed: 10,
  slotSize: 220,
  reelOffset: 5,
};

export const machine = {
  width: 1180,
  height: 600,
  stopDelay: 1000,
  reelStopDelay: 500,
};

export const payTable = {
  payTableWidth: 800,
  payTableHeight: 600,
};

export const hud = {
  width: 1287,
  height: 80,
};

export const EVENTS = {
  SPIN: {
    KEY: 'spin',
    START: 'start',
    STOP: 'stop',
  },
  DISABLESPIN: {
    KEY: 'disableSpin',
    TRUE: 'true',
    FALSE: 'false',
  },
  SOUND: {
    KEY: 'sound',
    ON: 'on',
    OFF: 'off',
  },
  HUDVISIBILITY: {
    KEY: 'hudVisibility',
    TRUE: 'true',
    FALSE: 'false',
  },
  DISABLEHUDBUTTONS: {
    KEY: 'disableHudButtons',
    TRUE: 'true',
    FALSE: 'false',
  },
  ANIMATION: {
    KEY: 'visibility',
    TRUE: 'true',
    FALSE: 'false',
  },
  DISABLEBETBUTTON: {
    KEY: 'betButton',
    TRUE: 'true',
    FALSE: 'false',
  },
  DISABLEINFOBUTTON: {
    KEY: 'infoButton',
    TRUE: 'true',
    FALSE: 'false',
  },
  UPDATEBETBUTTONSTATES: {
    KEY: 'updateBetButtonStates',
    TRUE: 'true',
    FALSE: 'false',
  },
};
