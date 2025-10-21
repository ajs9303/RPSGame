export class BattleUI {
  constructor(battleSection) {
    this.battleSection = battleSection;
    this.heroArea = battleSection.querySelector(".heroArea");
    this.monsterArea = battleSection.querySelector(".monsterArea");
    this.battleLog = battleSection.querySelector(".battleLog");
    this.hero = null;
    this.monster = null;
  }

  renderBattleField(hero, monster) {
    this.hero = hero;
    this.monster = monster;
    this.heroArea.innerHTML = `
      <picture><img src='${hero.img}' /></picture>
      <div>${hero.name}</div>
      <div class="hpBarContainer">
        <div class="hpBar heroBar" style="width:${
          (hero.hp / hero.maxHp) * 100
        }%"></div>
      </div>
      <div class="hpText">HP: ${hero.hp}</div>
    `;
    this.monsterArea.innerHTML = `
      <picture><img src='${monster.img}' /></picture>
      <div>${monster.name}</div>
      <div class="hpBarContainer">
        <div class="hpBar monsterBar" style="width:${
          (monster.hp / monster.maxHp) * 100
        }%"></div>
      </div>
      <div class="hpText">HP: ${monster.hp}</div>
    `;
  }

  updateHP(hero, monster) {
    this.heroArea.querySelector(".heroBar").style.width =
      (hero.hp / hero.maxHp) * 100 + "%";
    this.monsterArea.querySelector(".monsterBar").style.width =
      (monster.hp / monster.maxHp) * 100 + "%";
    this.heroArea.querySelector(".hpText").textContent = `HP: ${hero.hp}`;
    this.monsterArea.querySelector(".hpText").textContent = `HP: ${monster.hp}`;
  }

  showAttack(winlose, attacker, target, attackerSelector, targetSelector) {
    const result = attacker.attackValue(target);

    const attackerEl = document.querySelector(attackerSelector);
    const targetEl = document.querySelector(targetSelector);

    // 공격 애니메이션
    attackerEl.classList.add("attackAni");
    setTimeout(() => attackerEl.classList.remove("attackAni"), 400);

    // 피격/회피 애니메이션
    if (result.miss) {
      targetEl.classList.add("missAni");
      setTimeout(() => targetEl.classList.remove("missAni"), 300);
    } else {
      targetEl.classList.add("hitAni");
      setTimeout(() => targetEl.classList.remove("hitAni"), 300);

      // 데미지 텍스트 표시
      const dmgText = document.createElement("span");
      dmgText.className = "damageText";
      dmgText.textContent = `-${result.damage}`;
      targetEl.appendChild(dmgText);
      setTimeout(() => dmgText.remove(), 800);
    }

    // 로그 작성
    const textWinlose = winlose === "win" ? "이겼다!" : "졌다!";
    const attackClass =
      attacker === this.hero ? "playerAttack" : "monsterAttack";

    const logBlock = document.createElement("div");
    logBlock.className = "logBlock";
    logBlock.innerHTML = result.miss
      ? `<strong class="result">${textWinlose}</strong>
        <span class="miss">${target.name}이(가) 공격을 회피!</span>`
      : `<strong class="result">${textWinlose}</strong>
        <span class="${result.critical ? "critical" : attackClass}">
        ${attacker.name}의 공격! ${target.name}에게 ${result.damage}의 ${
          result.critical ? "강한 피해" : "피해"
        }</span>`;
    this.battleLog.appendChild(logBlock);
    this.battleLog.scrollTop = this.battleLog.scrollHeight;
  }

  showDraw() {
    const logBlock = document.createElement("div");
    logBlock.className = "logBlock";
    logBlock.innerHTML = `<strong class="result">무승부!</strong>`;
    this.battleLog.appendChild(logBlock);
    this.battleLog.scrollTop = this.battleLog.scrollHeight;
  }

  gameOver(winner, isHeroWinner) {
    const rpsButtons =
      this.battleSection.querySelectorAll(".rpsButtons button");
    rpsButtons.forEach((btn) => (btn.disabled = true));

    const endContainer = document.createElement("div");
    endContainer.className = "endContainer";
    const color = isHeroWinner ? "#4caf50" : "#f44336";
    endContainer.innerHTML = `
      <div class="endMessage" style="color:${color}; font-weight:bold; font-size:18px;">
        🎉 ${winner} 승리! 전투 종료 🎉
      </div>
      <button class="restart-btn">다시 시작</button>
    `;
    this.battleSection.appendChild(endContainer);

    const restartBtn = endContainer.querySelector(".restart-btn");
    restartBtn.addEventListener("click", () => location.reload());
  }
}
