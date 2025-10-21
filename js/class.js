export class Unit {
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

  isDead() {
    return this.#hp <= 0;
  }
  resetHP() {
    this.#hp = this.#maxHp;
  }
  takeDamage(damage) {
    this.#hp = Math.max(0, this.#hp - damage);
  }

  attackValue(target) {
    if (Math.random() * 100 < target.eva)
      return { damage: 0, miss: true, critical: false };
    let damage = Math.floor(this.#atk * (100 / (100 + target.def)));
    const isCritical = Math.random() * 100 < this.#acc;
    if (isCritical) damage *= 2;
    target.takeDamage(damage);
    return { damage, miss: false, critical: isCritical };
  }
}
