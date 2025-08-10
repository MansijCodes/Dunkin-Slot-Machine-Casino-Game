import { machine, reel } from '../constants';
import Slot from './Slot';

export default class Reel extends Phaser.GameObjects.Container {
  private updatedSlotCount: number;
  private rotating: Phaser.Time.TimerEvent;
  private slowdown: boolean;
  public results: Array<string>;
  public slots: Array<Slot>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    slotKeys: Array<string>
  ) {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    scene.add.existing(this);

    this.createMask(scene);
    this.updatedSlotCount = 0;
    this.results = [];
    this.slots = [];
    this.fillWithSlots(slotKeys);
  }

  private createMask(scene: Phaser.Scene): void {
    let shape = scene.make.graphics();
    shape.fillRect(this.x, this.y, machine.width, machine.height + 80);
    let mask = shape.createGeometryMask();
    this.setMask(mask);
  }

  public fillWithSlots(slotKeys: Array<string>): void {
    let x = reel.width / 2;
    let y = reel.slotSize;
    for (let i = 0; i < reel.slotsCount; i++) {
      const slot = new Slot(this.scene, x, y * i, slotKeys);
      this.add(slot);
      this.slots.push(slot);
    }
  }

  public startSpin(): void {
    this.rotating = this.scene.time.addEvent({
      delay: 5,
      callback: this.spin,
      callbackScope: this,
      loop: true,
    });
  }
  private spin(): void {
    this.iterate((slot: Slot) => this.move(slot));
  }
  private move(slot: Slot): void {
    slot.y += 10;
    if (slot.y >= reel.slotSize * reel.slotsCount) {
      let updatedSlot;
      if (this.slowdown) {
        updatedSlot = this.results[this.updatedSlotCount];
        this.updatedSlotCount++;

        if (this.updatedSlotCount > 3) {
          this.rotating.remove();
          this.slowdown = false;
          this.updatedSlotCount = 0;
        }
      }
      slot.update(updatedSlot);
      slot.y = 0;
    }
  }

  public stopSpin(resultSlots: Array<string>, stopDelay: number): void {
    this.results = resultSlots.slice().reverse().slice(0, 3);
    setTimeout(() => {
      this.slowdown = true;
    }, stopDelay);
  }

  public getSlottoScale(rowIndex: number): Slot {
    const val = this.slots.find(
      (slot) => {
        const pos = (rowIndex + 1) * reel.slotSize;
        return slot.y - pos === 0 || slot.y - pos === 10;
      } //slot.y === (rowIndex + 1) * reel.slotSize
    );
    return val!;
  }
}
