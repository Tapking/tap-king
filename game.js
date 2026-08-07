let coins =
    Number(localStorage.getItem("coins")) || 0;

let best =
    Number(localStorage.getItem("tapEmpireBest")) || 0;


// نمایش اولیه
document.getElementById("best").innerHTML =
    "🏆 رکورد: " + best;

document.getElementById("coins").innerHTML =
    "🪙 سکه: " + coins;


// کلیک روی سکه
function tapCoin() {

    const button =
        document.getElementById("coinButton");

    button.style.transform = "scale(1.12)";

    setTimeout(() => {

        button.style.transform = "scale(1)";

    }, 100);


    coins++;


    // ذخیره سکه
    localStorage.setItem(
        "coins",
        String(coins)
    );


    // افکت ذرات
    createParticles();


    // نمایش سکه
    document.getElementById("coins").innerHTML =
        "🪙 سکه: " + coins;


    // بررسی رکورد
    if (coins > best) {

        best = coins;

        localStorage.setItem(
            "tapEmpireBest",
            String(best)
        );

        document.getElementById("best").innerHTML =
            "🏆 رکورد: " + best;
    }

}


// حمایت
function support() {

    window.location.href =
        "https://hamibash.com/Tapking";

}


// کانال روبیکا
function openRubika() {

    window.location.href =
        "https://rubika.ir/tapking";

}


// ساخت ذرات
function createParticles() {

    const container =
        document.getElementById("particles");

    const button =
        document.getElementById("coinButton");

    if (!container || !button) {
        return;
    }


    const rect =
        button.getBoundingClientRect();


    for (let i = 0; i < 15; i++) {

        const p =
            document.createElement("div");

        p.className = "particle";


        p.style.left =
            rect.left +
            rect.width / 2 +
            "px";


        p.style.top =
            rect.top +
            rect.height / 2 +
            "px";


        p.style.setProperty(
            "--x",
            (Math.random() * 160 - 80) + "px"
        );


        p.style.setProperty(
            "--y",
            (Math.random() * 160 - 80) + "px"
        );


        container.appendChild(p);


        setTimeout(() => {

            p.remove();

        }, 700);

    }

}


// شروع دوباره
function restartGame() {

    if (
        confirm(
            "آیا مطمئن هستی که می‌خواهی سکه‌ها را از اول شروع کنی؟"
        )
    ) {

        coins = 0;


        localStorage.setItem(
            "coins",
            "0"
        );


        document.getElementById("coins").innerHTML =
            "🪙 سکه: 0";

    }

}
