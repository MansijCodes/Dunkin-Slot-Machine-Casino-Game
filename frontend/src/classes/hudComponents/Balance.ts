export default class Balance extends Phaser.GameObjects.Container {
  public balance: number;
  private balanceText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    const balanceComponent = this.scene.add
      .sprite(0, 0, 'balanceComponent')
      .setOrigin(0, 0.5);
    this.add(balanceComponent);

    this.balance = 500;
    this.addBalanceText();
  }

  private addBalanceText(): void {
    const balanceTitle = this.scene.add
      .text(30, 0, 'BALANCE', {
        fontSize: '22px',
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0, 0.5);
    this.add(balanceTitle);
    this.balanceText = this.scene.add
      .text(200, 0, `$${this.balance}`, {
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#ffd200',
      })
      .setOrigin(0.5);
    this.add(this.balanceText);
  }

  public updateBalance(balance: number): void {
    this.balance += balance;
    this.balanceText.setText(`$${this.balance}`);
  }
}
