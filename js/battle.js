export class Battle {
  constructor(hero, monster, ui) {
    this.hero = hero;
    this.monster = monster;
    this.ui = ui;
    this.isGameOver = false;
  }

  rpsResult(playerChoice) {
    const choices = ["rock", "paper", "scissors"];
    const monsterChoice = choices[Math.floor(Math.random() * 3)];
    console.log(`player: ${playerChoice}, monster: ${monsterChoice}`);

    let result;
    if (playerChoice === monsterChoice) result = "draw";
    else if (
      (playerChoice === "rock" && monsterChoice === "scissors") ||
      (playerChoice === "scissors" && monsterChoice === "paper") ||
      (playerChoice === "paper" && monsterChoice === "rock")
    )
      result = "win";
    else result = "lose";

    return { result, playerChoice, monsterChoice };
  }

  turn(playerChoice) {
    if (this.isGameOver) return;

    const outcome = this.rpsResult(playerChoice);
    if (outcome.result === "win")
      this.ui.showAttack(
        outcome.result,
        this.hero,
        this.monster,
        ".heroArea",
        ".monsterArea"
      );
    else if (outcome.result === "lose")
      this.ui.showAttack(
        outcome.result,
        this.monster,
        this.hero,
        ".monsterArea",
        ".heroArea"
      );
    else this.ui.showDraw();

    this.ui.updateHP(this.hero, this.monster);

    if (this.hero.isDead()) {
      this.isGameOver = true;
      this.ui.gameOver(this.monster.name, false);
    }
    if (this.monster.isDead()) {
      this.isGameOver = true;
      this.ui.gameOver(this.hero.name, true);
    }
  }
}
