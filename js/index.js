import { Unit } from "./class.js";

// 캐릭터 & 몬스터 데이터
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

// DOM
const characterSection = document.querySelector("#characterSelect");
const monsterSection = document.querySelector("#monsterSelect");
const battleSection = document.querySelector("#battleScreen");

const characterContainer = characterSection.querySelector(".unit");
const monsterContainer = monsterSection.querySelector(".unit");

const heroArea = battleSection.querySelector(".heroArea");
const monsterArea = battleSection.querySelector(".monsterArea");
const battleLog = battleSection.querySelector(".battleLog");
const rpsButtons = battleSection.querySelectorAll(".rpsButtons button");

let selectedHero = null;
let selectedMonster = null;

// 유닛 렌더링
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
        renderBattleField();
      }
    });
    container.appendChild(card);
  });
};

// 전투 화면 렌더링
const renderBattleField = () => {
  battleSection.classList.add("active");

  heroArea.innerHTML = `
    <picture><img src='${selectedHero.img}' /></picture>
    <div>${selectedHero.name}</div>
    <div class="hpBarContainer">
      <div class="hpBar heroBar" style="width:${
        (selectedHero.hp / selectedHero.maxHp) * 100
      }%"></div>
    </div>
    <div class="hpText">HP: ${selectedHero.hp}</div>
  `;

  monsterArea.innerHTML = `
    <picture><img src='${selectedMonster.img}' /></picture>
    <div>${selectedMonster.name}</div>
    <div class="hpBarContainer">
      <div class="hpBar monsterBar" style="width:${
        (selectedMonster.hp / selectedMonster.maxHp) * 100
      }%"></div>
    </div>
    <div class="hpText">HP: ${selectedMonster.hp}</div>
  `;
};

// HP 업데이트
const updateHP = () => {
  heroArea.querySelector(".heroBar").style.width =
    (selectedHero.hp / selectedHero.maxHp) * 100 + "%";
  monsterArea.querySelector(".monsterBar").style.width =
    (selectedMonster.hp / selectedMonster.maxHp) * 100 + "%";
  heroArea.querySelector(".hpText").textContent = `HP: ${selectedHero.hp}`;
  monsterArea.querySelector(
    ".hpText"
  ).textContent = `HP: ${selectedMonster.hp}`;
};

// 게임 종료
const gameOverHandler = (winner, isHeroWinner) => {
  rpsButtons.forEach((b) => (b.disabled = true));

  if (battleSection.querySelector(".endContainer")) return;

  const endContainer = document.createElement("div");
  endContainer.classList.add("endContainer");

  const color = isHeroWinner ? "#4caf50" : "#f44336";
  endContainer.innerHTML = `
    <div class="endMessage" style="color:${color}; font-weight:bold; font-size:18px;">
      🎉 ${winner} 승리! 전투 종료 🎉
    </div>
    <button class="restart-btn">다시 시작</button>
  `;
  battleSection.appendChild(endContainer);

  const restartBtn = endContainer.querySelector(".restart-btn");
  restartBtn.addEventListener("click", () => {
    selectedHero?.resetHP();
    selectedMonster?.resetHP();

    selectedHero = null;
    selectedMonster = null;
    battleLog.innerHTML = "";
    rpsButtons.forEach((b) => (b.disabled = false));
    heroArea.innerHTML = "";
    monsterArea.innerHTML = "";
    endContainer.remove();
    battleSection.classList.remove("active");
    characterSection.classList.add("active");
  });
};

// 가위바위보
const choices = ["rock", "paper", "scissors"];
const judge = (player, monster) => {
  if (player === monster) return "무승부";
  if (
    (player === "rock" && monster === "scissors") ||
    (player === "scissors" && monster === "paper") ||
    (player === "paper" && monster === "rock")
  )
    return "승리!";
  return "패배!";
};

// 전투
rpsButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!selectedHero || !selectedMonster) return;

    const playerChoice = btn.dataset.choice;
    const monsterChoice = choices[Math.floor(Math.random() * 3)];
    const result = judge(playerChoice, monsterChoice);

    const logBlock = document.createElement("div");
    logBlock.classList.add("logBlock");

    if (result === "승리!") {
      const attackLogs = selectedHero.attack(selectedMonster, ".heroArea");

      if (attackLogs.some((l) => l.includes("회피"))) {
        logBlock.innerHTML = `
          <strong class="result">승리!</strong>
          <span class="miss">하지만 ${selectedMonster.name}이(가) 공격을 회피했다!</span>
        `;
      } else {
        const isCritical = attackLogs.some((l) => l.includes("크리티컬"));
        const damageLine = attackLogs.find((l) => l.includes("피해"));
        const damage = damageLine ? damageLine.match(/\d+/)[0] : 0;
        logBlock.innerHTML = `
          <strong class="result">이겼다!</strong>
          <span class="${isCritical ? "critical" : "playerAttack"}">
            ${selectedHero.name}의 공격! ${
          selectedMonster.name
        }에게 ${damage}의 ${isCritical ? "강한 피해를" : "피해를"} 주었다.
          </span>
        `;
      }
    } else if (result === "패배!") {
      const attackLogs = selectedMonster.attack(selectedHero, ".monsterArea");

      if (attackLogs.some((l) => l.includes("회피"))) {
        logBlock.innerHTML = `
          <strong class="result">졌다!</strong>
          <span class="miss">${selectedHero.name}이(가) 공격을 회피했다!</span>
        `;
      } else {
        const isCritical = attackLogs.some((l) => l.includes("크리티컬"));
        const damageLine = attackLogs.find((l) => l.includes("피해"));
        const damage = damageLine ? damageLine.match(/\d+/)[0] : 0;
        logBlock.innerHTML = `
          <strong class="result">패배!</strong>
          <span class="${isCritical ? "critical" : "monsterAttack"}">
            ${selectedMonster.name}의 공격! ${damage}의 ${
          isCritical ? "강한 피해를" : "피해를"
        } 받았다.
          </span>
        `;
      }
    } else {
      logBlock.innerHTML = `<strong class="result">무승부!</strong>`;
    }

    battleLog.appendChild(logBlock);
    battleLog.scrollTop = battleLog.scrollHeight;

    updateHP();

    if (selectedHero.isDead()) gameOverHandler(selectedMonster.name, false);
    if (selectedMonster.isDead()) gameOverHandler(selectedHero.name, true);
  });
});

// 초기 렌더링
renderUnits(characters, characterContainer, "hero");
renderUnits(monsters, monsterContainer, "monster");
