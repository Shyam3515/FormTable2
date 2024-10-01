const add = document.querySelector("#add");
const save = document.querySelector("#save");
let currentRow = null; //for storing index

// Array containing the table headers (excluding the first checkbox column)
let tableJSON = [
  {
    headers: [
      {
        fName: "First Name",
        lName: "Last Name",
        desig: "Designation",
        area: "Address",
        action: "Action",
      },
    ],
  },
  { data: [] },
];

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const clearButton = document.querySelector(".clear-button");
//get the dopdown
const dropdown = document.getElementById("headers");
// Loop through the array and add each option to the dropdown
let tableKeys = tableJSON[0].headers[0];
let keysArray = Object.keys(tableKeys);
const dropHeaders = tableJSON[0].headers[0];
// console.log(keysArray, dropHeaders);
for (let i = 0; i < keysArray.length - 1; i++) {
  const option = document.createElement("option");
  option.text = dropHeaders[keysArray[i]];
  option.value = keysArray[i]; // Set the value as lowercase version of the fruit name
  dropdown.add(option); //u can use appendChild
}

//get the table
const table = document.getElementById("table");

function generateTable(table) {
  let thead = table.createTHead();
  let headerRow = thead.insertRow();

  // Create the first column header with a checkbox
  const checkboxheader = document.createElement("th");
  //create label for the input
  const checkboxLabel = document.createElement("label");
  const headercheckbox = document.createElement("input");
  headercheckbox.type = "checkbox";
  headercheckbox.id = "checkAll";

  //create Text
  const headercheckboxText = document.createTextNode("Select All");
  checkboxLabel.appendChild(headercheckbox);
  checkboxLabel.appendChild(headercheckboxText);
  checkboxheader.appendChild(checkboxLabel);
  headerRow.appendChild(checkboxheader);

  // Loop through the headers array to create and append each header cell
  keysArray.forEach((key, index) => {
    const th = document.createElement("th");
    const span = document.createElement("span");
    span.textContent = dropHeaders[key];

    const arrowUp = document.createElement("i");
    arrowUp.classList.add("fas", "fa-arrow-up");
    arrowUp.style.display = "none";

    const arrowDown = document.createElement("i");
    arrowDown.classList.add("fas", "fa-arrow-down");
    arrowDown.style.display = "none";

    th.appendChild(span);
    th.appendChild(arrowUp);
    th.appendChild(arrowDown);

    let isArrowUpVisible = false;
    th.addEventListener("click", () => {
      const isAscending = th.classList.contains("sort-asc");

      // Remove sorting classes and arrows from all headers except clicked one
      document.querySelectorAll("th").forEach(function (header) {
        header.classList.remove("sort-asc", "sort-desc");
        const arrowUp = header.querySelector(".fa-arrow-up");
        if (arrowUp) arrowUp.style.display = "none";
        const arrowDown = header.querySelector(".fa-arrow-down");
        if (arrowDown) arrowDown.style.display = "none";
      });

      const sortedData = tableJSON[1].data.sort((rowA, rowB) => {
        const textA = rowA[key].toLowerCase();
        const textB = rowB[key].toLowerCase();

        return !isAscending
          ? isNaN(textA) || isNaN(textB)
            ? textA.localeCompare(textB)
            : textA - textB
          : isNaN(textA) || isNaN(textB)
          ? textB.localeCompare(textA)
          : textB - textA;
      });

      renderTable(); //render table with sorted data

      // Toggle sorting direction and update the arrow visibility
      if (isAscending) {
        th.classList.remove("sort-asc");
        th.classList.add("sort-desc");
        th.querySelector(".fa-arrow-down").style.display = "inline-block";
      } else {
        th.classList.remove("sort-desc");
        th.classList.add("sort-asc");
        th.querySelector(".fa-arrow-up").style.display = "inline-block";
      }
    });

    headerRow.appendChild(th);
  });
  // Append the <thead> to the table
  table.appendChild(thead);
  // Create <tbody>
  const tbody = table.createTBody();
  table.appendChild(tbody);
}
generateTable(table); //create table

const tableBody = document
  .getElementById("table")
  .getElementsByTagName("tbody")[0];
/************************************************ */

function populateInputs(index) {
  document.getElementById("fname").value = tableJSON[1].data[index].fName;
  document.getElementById("lname").value = tableJSON[1].data[index].lName;
  document.getElementById("designation").value = tableJSON[1].data[index].desig;
  document.getElementById("area").value = tableJSON[1].data[index].area;
}

