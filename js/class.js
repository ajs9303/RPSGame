export class Unit {
  // 이름, hp, 공격력, 명중률, 방어력, 회피율, 이미지
  #name;
  #hp;
  #maxHp;
  #atk;
  #acc;
  #def;
  #eva;
  #img;

  constructor(name, hp, atk, acc, def, eva, img) {
    this.#name = name;
    this.#hp = hp;
    this.#maxHp = hp;
    this.#atk = atk;
    this.#acc = acc;
    this.#def = def;
    this.#eva = eva;
    this.#img = img;
  }

  // -------------------------------
  // 🧭 getter
  // -------------------------------
  get name() {
    return this.#name;
  }
  get hp() {
    return this.#hp;
  }
  get maxHp() {
    return this.#maxHp;
  }
  get atk() {
    return this.#atk;
  }
  get acc() {
    return this.#acc;
  }
  get def() {
    return this.#def;
  }
  get eva() {
    return this.#eva;
  }

  get img() {
    return this.#img;
  }

  // 공격 확률 계산
  calculateHit(target) {
    let chance = 80 + this.#acc - target.eva;
    chance = Math.min(85, Math.max(15, chance)); // 15 ~ 85% 제한
    return Math.random() * 100 < chance;
  }

  // 피해 받음
  getDamage(damage) {
    this.#hp = Math.max(0, this.#hp - damage);
  }

  // 공격
  attack(target, areaSelector) {
    const isHit = this.calculateHit(target);
    const logs = [];
    const logArea = document.querySelector(".battleLog");

    // 타격 효과
    const attackerEl = document.querySelector(areaSelector);
    attackerEl.classList.add("attackAni");
    setTimeout(() => attackerEl.classList.remove("attackAni"), 400);

    // 피격 효과
    const targetEl = document.querySelector(
      areaSelector.includes("hero") ? ".monsterArea" : ".heroArea"
    );

    if (isHit) {
      const damage = Math.floor(this.#atk * (100 / (100 + target.def)));
      target.getDamage(damage);

      targetEl.classList.add("hitAni");
      setTimeout(() => targetEl.classList.remove("hitAni"), 300);

      // 대미지 숫자 표시
      const dmgText = document.createElement("span");
      dmgText.classList.add("damageText");
      dmgText.textContent = `-${damage}`;
      targetEl.appendChild(dmgText);
      setTimeout(() => dmgText.remove(), 800);

      logs.push(`${this.#name}의 공격! ${target.name}에게 ${damage} 피해!`);
    } else {
      // 회피 효과
      targetEl.classList.add("missAni");
      setTimeout(() => targetEl.classList.remove("missAni"), 300);
      logs.push(`${this.#name}의 공격! ${target.name}이(가) 회피!`);
    }

    return logs;
  }

  // 죽었는지 여부
  isDead() {
    return this.#hp <= 0;
  }
}
