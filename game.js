const SAVE_KEY = "tapEmpire_final_save";

const defaultGame = {
  coins: 0,
  gems: 0,
  best: 0,
  power: 1,
  auto: 0,
  clicks: 0,
  totalEarned: 0,

  combo: 0,
  comboTime: 0,
  bestCombo: 0,

  critChance: 5,
  critCount: 0,

  gemPower: 0,

  level: 1,
  xp: 0,

  daily: "",
  streak: 0,
  lastDaily: "",

  boostUntil: 0,

  skins: ["classic"],
  selectedSkin: "classic",

  sound: true,

  lastSeen: Date.now(),

  claimedMissions: [],
  claimedAchievements: []
};


let game = loadGame();

let audioCtx = null;

const comboMax = 3000;


const skins = [

  {
    id: "classic",
    name: "کلاسیک",
    icon: "🪙",
    price: 0
  },

  {
    id: "gold",
    name: "طلایی",
    icon: "🥇",
    price: 1000
  },

  {
    id: "diamond",
    name: "الماس",
    icon: "💎",
    price: 5000
  },

  {
    id: "fire",
    name: "آتش",
    icon: "🔥",
    price: 10000
  },

  {
    id: "crown",
    name: "سلطنتی",
    icon: "👑",
    price: 25000
  }

];


const missions = [

  {
    id: "click100",
    title: "👆 صد کلیک",
    text: "100 بار کلیک کن",
    target: 100,
    reward: 200,
    type: "click"
  },

  {
    id: "earn1000",
    title: "🪙 خزانه کوچک",
    text: "1000 سکه درآمد داشته باش",
    target: 1000,
    reward: 500,
    type: "earn"
  },

  {
    id: "level5",
    title: "👑 سطح 5",
    text: "به سطح 5 برس",
    target: 5,
    reward: 1000,
    type: "level"
  },

  {
    id: "combo25",
    title: "🔥 کمبو 25",
    text: "به کمبو 25 برس",
    target: 25,
    reward: 750,
    type: "combo"
  },

  {
    id: "crit10",
    title: "💥 شکارچی کریتیکال",
    text: "10 کریتیکال بزن",
    target: 10,
    reward: 1000,
    type: "crit"
  }

];


const achievements = [

  {
    id: "rich",
    title: "💰 سرمایه‌دار",
    text: "10000 سکه جمع کن",
    target: 10000,
    type: "earn",
    reward: 2
  },

  {
    id: "tapmaster",
    title: "👆 استاد کلیک",
    text: "1000 کلیک",
    target: 1000,
    type: "click",
    reward: 3
  },

  {
    id: "combo",
    title: "🔥 کمبو افسانه‌ای",
    text: "کمبو 50",
    target: 50,
    type: "combo",
    reward: 5
  },

  {
    id: "king",
    title: "👑 پادشاه",
    text: "سطح 10",
    target: 10,
    type: "level",
    reward: 10
  },

  {
    id: "critical",
    title: "💥 ماشین کریتیکال",
    text: "100 کریتیکال",
    target: 100,
    type: "crit",
    reward: 10
  }

];


function loadGame(){

  try{

    const saved =
      localStorage.getItem(SAVE_KEY);

    if(saved){

      return {
        ...defaultGame,
        ...JSON.parse(saved)
      };

    }

  }catch(e){}

  return {
    ...defaultGame
  };

}


function saveGame(){

  game.lastSeen = Date.now();

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(game)
  );

}


function toast(text){

  const d =
    document.createElement("div");

  d.className = "toast";

  d.textContent = text;

  document
    .getElementById("toastBox")
    .appendChild(d);

  setTimeout(
    () => d.remove(),
    2400
  );

}


function xpNeed(){

  return 100 +
    Math.floor(
      (game.level - 1) * 45
    );

}


function addXP(value){

  game.xp += value;

  while(
    game.xp >= xpNeed()
  ){

    game.xp -= xpNeed();

    game.level++;

    const reward =
      25 + game.level * 25;

    game.coins += reward;

    if(game.level % 5 === 0){

      game.gems += 1;

    }

    toast(
      `👑 سطح ${game.level}! +${reward} 🪙`
    );

    sound(660,.12);

  }

}


function comboMultiplier(){

  if(game.combo >= 50)
    return 3;

  if(game.combo >= 25)
    return 2;

  if(game.combo >= 10)
    return 1.5;

  return 1;

}