//render data in table
function renderTable() {
  //as we have added null values to data and removing them
  // tableJSON[1].data.splice(0, 1);
  let tableKeys;
  let keysArray;
  tableBody.innerHTML = ""; // Clear existing rows
  console.log("Table JSON: ", tableJSON);

  //we are doing this bcz, when we delete all data we can't have any data left to get keys
  if (tableJSON[1].data.length > 0) {
    // Convert object keys into an array
    //here as our object is in array, getting keys from first object and passing these keys, to update our cell
    tableKeys = tableJSON[1].data[0];
    keysArray = Object.keys(tableKeys);
  }

  // Insert data into cells of the new row
  tableJSON[1].data.forEach((data, index) => {
    /**=> You're correct that in the current approach, the text is not explicitly contained within a separate container element inside the cell. When we set firstNameCell.textContent = data.fName;, the text is treated as a "text node" (a child of the td element). Every td element can contain text directly as a child node without needing an explicit wrapper like a <span> or <div>.
    => To address your concern and make things clearer, we can wrap the text in a container element like a span. This way, the text and input can be more explicitly separated and managed. Let's modify the code to wrap the text inside a span element. */

    // Create an empty <tr> element and add it to the 1st position of the table:
    let newRow = tableBody.insertRow();

    //create the checkbox by createElement
    const rowCell = document.createElement("input");
    rowCell.type = "checkbox";
    rowCell.classList.add("row-checkbox");
    // Adding custom data-index attribute
    rowCell.setAttribute("data-index", index); // Set the value to any number
    rowCell.setAttribute("onchange", "uncheckAllElement(this)"); // Calls uncheckAllElement with `this` as parameter
    newRow.insertCell(0).appendChild(rowCell);

    /************************************************************************* */
    // firstName cell
    const firstNameCell = newRow.insertCell(1);
    // Create a span to hold the text
    const textSpan = document.createElement("span");
    textSpan.textContent = data.fName; // Set the text inside the span

    // Create a hidden input element inside the cell
    const input = document.createElement("input");
    input.type = "text";
    input.style.display = "none"; // Initially hidden
    input.value = data.fName; // Set the initial value
    // Adding custom data-index attribute
    firstNameCell.setAttribute("data-index", index); // Set the value to any number
    // Append the span and input to the cell
    firstNameCell.appendChild(textSpan);
    firstNameCell.appendChild(input);

    firstNameCell.addEventListener("click", () =>
      makeEditable(firstNameCell, index, keysArray[1], textSpan, input)
    );

    /************************************************************************* */
    const lastNameCell = newRow.insertCell(2);
    // Create a span to hold the text
    const textSpan1 = document.createElement("span");
    textSpan1.textContent = data.lName; // Set the text inside the span
    // Create a hidden input element inside the cell
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.style.display = "none"; // Initially hidden
    input1.value = data.lName; // Set the initial value
    // Adding custom data-index attribute
    lastNameCell.setAttribute("data-index", index); // Set the value to any number

    // Append the span and input to the cell
    lastNameCell.appendChild(textSpan1);
    lastNameCell.appendChild(input1);

    lastNameCell.addEventListener("click", () =>
      makeEditable(lastNameCell, index, keysArray[2], textSpan1, input1)
    );
    /************************************************************************* */
    const desigCell = newRow.insertCell(3);
    // Create a span to hold the text
    const textSpan2 = document.createElement("span");
    textSpan2.textContent = data.desig; // Set the text inside the span
    // Create a hidden input element inside the cell
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.style.display = "none"; // Initially hidden
    input2.value = data.desig; // Set the initial value
    // Adding custom data-index attribute
    desigCell.setAttribute("data-index", index); // Set the value to any number
    // Append the span and input to the cell
    desigCell.appendChild(textSpan2);
    desigCell.appendChild(input2);

    desigCell.addEventListener("click", () =>
      makeEditable(desigCell, index, keysArray[3], textSpan2, input2)
    );
    /************************************************************************* */
    const addressCell = newRow.insertCell(4);
    // Create a span to hold the text
    const textSpan3 = document.createElement("span");
    textSpan3.textContent = data.area; // Set the text inside the span
    // Create a hidden input element inside the cell
    const input3 = document.createElement("input");
    input3.type = "text";
    input3.style.display = "none"; // Initially hidden
    input3.value = data.area; // Set the initial value
    // Adding custom data-index attribute
    addressCell.setAttribute("data-index", index); // Set the value to any number
    // Append the span and input to the cell
    addressCell.appendChild(textSpan3);
    addressCell.appendChild(input3);

    addressCell.addEventListener("click", () =>
      makeEditable(addressCell, index, keysArray[4], textSpan3, input3)
    );

    newRow.insertCell(5).innerHTML =
      '<button class="edit-btn">Edit</button>' +
      '<button class="delete-btn">Delete</button>';

    // Add event listener to the new edit button
    newRow.querySelector(".edit-btn").addEventListener("click", function () {
      save.style.display = "block";
      add.style.display = "none";
      currentRow = index;
      populateInputs(currentRow);
    });

    //Add event listener to the delete button
    newRow.querySelector(".delete-btn").addEventListener("click", () => {
      //this is if we delete on click, updating original data in filter mode
      if (tableJSON[1].originalData) {
        const dropValue = dropdown.value;
        let inputValue = searchInput.value;
        // Convert the input to lowercase
        inputValue = inputValue.toLowerCase();
        console.log(inputValue);
        const filtered_data = tableJSON[1].originalData.filter(
          (_, index) =>
            tableJSON[1].originalData[index][dropValue].toLowerCase() !==
            inputValue
        );
        tableJSON[1].originalData = filtered_data;
      }

      //this is deleting from main JSON.data
      tableJSON[1].data.splice(index, 1);
      renderTable(); //Re-render table data
    });
  });
}

