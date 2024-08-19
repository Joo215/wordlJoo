let index = 0;
let attempts = 0;
let Timer;

function appStart() {
  const displayGameclear = () => {
    const div = document.createElement("div");
    div.innerText = "❤️❤️정답입니다❤️❤️";
    div.className = "ok";
    div.style =
      "display:flex; justify-content:center; font-size:20px; align-items:center; position:absolute; top:40vh; left: 35vw; background-color:black;color:white; padding: 40px;";
    document.body.appendChild(div);
  };

  const displayGamover = () => {
    const div = document.createElement("div");
    div.innerText = "🤨🤨❌❌❌❌😱😱";
    div.className = "no";
    div.style =
      "display:flex; justify-content:center; font-size:20px; align-items:center; position:absolute; top:40vh; left: 35vw; background-color:black;color:white; padding: 40px;";
    document.body.appendChild(div);
    clearInterval(Timer);
  };

  const nextLine = () => {
    attempts += 1;
    index = 0;

    if (attempts === 6) return displayGamover();
  };

  const gameover = () => {
    window.removeEventListener("keydown", handlekeydown);
    displayGameclear();
    clearInterval(Timer);
  };

  const handleEnterkey = async () => {
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      const clickBlock = document.querySelector(
        `.keyboard-block[data-key='${입력한_글자}']`
      );

      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6aaa64";
        clickBlock.style.background = "#6aaa64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#c9b458";
        clickBlock.style.background = "#c9b458";
      } else {
        block.style.background = "#787c7e";
        clickBlock.style.background = "#787c7e";
      }
      block.style.color = "white";
      clickBlock.style.color = "white";
    }
    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = (thisBlock) => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const 시작_시간 = new Date();

  const startTimer = () => {
    const 현재_시간 = new Date();
    const 흐른_시간 = new Date(현재_시간 - 시작_시간);
    const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
    const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
    const time = document.querySelector(".timer");
    time.innerText = `${분}:${초}`;
  };

  const handlekeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    if (event.key === "Backspace") handleBackspace(thisBlock);
    else if (index === 5) {
      if (event.key === "Enter") handleEnterkey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  // const handlekeyclick = (event) => {
  //   const clickTaget = event.taget;
  //   const thisBlock = document.querySelector(
  //     `.board-block[data-index='${attempts}${index}']`
  //   );
  //   const clickBlock = document.querySelector(
  //     `.keyboard-block[data-key='${clickTaget}']`
  //   );

  //   if (clickBlock === "Backspace") handleBackspace(thisBlock);
  //   else if (index === 5) {
  //     if (clickBlock === "Enter") handleenterkey();
  //     else return;
  //   } else {
  //     thisBlock.innerText = clickTaget;
  //     index += 1;
  // };

  const handleKeyclick = (event) => {
    const keyclick = event.target.dataset.key;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    // console.log(keyclick);
    if (keyclick === "BAC") {
      handleBackspace();
    } else if (keyclick === "ENT") {
      handleEnterkey();
    } else if (keyclick !== undefined) {
      if (thisBlock) {
        thisBlock.innerText = keyclick;
        index++;
      }
    }
  };

  Timer = setInterval(startTimer, 1000);
  window.addEventListener("keydown", handlekeydown);
  window.addEventListener("click", handleKeyclick);
}

appStart();
