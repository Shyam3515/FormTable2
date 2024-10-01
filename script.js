const add = document.querySelector("#add");
const save = document.querySelector("#save");
let currentRow = null; //for storing index

// Array containing the table headers (excluding the first checkbox column)
let tableJSON = [
  { headers: ["First Name", "Last Name", "Designation", "Address", "Action"] },
  { data: [] },
];

const searchInput = document.querySelector(".search-input").value;
const searchButton = document.querySelector(".search-button");
const clearButton = document.querySelector(".clear-button");
//get the dopdown
const dropdown = document.getElementById("headers").value;
// Loop through the array and add each option to the dropdown
// let tableKeys;
// let keysArray;
// tableKeys = tableJSON[1].data[0];
// keysArray = Object.keys(tableKeys);
// const dropHeaders = tableJSON[0].headers;
// for (let i = 0; i < dropHeaders.length - 1; i++) {
//   const option = document.createElement("option");
//   option.text = tableJSON[0].headers[i];
//   // option.value = keysArray[i + 1]; // Set the value as lowercase version of the fruit name
//   dropdown.add(option); //u can use appendChild
// }

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
  tableJSON[0].headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
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
    if (tableBody.rows.length === 0) {
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
  const dropValue = dropdown;
  let inputValue = searchInput;
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

    searchInput.value = "";
  }
});

//clearing data button
clearButton.addEventListener("click", () => {
  // Restore original data
  tableJSON[1].data = [...tableJSON[1].originalData]; // Reassign the backup to data

  renderTable();
});
