import { GameObjects, Utils } from 'phaser';

export default class Slot extends GameObjects.Sprite {
  private slotKeys: Array<string>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    slotKeys: string[],
    slot = null
  ) {
    super(scene, x, y, 'mk');
    this.slotKeys = slotKeys;
    this.init(slot);
  }

  public init(slot: string | null): void {
    this.setOrigin(0.5, 1);
    this.setScale(0.8);
    this.update(slot);
  }

  public update(slot: string | undefined | null): string {
    if (!slot) slot = Utils.Array.GetRandom(this.slotKeys);
    this.setTexture(slot).setScale(1.3);
    return slot;
  }
}