function powerCost(){

  return Math.floor(
    100 *
    Math.pow(
      1.45,
      game.power - 1
    )
  );

}


function autoCost(){

  return Math.floor(
    250 *
    Math.pow(
      1.55,
      game.auto
    )
  );

}


function critCost(){

  return Math.floor(
    500 *
    Math.pow(
      1.8,
      Math.floor(
        (game.critChance - 5) / 2
      )
    )
  );

}


function gemPowerCost(){

  return 5 +
    game.gemPower * 5;

}


function clickReward(){

  const mult =
    comboMultiplier();

  const boosted =
    Date.now() < game.boostUntil
      ? 2
      : 1;

  const crit =
    Math.random() * 100 <
    game.critChance;

  let reward =
    Math.max(
      1,
      Math.floor(
        game.power *
        (1 + game.gemPower * .25) *
        mult *
        boosted
      )
    );

  if(crit){

    reward *= 3;

    game.critCount++;

    toast(
      `💥 کریتیکال! +${reward} 🪙`
    );

    sound(880,.1);

  }

  return {
    reward,
    crit
  };

}


function updateCombo(){

  game.combo++;

  game.comboTime =
    comboMax;

  if(
    game.combo >
    game.bestCombo
  ){

    game.bestCombo =
      game.combo;

  }

}


function clickCoin(){

  updateCombo();

  const result =
    clickReward();

  const reward =
    result.reward;

  const crit =
    result.crit;


  game.coins += reward;

  game.totalEarned += reward;

  game.clicks++;


  if(
    game.coins >
    game.best
  ){

    game.best =
      Math.floor(game.coins);

  }


  addXP(1);

  createParticles();

  floatText(
    `+${reward}${crit ? " 💥" : ""}`
  );

  sound(
    crit ? 880 : 520,
    .045
  );

  saveGame();

  update();

}


document
  .getElementById("coinButton")
  .onclick = clickCoin;


document
  .getElementById("powerUpgrade")
  .onclick = () => {

    buy(
      "power",
      powerCost(),
      () => game.power++,
      "⚡ قدرت کلیک بیشتر شد"
    );

  };


document
  .getElementById("autoUpgrade")
  .onclick = () => {

    buy(
      "auto",
      autoCost(),
      () => game.auto++,
      "🤖 درآمد خودکار بیشتر شد"
    );

  };


document
  .getElementById("critUpgrade")
  .onclick = () => {

    const c =
      critCost();

    if(
      game.coins < c
    ){

      return toast(
        "🪙 سکه کافی نیست"
      );

    }

    if(
      game.critChance >= 35
    ){

      return toast(
        "💥 شانس کریتیکال به سقف رسیده"
      );

    }

    game.coins -= c;

    game.critChance += 2;

    addXP(20);

    toast(
      "💥 شانس کریتیکال افزایش یافت"
    );

    saveGame();

    update();

  };


document
  .getElementById("gemPowerUpgrade")
  .onclick = () => {

    const c =
      gemPowerCost();

    if(
      game.gems < c
    ){

      return toast(
        "💎 جم کافی نیست"
      );

    }

    game.gems -= c;

    game.gemPower++;

    toast(
      "💎 قدرت جم افزایش یافت"
    );

    saveGame();

    update();

  };


function buy(
  type,
  cost,
  fn,
  msg
){

  if(
    game.coins < cost
  ){

    return toast(
      "🪙 سکه کافی نیست"
    );

  }

  game.coins -= cost;

  fn();

  addXP(
    type === "auto"
      ? 15
      : 10
  );

  toast(msg);

  sound(600,.08);

  saveGame();

  update();

}


document
  .getElementById("boostButton")
  .onclick = () => {

    if(
      Date.now() <
      game.boostUntil
    ){

      return;

    }

    game.boostUntil =
      Date.now() + 30000;

    toast(
      "⚡ بوست ×2 فعال شد!"
    );

    sound(740,.15);

    saveGame();

    update();

  };


setInterval(
  () => {

    if(game.auto > 0){

      const gain =
        game.auto *
        (
          Date.now() <
          game.boostUntil
            ? 2
            : 1
        );

      game.coins += gain;

      game.totalEarned += gain;

      if(
        game.coins >
        game.best
      ){

        game.best =
          Math.floor(
            game.coins
          );

      }

      addXP(1);

      saveGame();

      update();

    }

  },
  1000
);


