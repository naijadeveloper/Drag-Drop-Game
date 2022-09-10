const INTRO_CONTENT = document.querySelector("#content");
const UL_LIST = document.querySelector("ul.list");
const COUNTER = document.querySelector("span.time");
const START_BTN = document.querySelector("#start");
const DRAGGABLE_LIST = document.querySelector("#draggable-list");
const CHECK = document.querySelector("#check");

const RAND_WORDS_LIST = [];
const START_ELEM_ND_END_ELEM = {};

function capitalizeFirstChar (str) {
  let split = str.split("");
  let firstChar = split[0].toUpperCase();
  split.shift();
  split.unshift(firstChar);
  str = split.join("");
  return str;
}

START_BTN.addEventListener('click', () => {
  INTRO_CONTENT.style.display = "none";
  // fetch random words from 'Random Word API'
  fetchRandWords();
});

function fetchRandWords () {
  fetch('https://random-word-api.herokuapp.com/word?number=10')
  .then((res) => res.json())
  .then((list) => {
    // save list for future
    list.forEach((listItem) => {
      RAND_WORDS_LIST.push(listItem);
    });
    // display list to screen
    renderView(list);
  });
}

function renderView (list) {
  UL_LIST.style.display = "block";
  UL_LIST.previousElementSibling.style.display = "block";
  list.forEach((listItem) => {
    const LI = document.createElement("li");
    // Capitalize listItem
    listItem = capitalizeFirstChar(listItem)
    LI.innerHTML = `
      ${listItem}
    `;
    UL_LIST.appendChild(LI);
  })
  // Call timer function
  timer();
}

function timer () {
  COUNTER.style.display = "inline-block";
  // run setTimeout, after, run a function that displays draggable list
  let stopTime = 10;
  let interval = setInterval(() => {
    if (stopTime < 0) {
      clearInterval(interval);
      createDraggableListView();
      return;
    }
    COUNTER.textContent = `${stopTime} seconds left`;
    stopTime--;
  }, 1000);
}


function createDraggableListView () {
  // setting the display of elements to none
  COUNTER.style.display = "none";
  UL_LIST.style.display = "none";
  UL_LIST.previousElementSibling.style.display = "none";
  // setting the display of elements to make it visible
  DRAGGABLE_LIST.style.display = "block";
  DRAGGABLE_LIST.previousElementSibling.style.display = "block";
  CHECK.style.display = "inline-block";
  // Create a reshuffled list and insert to DOM
  [...RAND_WORDS_LIST]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach(value => {
      // Capitalize listItem
      value = capitalizeFirstChar(value);
      //
      const listItem = document.createElement("li");
      listItem.setAttribute("draggable", true)
      listItem.classList.add("draggable");

      listItem.innerHTML = `
        <span class="right-wrong-indicator">
            <i class="fas fa-grip-lines"></i>
        </span>
        <span>${value}</span>
      `
      DRAGGABLE_LIST.appendChild(listItem);
    });
  addEventListeners();
}

function addEventListeners() {
  const DRAG_LIST_ITEMS = DRAGGABLE_LIST.querySelectorAll(".draggable");
  DRAG_LIST_ITEMS.forEach(item => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("drop", dragDrop);
  });
}

function dragStart() { START_ELEM_ND_END_ELEM.startElem = this; }
function dragEnter() { this.classList.add("over"); }
function dragOver(e) {e.preventDefault(); }
function dragLeave() { this.classList.remove("over"); }

function dragDrop() {
  this.classList.remove("over");
  //
  START_ELEM_ND_END_ELEM.endElem = this;
  swapItems(START_ELEM_ND_END_ELEM.startElem, START_ELEM_ND_END_ELEM.endElem);
}

function swapItems(startElem, endElem) {
  let startElemEndSpan = startElem.querySelector("span:last-child");
  let endElemEndSpan = endElem.querySelector("span:last-child");
  //
  startElem.appendChild(endElemEndSpan);
  endElem.appendChild(startElemEndSpan);
}

CHECK.addEventListener("click", checkOrder);

function checkOrder() {
  // setting display of elements to none
  DRAGGABLE_LIST.style.display = "none";
  DRAGGABLE_LIST.previousElementSibling.style.display = "none";
  CHECK.style.display = "none";
  // setting the display of elements to make it visible
  UL_LIST.style.display = "block";
  UL_LIST.innerHTML = '';
  UL_LIST.previousElementSibling.style.display = "block";
  UL_LIST.previousElementSibling.textContent = "Refresh Page to play again";
  //
  let draggables = DRAGGABLE_LIST.querySelectorAll(".draggable");
  draggables.forEach((draggable, index) => {
    let spanContent = draggable.querySelector("span:last-child").textContent.toLowerCase();
    if (spanContent !== RAND_WORDS_LIST[index]) {
      wrongAnswer(spanContent, RAND_WORDS_LIST[index]);
    } else {
      rightAnswer(spanContent);
    }
  });
}

function wrongAnswer (wrong, right) {
  const LI = document.createElement("li");
  LI.innerHTML = `
    <span class="right-wrong-indicator wrong"></span>
    <p>
      <span>${capitalizeFirstChar(right)}</span>
      <span>${capitalizeFirstChar(wrong)}</span>
    </p>
  `;
  LI.classList.add("final-list-li");
  UL_LIST.appendChild(LI);
}

function rightAnswer (right) {
  const LI = document.createElement("li");
  LI.innerHTML = `
    <span class="right-wrong-indicator right"></span>
    <span>${capitalizeFirstChar(right)}</span>
  `;
  LI.classList.add("final-list-li");
  UL_LIST.appendChild(LI);
}