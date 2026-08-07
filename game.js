"use strict";

const SAVE_KEY = "tapEmpire_final_save";


const defaultGame = {

    coins:0,

    best:0,

    power:1,

    auto:0,

    clicks:0,

    totalEarned:0,


    combo:0,

    comboTime:0,


    level:1,

    xp:0,


    daily:"",


    claimedMissions:[],


    skins:["classic"],

    selectedSkin:"classic"

};



let game = loadGame();



function loadGame(){

    let saved =
    localStorage.getItem(SAVE_KEY);


    if(saved){

        return {
            ...defaultGame,
            ...JSON.parse(saved)
        };

    }


    return {
        ...defaultGame
    };

}





function saveGame(){

    localStorage.setItem(

        SAVE_KEY,

        JSON.stringify(game)

    );

}





function toast(text){

    let box =
    document.getElementById("toastBox");


    let div =
    document.createElement("div");


    div.className="toast";

    div.textContent=text;


    box.appendChild(div);



    setTimeout(()=>{

        div.remove();

    },2500);


}






function powerCost(){

    return game.power * 100;

}



function autoCost(){

    return (game.auto+1)*250;

}





function xpNeed(){

    return game.level*100;

}





function addXP(value){

    game.xp += value;


    while(game.xp >= xpNeed()){


        game.xp -= xpNeed();


        game.level++;


        toast(
            "👑 سطح جدید: "+game.level
        );


    }

}





function comboMultiplier(){


    if(game.combo>=50)
        return 3;


    if(game.combo>=25)
        return 2;


    if(game.combo>=10)
        return 1.5;


    return 1;

}





function updateCombo(){


    game.combo++;


    if(game.combo>100)

        game.combo=100;



}

// ======================
// کلیک سکه
// ======================


document
.getElementById("coinButton")
.onclick=function(){



    updateCombo();



    let reward = Math.floor(

        game.power *

        comboMultiplier()

    );



    game.coins += reward;


    game.totalEarned += reward;


    game.clicks++;



    if(game.coins > game.best){

        game.best = game.coins;

    }



    addXP(1);



    createParticles();



    saveGame();


    update();



};








// ======================
// ارتقای قدرت
// ======================


document
.getElementById("powerUpgrade")
.onclick=function(){


    let cost = powerCost();



    if(game.coins < cost){

        toast(
            "🪙 سکه کافی نیست"
        );

        return;

    }



    game.coins -= cost;


    game.power++;


    addXP(10);


    toast(
        "⚡ قدرت کلیک افزایش یافت"
    );


    saveGame();


    update();



};








// ======================
// ارتقای خودکار
// ======================


document
.getElementById("autoUpgrade")
.onclick=function(){


    let cost = autoCost();



    if(game.coins < cost){


        toast(
            "🪙 سکه کافی نیست"
        );


        return;

    }




    game.coins -= cost;


    game.auto++;



    addXP(15);



    toast(
        "🤖 درآمد خودکار فعال شد"
    );



    saveGame();


    update();



};







// ======================
// درآمد خودکار
// ======================


setInterval(function(){



    if(game.auto>0){


        game.coins += game.auto;


        game.totalEarned += game.auto;



        if(game.coins > game.best){

            game.best=game.coins;

        }



        addXP(1);



        saveGame();


        update();



    }



},1000);







// ======================
// مأموریت ها
// ======================


const missions=[


{

id:"click100",

title:"👆 صد کلیک",

text:"100 بار روی سکه کلیک کن",

target:100,

reward:200,

type:"click"


},


{

id:"earn1000",

title:"🪙 جمع کردن سکه",

text:"1000 سکه به دست بیاور",

target:1000,

reward:500,

type:"earn"


},


{

id:"level5",

title:"👑 سطح 5",

text:"به سطح 5 برس",

target:5,

reward:1000,

type:"level"


}


];






function missionValue(m){



if(m.type==="click")

return game.clicks;



if(m.type==="earn")

return game.totalEarned;



if(m.type==="level")

return game.level;



return 0;


}







function drawMissions(){


let box =
document.getElementById(
"missionList"
);



if(!box)
return;



box.innerHTML="";



missions.forEach(m=>{



let value =
missionValue(m);



if(value>m.target)

value=m.target;



let done =
game.claimedMissions.includes(m.id);



let html=document.createElement("div");


html.className="mission";



html.innerHTML=`

<b>${m.title}</b>

<p>${m.text}</p>

<p>
${value}/${m.target}
</p>

<button

${done || value<m.target ? "disabled":""}

onclick="claimMission('${m.id}')"

>

${done?"دریافت شد":"دریافت جایزه"}

</button>

`;



box.appendChild(html);



});



}







function claimMission(id){



let m =
missions.find(x=>x.id===id);



if(!m)
return;



if(game.claimedMissions.includes(id))
return;



if(missionValue(m)<m.target)
return;



game.claimedMissions.push(id);



game.coins += m.reward;



toast(
"🎯 جایزه مأموریت گرفتی"
);



saveGame();


update();


drawMissions();


}
// ======================
// جایزه روزانه
// ======================