setInterval(
  () => {

    if(
      game.comboTime > 0
    ){

      game.comboTime =
        Math.max(
          0,
          game.comboTime - 100
        );

      if(
        game.comboTime === 0
      ){

        game.combo = 0;

      }

      update();

    }

  },
  100
);


function missionValue(m){

  if(
    m.type === "click"
  )
    return game.clicks;

  if(
    m.type === "earn"
  )
    return game.totalEarned;

  if(
    m.type === "level"
  )
    return game.level;

  if(
    m.type === "combo"
  )
    return game.bestCombo;

  if(
    m.type === "crit"
  )
    return game.critCount;

  return 0;

}


function drawMissions(){

  const b =
    document.getElementById(
      "missionList"
    );

  b.innerHTML = "";


  missions.forEach(
    m => {

      let v =
        Math.min(
          missionValue(m),
          m.target
        );

      let done =
        game.claimedMissions
          .includes(m.id);


      let d =
        document.createElement(
          "div"
        );

      d.className =
        "mission";


      d.innerHTML = `

        <b>${m.title}</b>

        <p>
          ${m.text}
        </p>

        <p>
          ${v}/${m.target}
        </p>

        <div class="progress">

          <div
            style="width:${v / m.target * 100}%"
          ></div>

        </div>

        <button
          ${done || v < m.target
            ? "disabled"
            : ""}
        >

          ${
            done
              ? "دریافت شد"
              : `دریافت +${m.reward} 🪙`
          }

        </button>

      `;


      d
        .querySelector("button")
        .onclick =
        () =>
          claimMission(m.id);


      b.appendChild(d);

    }
  );

}


function claimMission(id){

  const m =
    missions.find(
      x => x.id === id
    );


  if(
    !m ||
    game.claimedMissions.includes(id) ||
    missionValue(m) < m.target
  ){

    return;

  }


  game.claimedMissions.push(id);

  game.coins += m.reward;

  game.gems += 1;

  toast(
    `🎯 مأموریت کامل شد! +${m.reward} 🪙 +1 💎`
  );

  addXP(25);

  saveGame();

  update();

}


function achValue(a){

  return missionValue({
    type: a.type
  });

}


function drawAchievements(){

  const b =
    document.getElementById(
      "achievementList"
    );

  b.innerHTML = "";


  achievements.forEach(
    a => {

      let v =
        Math.min(
          achValue(a),
          a.target
        );

      let done =
        game.claimedAchievements
          .includes(a.id);


      let d =
        document.createElement(
          "div"
        );

      d.className =
        "achievement";


      d.innerHTML = `

        <div class="icon">
          ${a.title.split(" ")[0]}
        </div>

        <div class="body">

          <b>
            ${a.title}
          </b>

          <p>
            ${a.text}
            —
            ${v}/${a.target}
          </p>

          <div class="progress">

            <div
              style="width:${v / a.target * 100}%"
            ></div>

          </div>

          <button
            ${done || v < a.target
              ? "disabled"
              : ""}
          >

            ${
              done
                ? "تکمیل شد"
                : `دریافت +${a.reward} 💎`
            }

          </button>

        </div>

      `;


      d
        .querySelector("button")
        .onclick = () => {

          game.claimedAchievements
            .push(a.id);

          game.gems += a.reward;

          toast(
            `🏆 دستاورد باز شد! +${a.reward} 💎`
          );

          saveGame();

          update();

        };


      b.appendChild(d);

    }
  );

}


function drawSkins(){

  const b =
    document.getElementById(
      "skinList"
    );

  b.innerHTML = "";


  skins.forEach(
    s => {

      const owned =
        game.skins.includes(
          s.id
        );


      const d =
        document.createElement(
          "div"
        );

      d.className =
        "skin";


      d.innerHTML = `

        <div class="icon">
          ${s.icon}
        </div>

        <div class="body">

          <b>
            ${s.name}
          </b>

          <p>
            ${
              s.price
                ? `${s.price} 🪙`
                : "رایگان"
            }
          </p>

          <button>

            ${
              game.selectedSkin === s.id
                ? "فعال"
                : owned
                  ? "انتخاب"
                  : "خرید"
            }

          </button>

        </div>

      `;


      d
        .querySelector("button")
        .onclick =
        () => selectSkin(s);


      b.appendChild(d);

    }
  );

}


function selectSkin(s){

  if(
    !game.skins.includes(
      s.id
    )
  ){

    if(
      game.coins < s.price
    ){

      return toast(
        "🪙 سکه کافی نیست"
      );

    }

    game.coins -= s.price;

    game.skins.push(s.id);

    toast(
      "🎨 اسکین خریداری شد"
    );

  }


  game.selectedSkin =
    s.id;


  document
    .getElementById(
      "coinIcon"
    )
    .textContent =
    s.icon;


  saveGame();

  update();

}


