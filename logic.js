// you are given a list of items and you are remember the order in which they appear and then after some seconds that list gets reshuffled and you drag and drop to reorder the list according to the order each word initially appeared.
// When program start, give user ability to select the number of items in list and the seconds is automatically allocated but the user can decide to decrease the number but can't increase the number.
// For 10 words - 5 seconds, for 20 words - 10 seconds.
// The lowest number of words is 10 can't go below that and the highest number is 50 
// list of items is generated automatically from an online resource

// To calculate the number of seconds that will be automatically allocated to the number of items in list.
// 10words = 5seconds
// 25words = xseconds
// 10x = 25 * 5
// x = 125 / 10
// x = 12.5 ~ 12seconds needed for 25words
// 'x seconds' * 'initial number of words' = 'the given number of words' * 'the initial number of seconds'

const draggable_list = document.querySelector("#draggable-list");
const check = document.querySelector("#check");

const richestPeople = [
  "Jeff Bezos",
  "Bill Gates",
  "Warren Buffett",
  "Bernard Arnault",
  "Carlos Slim Helu",
  "Amancio Ortega",
  "Larry Ellison",
  "Mark Zuckerberg",
  "Michael Bloomberg",
  "Larry Page"
];

// Store listItems
const listItems = [];

let dragStartIndex;

createList();

// Insert list items into DOM
function createList() {
  [...richestPeople]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a,b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((person, index) => {
      const listItem = document.createElement("li");

      listItem.setAttribute("data-index", index);

      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
          <p class="person-name">${person}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      `

      listItems.push(listItem);

      draggable_list.appendChild(listItem);
    });
}