let coins =
Number(localStorage.getItem("coins")) || 0;


let best =
Number(localStorage.getItem("tapEmpireBest")) || 0;



document.getElementById("best").innerHTML =
"🏆 رکورد: " + best;
document.getElementById("coins").innerHTML =
"🪙 سکه: " + coins;


function tapCoin(){
const button = document.getElementById("coinButton");

button.style.transform = "scale(1.12)";

setTimeout(() => {

    button.style.transform = "scale(1)";

}, 100);

    coins++;
createParticles();
    localStorage.setItem(
    "coins",
    coins
);

    document.getElementById("coins").innerHTML =
    "🪙 سکه: " + coins;



    if(coins > best){


        best = coins;


      localStorage.setItem(
    "tapEmpireBest",
    String(best)
);


        document.getElementById("best").innerHTML =
        "🏆 رکورد: " + best;


    }


}






function support(){

    window.open(

        "https://hamibash.com/Tapking",

        "_blank"

    );

}
function createParticles(){

    const container =
    document.getElementById("particles");

    const button =
    document.getElementById("coinButton");

    const rect =
    button.getBoundingClientRect();

    for(let i=0;i<15;i++){

        const p =
        document.createElement("div");

        p.className="particle";

        p.style.left=
        rect.left+rect.width/2+"px";

        p.style.top=
        rect.top+rect.height/2+"px";

        p.style.setProperty(
            "--x",
            (Math.random()*160-80)+"px"
        );

        p.style.setProperty(
            "--y",
            (Math.random()*160-80)+"px"
        );

        container.appendChild(p);

        setTimeout(()=>{

            p.remove();

        },700);

    }

}
function restartGame(){

    if(confirm("آیا مطمئن هستی که می‌خواهی از اول شروع کنی؟")){

        coins = 0;

        localStorage.setItem("coins", coins);

        document.getElementById("coins").innerHTML =
        "🪙 سکه: " + coins;

    }

}