document
  .querySelectorAll(
    "nav button"
  )
  .forEach(
    btn => {

      btn.onclick = () => {

        document
          .querySelectorAll(
            "nav button"
          )
          .forEach(
            x =>
              x.classList.remove(
                "active"
              )
          );


        btn.classList.add(
          "active"
        );


        document
          .querySelectorAll(
            ".page"
          )
          .forEach(
            p =>
              p.classList.remove(
                "active"
              )
          );


        document
          .getElementById(
            btn.dataset.page
          )
          .classList.add(
            "active"
          );

      };

    }
  );


document
  .getElementById(
    "dailyButton"
  )
  .onclick = () => {

    const today =
      new Date().toDateString();


    if(
      game.daily === today
    ){

      return toast(
        "🎁 جایزه امروز را قبلاً گرفتی"
      );

    }


    const y =
      new Date();

    y.setDate(
      y.getDate() - 1
    );


    game.streak =
      game.lastDaily ===
      y.toDateString()
        ? game.streak + 1
        : 1;


    game.daily =
      today;

    game.lastDaily =
      today;


    const reward =
      300 +
      Math.min(
        game.streak,
        7
      ) * 100;


    game.coins += reward;

    game.totalEarned += reward;


    game.gems +=
      game.streak % 7 === 0
        ? 3
        : 1;


    addXP(30);


    toast(
      `🎁 +${reward} 🪙 و جایزه استریک`
    );


    saveGame();

    update();

  };


document
  .getElementById(
    "soundButton"
  )
  .onclick = () => {

    game.sound =
      !game.sound;

    update();

    saveGame();

  };


document
  .getElementById(
    "saveButton"
  )
  .onclick = () => {

    saveGame();

    toast(
      "💾 بازی ذخیره شد"
    );

  };


