# RPS Battle Game

🎮 **RPS Battle Game**은 가위바위보(Rock-Paper-Scissors)를 기반으로 한 캐릭터 전투 게임입니다.  
플레이어는 캐릭터를 선택하고, 몬스터와 전투를 진행하며 승패를 결정합니다.

---

## 📝 기능

- 캐릭터 선택 화면
- 몬스터 선택 화면
- 배틀 화면
  - 플레이어와 몬스터의 HP 상태 표시
  - 가위바위보 버튼으로 공격 결정
  - 공격, 회피, 크리티컬 애니메이션
  - 전투 로그 표시
- 게임 종료 후 재시작 버튼
- 로그 스크롤 기능

---

## ⚙️ 사용 기술

- HTML5 / CSS3
- JavaScript (ES6 모듈)
  - **class.js** : 캐릭터/몬스터 클래스
  - **battle.js** : 전투 로직
  - **ui.js** : 화면 UI 및 애니메이션
  - **index.js** : 초기화 및 이벤트 핸들링

---

## 🚀 실행 방법
1. https://ajs9303.github.io/RPSGame/
2. 캐릭터와 몬스터 선택
3. 가위, 바위, 보 중 선택하기

---

## 🎨 프로젝트 구조

├─ index.html
├─ css/
│ ├─ reset.css
│ └─ index.css
├─ js/
│ ├─ class.js
│ ├─ battle.js
│ ├─ ui.js
│ └─ index.js
└─ img/
  ├─ hero.png
  ├─ archer.png
  ├─ thief.png
  ├─ slime.png
  ├─ orc.png
  └─ dragon.png
  

---

## 🔧 커스터마이징

- 캐릭터/몬스터 스탯 변경 : `js/class.js`  
- 이미지 교체 : `img/` 폴더  
- 버튼 스타일, 로그 스타일 등 : `css/index.css`  

---

## 📌 주의 사항

- 브라우저 호환성 : 최신 Chrome, Firefox 권장  
- 모바일 화면 최적화 일부 미지원  
- 게임 종료 후 재시작 버튼 클릭으로 초기화  

---

## 👏 기여

PR, 버그 리포트, 기능 개선 제안 환영합니다.  
즐겁게 코딩하고 게임도 즐겨주세요! 🎉
