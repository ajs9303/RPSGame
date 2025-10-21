import { Unit } from "./class.js";

// ----------------------------
// 캐릭터 & 몬스터 데이터
// ----------------------------
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

// ----------------------------
// DOM 선택
// ----------------------------
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

// ----------------------------
// 유닛 렌더링
// ----------------------------
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

// ----------------------------
// 전투 화면 렌더링 (최초 한 번)
const renderBattleField = () => {
  battleSection.classList.add("active");

  if (!heroArea.querySelector(".heroBar")) {
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
  }

  if (!monsterArea.querySelector(".monsterBar")) {
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
  }
};

// ----------------------------
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

// ----------------------------
// 게임 종료
const gameOverHandler = (winner, isHeroWinner) => {
  // 버튼 비활성화
  rpsButtons.forEach((b) => (b.disabled = true));

  // 이미 종료 메시지가 있으면 중복 생성 방지
  if (battleSection.querySelector(".endContainer")) return;

  const endContainer = document.createElement("div");
  endContainer.classList.add("endContainer");

  const msgClass = isHeroWinner ? "win" : "lose";
  endContainer.innerHTML = `
    <div class="endMessage ${msgClass}">🎉 ${winner} 승리! 전투 종료 🎉</div>
    <button class="restart-btn">다시 시작</button>
  `;

  battleSection.appendChild(endContainer);

  const restartBtn = endContainer.querySelector(".restart-btn");
  restartBtn.addEventListener("click", () => {
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

// ----------------------------
// 가위바위보 & 전투
const choices = ["rock", "paper", "scissors"];
const choiceText = (choice) =>
  choice === "rock" ? "바위" : choice === "paper" ? "보" : "가위";

const judge = (player, monster) => {
  if (player === monster) return "무승부";
  if (
    (player === "rock" && monster === "scissors") ||
    (player === "scissors" && monster === "paper") ||
    (player === "paper" && monster === "rock")
  )
    return "승리";
  return "패배";
};

rpsButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!selectedHero || !selectedMonster) return;

    const playerChoice = btn.dataset.choice;
    const monsterChoice = choices[Math.floor(Math.random() * 3)];
    const result = judge(playerChoice, monsterChoice);

    let log = `플레이어: ${choiceText(playerChoice)} / 몬스터: ${choiceText(
      monsterChoice
    )} → ${result}<br>`;

    if (result === "승리") {
      const attackLogs = selectedHero.attack(selectedMonster, ".heroArea");
      attackLogs.forEach((l) => (log += `<div>${l}</div>`));
    } else if (result === "패배") {
      const attackLogs = selectedMonster.attack(selectedHero, ".monsterArea");
      attackLogs.forEach((l) => (log += `<div>${l}</div>`));
    } else {
      log += `<div>무승부! 피해 없음.</div>`;
    }

    updateHP();
    battleLog.innerHTML += log;
    battleLog.scrollTop = battleLog.scrollHeight;

    // 승패 체크
    if (selectedHero.isDead()) {
      gameOverHandler(selectedMonster.name, false);
    } else if (selectedMonster.isDead()) {
      gameOverHandler(selectedHero.name, true);
    }
  });
});

// ----------------------------
// 초기 렌더링
renderUnits(characters, characterContainer, "hero");
renderUnits(monsters, monsterContainer, "monster");