document
  .getElementById(
    "exportButton"
  )
  .onclick = () => {

    const blob =
      new Blob(
        [
          JSON.stringify(
            game,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    const a =
      document.createElement(
        "a"
      );


    a.href =
      URL.createObjectURL(
        blob
      );


    a.download =
      "tap-empire-save.json";


    a.click();


    toast(
      "📦 فایل ذخیره ساخته شد"
    );

  };


document
  .getElementById(
    "resetButton"
  )
  .onclick = () => {

    if(
      confirm(
        "⚠️ همه پیشرفت پاک شود؟"
      )
    ){

      localStorage.removeItem(
        SAVE_KEY
      );

      location.reload();

    }

  };


document
  .getElementById(
    "rubikaButton"
  )
  .onclick =
  () =>
    window.location.href =
      "https://rubika.ir/tapking";


document
  .getElementById(
    "supportButton"
  )
  .onclick =
  () =>
    window.location.href =
      "https://hamibash.com/Tapking";


function createParticles(){

  const a =
    document.getElementById(
      "particles"
    );


  const r =
    document
      .getElementById(
        "coinButton"
      )
      .getBoundingClientRect();


  for(
    let i = 0;
    i < 12;
    i++
  ){

    const p =
      document.createElement(
        "div"
      );


    p.className =
      "particle";


    p.style.left =
      r.left +
      r.width / 2 +
      "px";


    p.style.top =
      r.top +
      r.height / 2 +
      "px";


    p.style.setProperty(
      "--x",
      Math.random() * 160 - 80 +
      "px"
    );


    p.style.setProperty(
      "--y",
      Math.random() * 160 - 80 +
      "px"
    );


    a.appendChild(p);


    setTimeout(
      () => p.remove(),
      700
    );

  }

}


function floatText(t){

  const r =
    document
      .getElementById(
        "coinButton"
      )
      .getBoundingClientRect();


  const d =
    document.createElement(
      "div"
    );


  d.className =
    "float-text";


  d.textContent =
    t;


  d.style.left =
    r.left +
    r.width / 2 -
    20 +
    "px";


  d.style.top =
    r.top +
    30 +
    "px";


  document.body.appendChild(d);


  setTimeout(
    () => d.remove(),
    900
  );

}


function sound(
  freq,
  dur
){

  if(!game.sound)
    return;


  try{

    audioCtx ??=
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();


    const o =
      audioCtx.createOscillator();


    const g =
      audioCtx.createGain();


    o.frequency.value =
      freq;

    o.type =
      "sine";


    g.gain.setValueAtTime(
      .03,
      audioCtx.currentTime
    );


    g.gain.exponentialRampToValueAtTime(
      .001,
      audioCtx.currentTime + dur
    );


    o.connect(g);

    g.connect(
      audioCtx.destination
    );


    o.start();

    o.stop(
      audioCtx.currentTime +
      dur
    );

  }catch(e){}

}


function update(){

  const set =
    (id,v) => {

      const e =
        document.getElementById(
          id
        );

      if(e)
        e.textContent = v;

    };


  set(
    "coins",
    Math.floor(game.coins)
  );

  set(
    "gems",
    game.gems
  );

  set(
    "best",
    game.best
  );

  set(
    "power",
    game.power
  );

  set(
    "auto",
    game.auto
  );

  set(
    "clicks",
    game.clicks
  );

  set(
    "totalEarned",
    Math.floor(
      game.totalEarned
    )
  );

  set(
    "bestCombo",
    game.bestCombo
  );

  set(
    "critCount",
    game.critCount
  );

  set(
    "homePower",
    game.power
  );

  set(
    "levelValue",
    game.level
  );

  set(
    "levelBig",
    game.level
  );

  set(
    "xpValue",
    game.xp
  );

  set(
    "xpNeed",
    xpNeed()
  );

  set(
    "levelReward",
    25 +
    game.level * 25
  );

  set(
    "combo",
    game.combo
  );

  set(
    "multiplier",
    "x" +
    comboMultiplier()
  );


  set(
    "clickPowerText",
    "+" +
    Math.floor(
      game.power *
      (1 + game.gemPower * .25) *
      comboMultiplier() *
      (
        Date.now() <
        game.boostUntil
          ? 2
          : 1
      )
    )
  );


  set(
    "powerCost",
    powerCost()
  );

  set(
    "autoCost",
    autoCost()
  );

  set(
    "critCost",
    critCost()
  );

  set(
    "gemPowerCost",
    gemPowerCost()
  );

  set(
    "streak",
    game.streak
  );

  set(
    "comboTimer",
    (
      game.comboTime / 1000
    ).toFixed(1)
  );


  document
    .getElementById(
      "xpBar"
    )
    .style.width =
      (
        game.xp /
        xpNeed() *
        100
      ) +
      "%";


  document
    .getElementById(
      "comboBar"
    )
    .style.width =
      (
        game.comboTime /
        comboMax *
        100
      ) +
      "%";


  const boost =
    document.getElementById(
      "boostButton"
    );


  const active =
    Date.now() <
    game.boostUntil;


  boost.disabled =
    active;


  document
    .getElementById(
      "boostText"
    )
    .textContent =
      active
        ? Math.ceil(
            (
              game.boostUntil -
              Date.now()
            ) / 1000
          ) + "s"
        : "30s";


  document
    .getElementById(
      "soundButton"
    )
    .textContent =
      game.sound
        ? "🔊 صدا: روشن"
        : "🔇 صدا: خاموش";


  document
    .getElementById(
      "coinIcon"
    )
    .textContent =
      skins.find(
        s =>
          s.id ===
          game.selectedSkin
      )?.icon ||
      "🪙";


  drawMissions();

  drawAchievements();

  drawSkins();


  if(
    game.daily ===
    new Date().toDateString()
  ){

    document
      .getElementById(
        "dailyText"
      )
      .textContent =
        "🎉 جایزه امروز دریافت شده";

  }else{

    document
      .getElementById(
        "dailyText"
      )
      .textContent =
        `جایزه آماده است — استریک فعلی: ${game.streak} روز`;

  }


  const offline =
    Math.min(
      Math.max(
        0,
        Date.now() -
        game.lastSeen
      ),
      8 * 60 * 60 * 1000
    );


  if(
    offline > 60000 &&
    game.auto > 0
  ){

    const gain =
      Math.floor(
        offline / 1000 *
        game.auto *
        .5
      );


    if(gain > 0){

      game.coins += gain;

      game.totalEarned += gain;


      document
        .getElementById(
          "offlineBox"
        )
        .classList
        .remove(
          "hidden"
        );


      document
        .getElementById(
          "offlineBox"
        )
        .textContent =
          `💤 در زمان غیبتت ${gain} سکه درآمد داشتی!`;


      saveGame();

    }

  }

}


update();


setInterval(
  () => update(),
  1000
);