function makeEditable(cell, index, key, span, input) {
  span.style.display = "none";
  input.style.display = "inline"; // Show the input field

  input.focus(); // Focus on the input for editing
  // input.select(); // Select the existing text for easy editing

  // Handle blur event on the input to save changes and hide input again
  input.addEventListener("blur", () => {
    // Save the updated value back to the cell
    span.textContent = input.value; // Update the cell's text
    span.style.display = "inline";
    input.style.display = "none"; // Hide the input field again

    // Update your data model if needed
    const tableIndex = tableJSON[1].data[index]; //here typeOf key is string, not a direct value, so we need to follow this process to update the cell
    tableIndex[key] = input.value;
  });
}

//adding into table
add.addEventListener("click", addData);
function addData() {
  //Get input elements
  const fName = document.getElementById("fname").value;
  const lName = document.getElementById("lname").value;
  const desig = document.getElementById("designation").value;
  const area = document.getElementById("area").value;

  // if (!fName || !lName || !desig || !area) {
  //   alert("Please fill in all fields.");
  //   return;
  // }

  tableJSON[1].data.push({ isChecked: false, fName, lName, desig, area });

  renderTable(); // Render the updated table
  // After inserting we,Clear input fields
  clearInputs();

  // Call pagination() only after 5 rows have been added
  // Check if we need to call pagination
  if (
    tableBody.rows.length === 1 ||
    (tableBody.rows.length > 1 && (tableBody.rows.length - 1) % 5 === 0)
  ) {
    pagination();
  }

  console.log(tableBody.rows, tableBody.rows);
}

//update
document.getElementById("save").addEventListener("click", function () {
  if (currentRow !== null) {
    // Update the data in the array
    tableJSON[1].data[currentRow].fName =
      document.getElementById("fname").value;
    tableJSON[1].data[currentRow].lName =
      document.getElementById("lname").value;
    tableJSON[1].data[currentRow].desig =
      document.getElementById("designation").value;
    tableJSON[1].data[currentRow].area = document.getElementById("area").value;

    renderTable();
    clearInputs();
    currentRow = null; // Reset currentRow

    save.style.display = "none";
    add.style.display = "block";
  }
});

/**
}
 */

function clearInputs() {
  // Clear input fields
  document.getElementById("fname").value = "";
  document.getElementById("lname").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("area").value = "";
}

// Check box
const checkAll = document.getElementById("checkAll");
checkAll.addEventListener("click", toggle);
function toggle() {
  const ischecked = checkAll.checked;
  let checks = document.getElementsByClassName("row-checkbox");

  Array.from(checks).forEach((element, index) => {
    element.checked = ischecked;
    tableJSON[1].data[index].isChecked = element.checked;
  });
}

//if any element is unchecked then this function will be called unchecks checkAllElement
function uncheckAllElement(ele) {
  //after clicking check all everything in table will be checked,
  //if we uncheck the any one checkbox in table, checkAll shoulld be unchecked
  checkAll.checked = false;

  let index = parseInt(ele.getAttribute("data-index"));
  tableJSON[1].data[index].isChecked = ele.checked;
  // console.log(tableJSON);
}