document
.getElementById("dailyButton")
.onclick=function(){


    let today =
    new Date().toDateString();



    if(game.daily===today){


        toast(
            "🎁 جایزه امروز را گرفتی"
        );


        return;

    }



    game.daily=today;



    game.coins += 500;


    game.totalEarned += 500;



    addXP(20);



    toast(
        "🎁 +500 سکه دریافت کردی"
    );



    saveGame();


    update();



};







// ======================
// اسکین ها
// ======================


const skins=[


{

id:"classic",

name:"🪙 کلاسیک",

icon:"🪙",

price:0

},


{

id:"gold",

name:"🥇 طلایی",

icon:"🥇",

price:1000

},


{

id:"diamond",

name:"💎 الماس",

icon:"💎",

price:5000

},


{

id:"fire",

name:"🔥 آتش",

icon:"🔥",

price:10000

}


];






function drawSkins(){


let box =
document.getElementById(
"skinList"
);



if(!box)
return;



box.innerHTML="";



skins.forEach(s=>{


let owned =
game.skins.includes(s.id);



let div =
document.createElement("div");



div.className="skin";



div.innerHTML=`

<b>${s.name}</b>

<p>
قیمت:
${s.price}
🪙
</p>


<button onclick="selectSkin('${s.id}')">

${

game.selectedSkin===s.id

?

"فعال"

:

owned

?

"انتخاب"

:

"خرید"

}

</button>

`;



box.appendChild(div);



});



}






function selectSkin(id){


let skin =
skins.find(x=>x.id===id);



if(!skin)
return;



if(!game.skins.includes(id)){



if(game.coins < skin.price){


toast(
"🪙 سکه کافی نیست"
);


return;


}



game.coins -= skin.price;



game.skins.push(id);



}



game.selectedSkin=id;



document
.getElementById("coinIcon")
.textContent=skin.icon;



saveGame();


drawSkins();


update();



}








// ======================
// تغییر صفحات
// ======================


document
.querySelectorAll("nav button")
.forEach(btn=>{


btn.onclick=function(){



document
.querySelectorAll(".page")
.forEach(p=>{


p.classList.remove(
"active"
);


});



document
.getElementById(
btn.dataset.page
)
.classList.add(
"active"
);



};



});








// ======================
// افکت ذرات
// ======================


function createParticles(){



let area =
document.getElementById(
"particles"
);



let button =
document.getElementById(
"coinButton"
);



let rect =
button.getBoundingClientRect();



for(let i=0;i<10;i++){



let p =
document.createElement("div");



p.className="particle";



p.style.left =
rect.left+
rect.width/2+
"px";



p.style.top =
rect.top+
rect.height/2+
"px";



p.style.setProperty(
"--x",
(Math.random()*120-60)+"px"
);



p.style.setProperty(
"--y",
(Math.random()*120-60)+"px"
);



area.appendChild(p);



setTimeout(()=>{

p.remove();

},700);



}


}
// ======================
// نمایش اطلاعات
// ======================


function update(){


document.getElementById("coins").textContent =
Math.floor(game.coins);



document.getElementById("best").textContent =
Math.floor(game.best);



document.getElementById("power").textContent =
game.power;



document.getElementById("auto").textContent =
game.auto;



document.getElementById("homePower").textContent =
game.power;



document.getElementById("homeAuto").textContent =
game.auto;



document.getElementById("clickPowerText").textContent =
"+"+
Math.floor(game.power * comboMultiplier());



document.getElementById("combo").textContent =
game.combo;



document.getElementById("multiplier").textContent =
"x"+
comboMultiplier();



document.getElementById("powerCost").textContent =
powerCost();



document.getElementById("autoCost").textContent =
autoCost();



document.getElementById("levelValue").textContent =
game.level;



document.getElementById("xpValue").textContent =
game.xp;



document.getElementById("xpNeed").textContent =
xpNeed();



document.getElementById("xpBar").style.width =

(
(game.xp / xpNeed()) * 100
)
+
"%";



drawMissions();


drawSkins();



}








// ======================
// ذخیره دستی
// ======================


document
.getElementById("saveButton")
.onclick=function(){


saveGame();


toast(
"💾 بازی ذخیره شد"
);


};







// ======================
// شروع دوباره
// ======================


document
.getElementById("resetButton")
.onclick=function(){



let answer =
confirm(
"⚠️ همه پیشرفت پاک شود؟"
);



if(answer){



localStorage.removeItem(
SAVE_KEY
);



location.reload();



}


};








// ======================
// لینک ها
// ======================


document
.getElementById("rubikaButton")
.onclick=function(){


window.location.href =
"https://rubika.ir/tapking";


};




document
.getElementById("supportButton")
.onclick=function(){


window.location.href =
"https://hamibash.com/Tapking";


};







// ======================
// کمبو کاهش آهسته
// ======================


setInterval(()=>{


if(game.combo>0){


game.combo--;


update();



}


},10000);







// ======================
// اجرای اولیه
// ======================


update();


drawMissions();


drawSkins();
