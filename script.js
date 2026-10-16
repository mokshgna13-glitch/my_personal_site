const modeBtn = document.getElementById("modeBtn");

modeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        modeBtn.innerHTML = "☀ Light mode";

    } else {

        modeBtn.innerHTML = "☾ Night mode";

    }

});