//similarly, we can try for check
function checkAllElement() {
  checkAll.checked = true;
}

document
  .getElementById("deleteSelectedBtn")
  .addEventListener("click", function () {
    //updating JSON Original, if we delete the data in filter mode...
    if (tableJSON[1].originalData) {
      tableJSON[1].originalData = tableJSON[1].originalData.filter(
        (_, index) => tableJSON[1].originalData[index].isChecked === false
      );
    }

    if (tableBody.rows.length === 0) {
      //deleting original data after all rows deleted
      if (tableJSON[1].originalData) {
        delete tableJSON[1].originalData;
      }
      alert("Please add rows to the table to delete...!");
    } else {
      // Filter out the unchecked rows
      tableJSON[1].data = tableJSON[1].data.filter(
        (_, index) => tableJSON[1].data[index].isChecked === false
      );
      renderTable(); // Re-render the table

      if (tableBody.rows.length === 0) {
        checkAll.checked = false;
      }
    }
  });

//filtering rows on button click
searchButton.addEventListener("click", () => {
  const dropValue = dropdown.value;
  let inputValue = searchInput.value;
  console.log("drop:", dropValue, "-->", inputValue);
  // Convert the input to lowercase
  inputValue = inputValue.toLowerCase();
  if (!dropValue || !inputValue) {
    alert("Please fill in all filter fields...");
    return;
  }

  // Get the table and all rows from the tbody
  const table = document.getElementById("table");
  const rows = table
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");

  // Loop through each row
  for (let i = 0; i < rows.length; i++) {
    // Backup the original data before filtering (if not already backed up)
    if (!tableJSON[1].originalData) {
      tableJSON[1].originalData = [...tableJSON[1].data]; // Copy the original data
    }

    const filtered_data = tableJSON[1].data.filter(
      (_, index) =>
        tableJSON[1].data[index][dropValue].toLowerCase() == inputValue
    );
    tableJSON[1].data = filtered_data;
    renderTable();
  }
});

//clearing data button
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  // Restore original data
  tableJSON[1].data = [...tableJSON[1].originalData]; // Reassign the backup to data

  //after clearing we need to clear the original data
  delete tableJSON[1].originalData;

  renderTable();
});

// Paginaiton
const pageNumbers = document.querySelector(".page-numbers");
const rowsPerPage = 5;
function pagination() {
  // Clear any previous pagination links
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(tableBody.rows.length / rowsPerPage);
  for (let i = 0; i < totalPages; i++) {
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.id = i;
    a.innerText = i + 1;

    // Add the 'active' class to the first page number by default
    if (i === 0) {
      a.classList.add("active");
    }
    pageNumbers.appendChild(a);
  }
  addAnchorListeners();
}
// function pagination() {
//   const a = document.createElement("a");
//   for (let i = 0; i < Math.ceil(tableBody.rows.length / 5); i++) {
//     a.setAttribute("href", "#");
//     a.id = i;
//     a.innerText = i + 1;
//     if (addActive) {
//       a.classList.add("active");
//       addActive = !addActive;
//     }
//   }

//   pageNumbers.appendChild(a);
//   // After appending all anchors, add event listeners
//   addAnchorListeners();
// }

function addAnchorListeners() {
  const anchors = document.querySelectorAll(".page-numbers a");
  anchors.forEach((anchor, index) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior

      // Remove 'active' class from the currently active anchor
      const currentActive = document.querySelector(".page-numbers a.active");
      if (currentActive) currentActive.classList.remove("active");

      // Add 'active' class to the clicked anchor
      anchor.classList.add("active");
      console.log("clicked", anchor.id);

      // Backup the original data before filtering (if not already backed up)
      if (!tableJSON[1].pageData) {
        tableJSON[1].pageData = [...tableJSON[1].data]; // Copy the original data
      }
      // Calculate pagination data based on the clicked page
      let start = Number(anchor.id) * rowsPerPage;
      const pageData = tableJSON[1].pageData.slice(start, start + rowsPerPage);

      tableJSON[1].data = pageData;
      renderTable();
    });
  });
}

/////////////////////////////////////////////////////
// if (tableJSON[1].pageData) {
//   tableJSON[1].data = [...tableJSON[1].pageData];
//   tableJSON[1].pageData = [...tableJSON[1].data]; // Copy the original data
// }
