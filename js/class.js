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

  // getter
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

  // 피해 받음
  getDamage(damage) {
    this.#hp = Math.max(0, this.#hp - damage);
  }

  // 죽었는지 여부
  isDead() {
    return this.#hp <= 0;
  }

  // 공격
  attack(target, areaSelector) {
    const logs = [];
    const logArea = document.querySelector(".battleLog");

    // 타격 효과
    const attackerEl = document.querySelector(areaSelector);

    // 피격 효과
    const targetEl = document.querySelector(
      areaSelector.includes("hero") ? ".monsterArea" : ".heroArea"
    );

    // 회피 체크
    if (Math.random() * 100 < target.eva) {
      targetEl.classList.add("missAni");
      setTimeout(() => targetEl.classList.remove("missAni"), 300);
      logs.push(`${target.name}이(가) 공격을 회피!`);
      return logs;
    }

    // 피해 계산(방어력 적용)
    let damage = Math.floor(this.#atk * (100 / (100 + target.def)));

    // 크리티컬 계산(명중률)
    let isCritical = Math.random() * 100 < this.#acc;
    if (isCritical) {
      damage *= 2;
      logs.push(`${this.name}의 크리티컬!`);
    } else {
      logs.push(`${this.name}의 공격!`);
    }

    // HP 차감
    target.getDamage(damage);

    // 공격 애니메이션
    attackerEl.classList.add("attackAni");
    setTimeout(() => attackerEl.classList.remove("attackAni"), 400);

    // 피격 애니메이션
    targetEl.classList.add("hitAni");
    setTimeout(() => targetEl.classList.remove("hitAni"), 300);

    // 데미지 표시
    const dmgText = document.createElement("span");
    dmgText.classList.add("damageText");
    dmgText.textContent = `-${damage}`;
    targetEl.appendChild(dmgText);
    setTimeout(() => dmgText.remove(), 800);

    // 로그 작성
    logs.push(`${target.name}에게 ${damage} 피해!`);

    return logs;
  }
}
