import { Unit } from "./class.js";
import { Battle } from "./battle.js";
import { BattleUI } from "./ui.js";

const characters = [
  new Unit("전사", 500, 50, 30, 20, 10, "img/hero.png"),
  new Unit("궁수", 400, 60, 25, 15, 15, "img/archer.png"),
  new Unit("도적", 350, 70, 20, 10, 20, "img/thief.png"),
];
const monsters = [
  new Unit("슬라임", 200, 30, 20, 5, 5, "img/slime.png"),
  new Unit("오크", 450, 40, 25, 20, 10, "img/orc.png"),
  new Unit("드래곤", 700, 55, 35, 30, 15, "img/dragon.png"),
];

const characterSection = document.querySelector("#characterSelect");
const monsterSection = document.querySelector("#monsterSelect");
const battleSection = document.querySelector("#battleScreen");
const characterContainer = characterSection.querySelector(".unit");
const monsterContainer = monsterSection.querySelector(".unit");
const rpsButtons = battleSection.querySelectorAll(".rpsButtons button");

let selectedHero = null;
let selectedMonster = null;
let battle = null;
let battleUI = null;

const renderUnits = (list, container, type) => {
  container.innerHTML = "";
  list.forEach((unit) => {
    const card = document.createElement("div");
    card.className = "unitCard";
    card.innerHTML = `
      <picture><img src='${unit.img}' /></picture>
      <div class="unitStatus">
        <div class="status"><span>이름</span><span>${unit.name}</span></div>
        <div class="status"><span>HP</span><span class="hp">${unit.hp}</span></div>
        <div class="status"><span>공격력</span><span class="atk">${unit.atk}</span></div>
        <div class="status"><span>방어력</span><span class="def">${unit.def}</span></div>
        <div class="status"><span>명중률</span><span class="acc">${unit.acc}</span></div>
        <div class="status"><span>회피율</span><span class="eva">${unit.eva}</span></div>
      </div>
    `;
    card.addEventListener("click", () => {
      if (type === "hero") {
        selectedHero = unit;
        characterSection.classList.remove("active");
        monsterSection.classList.add("active");
      } else {
        selectedMonster = unit;
        monsterSection.classList.remove("active");
        startBattle();
      }
    });
    container.appendChild(card);
  });
};

const startBattle = () => {
  battleSection.classList.add("active");
  battleUI = new BattleUI(battleSection);
  battleUI.renderBattleField(selectedHero, selectedMonster);
  battle = new Battle(selectedHero, selectedMonster, battleUI);
};

rpsButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!battle) return;
    battle.turn(btn.dataset.choice);
  });
});

renderUnits(characters, characterContainer, "hero");
renderUnits(monsters, monsterContainer, "monster");
