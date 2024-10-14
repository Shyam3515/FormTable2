/**Explanation:
1.checkFormValidity(): This function checks the validity of the form. If all required fields are filled, it enables the Add button; otherwise, it disables it.
2.Event Listener on Inputs: Each input field has an input event listener that triggers checkFormValidity() whenever the user types something.
3.Form Validation in addData(): Even when submitting, the form validation is checked to ensure that all required fields are valid. If not, reportValidity() will show the validation errors. */
const form = document.getElementById("myForm");
const add = document.querySelector("#add");
// Get input fields
const inputs = form.querySelectorAll("input, textarea");

//function to check validity
function checkFormValidity() {
  if (form.checkValidity()) {
    add.disabled = false;
  } else {
    add.disabled = true;
  }
}

//check all the inputs whether they are filled
inputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

///////////////////////////////////////
let rowNumber = 1;
const empId = document.getElementById("empId");
function empID() {
  let eId = "EMP" + String(rowNumber).padStart(3, "0");
  let empValue = "";
  for (let i = 0; i < 10 - eId.length; i++) {
    empValue += Math.floor(Math.random() * 10);
    empId.value = eId + empValue;
  }
}
empID();

/////////////////////////////////////////////////////////////
const dateInput = document.getElementById("doj");

// Get today's date
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

// Format today's date as YYYY-MM-DD
const formattedToday = `${year}-${month}-${day}`;

// Set min to today and max to one year from today
const oneYearLater = `${year + 1}-${month}-${day}`;

// dateInput.min = formattedToday;
dateInput.max = oneYearLater;
///////////////////////////////////
//Date formatting
document.getElementById("doj").addEventListener("change", function () {
  const dateInput = this.value;

  if (dateInput) {
    const date = new Date(dateInput);

    // Format the date as MM/DD/YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    // Set the value of the text input to the formatted date
    document.getElementById("formattedDoj").value = formattedDate;
  }
});

////////////////////////////////////////////////////////////
const save = document.querySelector("#save");
let currentRow = null; //for storing index

// Paginaiton
const pageNumbers = document.querySelector(".page-numbers");
const rowsPerPage = 5;
let currentPage = 0; // Keeps track of the current page

// Array containing the table headers (excluding the first checkbox column)
let tableJSON = [
  {
    headers: [
      {
        fName: "First Name",
        lName: "Last Name",
        desig: "Designation",
        area: "Address",
        doj: "Joining Date",
      },
    ],
  },
  { originalDataSource: [] },
];
let newObj;
// tableJSON[1].data.push({ eID: empId.value });

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const clearButton = document.querySelector(".clear-button");
const deleteSelectedButton = document.getElementById("deleteSelectedBtn");

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() !== "") {
    clearButton.disabled = false;
    searchButton.disabled = false;
  } else {
    clearButton.disabled = true;
    searchButton.disabled = true;
  }
});

//get the dopdown
const dropdown = document.getElementById("headers");
// Loop through the array and add each option to the dropdown
let tableKeys = tableJSON[0].headers[0];
let keysArray = Object.keys(tableKeys);
const dropHeaders = tableJSON[0].headers[0];
for (let i = 0; i < keysArray.length; i++) {
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

      const sortedData = tableJSON[1].originalDataSource.sort((rowA, rowB) => {
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

      renderTable(tableJSON[1].originalDataSource); //render table with sorted data

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
    //append headers
    headerRow.appendChild(th);
  });

  //for action
  const actionHeader = document.createElement("th");
  const actionText = document.createTextNode("Action");
  actionHeader.appendChild(actionText);
  headerRow.appendChild(actionHeader);

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
  document.getElementById("fname").value =
    tableJSON[1].originalDataSource[index].fName;
  document.getElementById("lname").value =
    tableJSON[1].originalDataSource[index].lName;
  document.getElementById("designation").value =
    tableJSON[1].originalDataSource[index].desig;
  document.getElementById("area").value =
    tableJSON[1].originalDataSource[index].area;
  document.getElementById("formattedDoj").value =
    tableJSON[1].originalDataSource[index].doj;
}

//render data in table
function renderTable(tableData) {
  let tableKeys;
  let keysArray;
  tableBody.innerHTML = ""; // Clear existing rows
  console.log("Table JSON: ", tableJSON);

  //we are doing this bcz, when we delete all data we can't have any data left to get keys
  if (tableData.length > 0) {
    // Convert object keys into an array
    //here as our object is in array, getting keys from first object and passing these keys, to update our cell
    tableKeys = tableData[0];
    keysArray = Object.keys(tableKeys);
  }

  // Determine the slice of data for the current page
  let start = currentPage * rowsPerPage;
  let end = start + rowsPerPage;
  //   const pageData = tableJSON[1].pageData.slice(start, end);
  prevAndNext(); //after updating current page caaling render inside render calling prevAndNext(), to update page active.

  for (let index = start; index < end && index < tableData.length; index++) {
    const data = tableData[index]; // Get the current row from the original data
    console.log(data.eID);
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
      makeEditable(index, keysArray[2], textSpan, input)
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
      makeEditable(index, keysArray[3], textSpan1, input1)
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
      makeEditable(index, keysArray[4], textSpan2, input2)
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
      makeEditable(index, keysArray[5], textSpan3, input3)
    );
    /************************************************************************* */
    const dojCell = newRow.insertCell(5);
    // Create a span to hold the text
    const textSpan4 = document.createElement("span");
    textSpan4.textContent = data.doj; // Set the text inside the span
    // Create a hidden input element inside the cell
    const input4 = document.createElement("input");
    input4.type = "text";
    input4.style.display = "none"; // Initially hidden
    input4.value = data.doj; // Set the initial value
    // Adding custom data-index attribute
    dojCell.setAttribute("data-index", index); // Set the value to any number
    // Append the span and input to the cell
    dojCell.appendChild(textSpan4);
    dojCell.appendChild(input4);

    dojCell.addEventListener("click", () =>
      makeEditable(index, keysArray[6], textSpan4, input4)
    );
    /******************************************************************************** */
    newRow.insertCell(6).innerHTML =
      `<button class="edit-btn">Edit</button>` +
      `<button class="delete-btn" id="${data.eID}" onclick="deleteFunction('${data.eID}', ${index})">Delete</button>`;

    // Add event listener to the new edit button
    newRow.querySelector(".edit-btn").addEventListener("click", function () {
      save.style.display = "block";
      add.style.display = "none";
      currentRow = index;
      populateInputs(currentRow);
    });
  }
}

//////////////////////delete on filter mode
function deleteFunction(dataID, dIndex) {
  //if we click on delete in filter mode, updating the deleted rows in filtered data
  //whether it is in filter mode or normal mode, deleted rows should get updated in actual JSON data always.
  if (tableJSON[1].FilteredDatasource) {
    const updated_data_after_delete = tableJSON[1].originalDataSource.filter(
      (item, index) => item["eID"] !== dataID
    );
    tableJSON[1].originalDataSource = updated_data_after_delete;
    tableJSON[1].FilteredDatasource.splice(dIndex, 1);
    renderTable(tableJSON[1].FilteredDatasource);
    pagination(tableJSON[1].FilteredDatasource);
  } else {
    //updating deleted rows in original data aswell, updating in the JSON's
    tableJSON[1].originalDataSource.splice(dIndex, 1);
    renderTable(tableJSON[1].originalDataSource); //Re-render table data
    pagination(tableJSON[1].originalDataSource);
  }
}

function makeEditable(index, key, span, input) {
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
    const tableIndex = tableJSON[1].originalDataSource[index]; //here typeOf key is string, not a direct value, so we need to follow this process to update the cell
    tableIndex[key] = input.value;
  });
}

//adding into table
add.addEventListener("click", addData);
function addData(e) {
  e.preventDefault();
  //Get input elements
  const fName = document.getElementById("fname").value;
  const lName = document.getElementById("lname").value;
  const desig = document.getElementById("designation").value;
  const area = document.getElementById("area").value;
  const doj = document.getElementById("formattedDoj").value;

  empID();
  /**Overall Flow:
  The form is selected using getElementById.
  Before adding any data, the form's built-in HTML5 validation is checked using checkValidity().
  If the form is invalid, the user is alerted to the issue with reportValidity() (which shows validation errors on the screen).
  If validation fails, the function returns, preventing any further actions like adding data to the table. */

  // Ensure native form validation
  if (!form.checkValidity()) {
    form.reportValidity(); // Highlight invalid fields
    return;
  }
  newObj = {
    isChecked: false,
    eID: empId.value,
    fName,
    lName,
    desig,
    area,
    doj,
  };

  ///////////// Duplicate checking ////////////////////
  duplicateChecking(tableJSON[1].originalDataSource, newObj, [
    "fName",
    "lName",
  ]);

  function duplicateChecking(array, newObj, properties) {
    if (array.length === 0) {
      rowNumber++;
      empID();
      array.push(newObj);
    } else {
      if (hasDuplicate(array, newObj, properties)) {
        alert("duplicates found on properties: Firstname and LastName");
      } else {
        array.push(newObj);
        rowNumber++;
        empID();
      }
    }
  }

  //checks each and every property and returns true / false
  function hasDuplicate(array, newObj, properties) {
    return array.some((item) =>
      properties.some(
        (prop) => item[prop].toLowerCase() === newObj[prop].toLowerCase()
      )
    );
  }

  // Reset the current page to the last page (where new data is added)
  currentPage = Math.floor(
    (tableJSON[1].originalDataSource.length - 1) / rowsPerPage
  );

  if (
    tableJSON[1].originalDataSource.length === 1 ||
    (tableBody.rows.length > 1 &&
      (tableJSON[1].originalDataSource.length - 1) % 5 === 0)
  ) {
    pagination(tableJSON[1].originalDataSource);
    prevAndNext();
  }

  // Render the table (it will only show the first 5 records for the current page)
  renderTable(tableJSON[1].originalDataSource);
  // After inserting we,Clear input fields
  clearInputs();
}

//update
document.getElementById("save").addEventListener("click", function () {
  if (currentRow !== null) {
    // Update the data in the array
    tableJSON[1].originalDataSource[currentRow].fName =
      document.getElementById("fname").value;
    tableJSON[1].originalDataSource[currentRow].lName =
      document.getElementById("lname").value;
    tableJSON[1].originalDataSource[currentRow].desig =
      document.getElementById("designation").value;
    tableJSON[1].originalDataSource[currentRow].area =
      document.getElementById("area").value;
    tableJSON[1].originalDataSource[currentRow].doj =
      document.getElementById("doj").value;

    renderTable(tableJSON[1].originalDataSource);
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
  document.getElementById("formattedDoj").value = "";
  document.getElementById("doj").value = "";
  add.disabled = true;
}

// Check box
const checkAll = document.getElementById("checkAll");
checkAll.addEventListener("click", toggle);
function toggle() {
  const ischecked = checkAll.checked;
  if (tableJSON[1].FilteredDatasource) {
    let checks = document.getElementsByClassName("row-checkbox");
    Array.from(checks).forEach((element, index) => {
      element.checked = ischecked;
      tableJSON[1].FilteredDatasource[index].isChecked = element.checked;
    });
    enableDeleteButton(tableJSON[1].originalDataSource);
  } else {
    let checks = document.getElementsByClassName("row-checkbox");
    Array.from(checks).forEach((element, index) => {
      element.checked = ischecked;
      tableJSON[1].originalDataSource[index].isChecked = element.checked;
    });
    enableDeleteButton(tableJSON[1].originalDataSource);
  }
}

//if any element is unchecked then this function will be called unchecks checkAllElement
function uncheckAllElement(ele) {
  //after clicking check all everything in table will be checked,
  //if we uncheck the any one checkbox in table, checkAll shoulld be unchecked
  checkAll.checked = false;

  let index = parseInt(ele.getAttribute("data-index"));
  if (tableJSON[1].FilteredDatasource) {
    tableJSON[1].FilteredDatasource[index].isChecked = ele.checked;
    enableDeleteButton(tableJSON[1].FilteredDatasource);
  } else {
    tableJSON[1].originalDataSource[index].isChecked = ele.checked;
    enableDeleteButton(tableJSON[1].originalDataSource);
  }
  console.log(tableJSON);
}

//for enabling and disabling deleteSelected button
function enableDeleteButton(data) {
  let checkedData = data.filter((item, index) => item.isChecked === true);

  if (checkedData.length !== 0) {
    deleteSelectedButton.disabled = false;
  } else {
    deleteSelectedButton.disabled = true;
  }
}

//similarly, we can try for check
function checkAllElement() {
  checkAll.checked = true;
}

//this method works for the checkboxes
deleteSelectedButton.addEventListener("click", function () {
  //updating filtered JSON, if we delete the data in filter mode...
  if (tableJSON[1].FilteredDatasource) {
    tableJSON[1].FilteredDatasource = tableJSON[1].FilteredDatasource.filter(
      (item, index) => item.isChecked === false
    );

    if (tableJSON[1].FilteredDatasource.length === 0) {
      checkAll.checked = false;
    }
    //even after deleting also we need to call pagination method to adjust the pages
    pagination(tableJSON[1].FilteredDatasource);
    renderTable(tableJSON[1].FilteredDatasource);
  }

  if (tableJSON[1].originalDataSource.length === 0) {
    //deleting original data after all rows deleted
    if (tableJSON[1].FilteredDatasource) {
      delete tableJSON[1].FilteredDatasource;
    }
  } else {
    // Filter out the unchecked rows
    tableJSON[1].originalDataSource = tableJSON[1].originalDataSource.filter(
      (item, index) => item.isChecked === false
    );
    if (!tableJSON[1].FilteredDatasource) {
      renderTable(tableJSON[1].originalDataSource); // Re-render the table
    }

    if (tableJSON[1].originalDataSource.length === 0) {
      checkAll.checked = false;
    }
    //even after deleting also we need to call pagination method to adjust the pages
    pagination(tableJSON[1].originalDataSource);
  }
  //after deleting again disable it
  deleteSelectedButton.disabled = true;
});

//filtering rows on button click
searchButton.addEventListener("click", () => {
  const dropValue = dropdown.value;
  let inputValue = searchInput.value;
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
    if (!tableJSON[1].FilteredDatasource) {
      tableJSON[1].FilteredDatasource = [...tableJSON[1].originalDataSource]; // Copy the original data
    }

    const filtered_data = tableJSON[1].FilteredDatasource.filter((_, index) =>
      tableJSON[1].FilteredDatasource[index][dropValue]
        .toLowerCase()
        .includes(inputValue)
    );
    tableJSON[1].FilteredDatasource = filtered_data;

    ////////////////////////////
    //when we filter, if we are in another page, we need to move to page 0.
    currentPage = 0;
    //removing current active and adding to first page
    const currentActive = document.querySelector(".page-numbers a.active");
    if (currentActive) currentActive.classList.remove("active");

    const pageNumbers = document.querySelector(".page-numbers");
    // Get the first child element
    const firstElement = pageNumbers.firstElementChild;
    firstElement.classList.add("active");
    ////////////////////////
    renderTable(tableJSON[1].FilteredDatasource);
    pagination(tableJSON[1].FilteredDatasource);
  }
});

//clearing data button
clearButton.addEventListener("click", () => {
  clearButton.disabled = true;
  searchInput.value = "";
  searchButton.disabled = true;
  // Restore original data
  // tableJSON[1].originalDataSource = [...tableJSON[1].FilteredDatasource]; // Reassign the backup to data

  //after clearing we need to clear the original data
  delete tableJSON[1].FilteredDatasource;

  renderTable(tableJSON[1].originalDataSource);
  pagination(tableJSON[1].originalDataSource);
});

/////////////////////////////////////////////////////////////////////

function pagination(data) {
  // Clear any previous pagination links
  pageNumbers.innerHTML = "";
  let totalPages = Math.ceil(data.length / rowsPerPage);
  for (let i = 0; i < totalPages; i++) {
    const a = document.createElement("a");
    // a.setAttribute("href", "#");
    a.id = i;
    a.innerText = i + 1;

    // Add the 'active' class to the first page number by default
    if (i === currentPage) {
      a.classList.add("active");
    }
    pageNumbers.appendChild(a);
  }
  addAnchorListeners(data);
  // prevAndNext();
}

function addAnchorListeners(data) {
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

      // Update the current page
      currentPage = Number(anchor.id);

      // Re-render the table to show the selected page's data

      renderTable(data);
    });
  });
}

//////////////////////////////////////////////////next and prev
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
function prevAndNext() {
  const totalRows = Math.ceil(
    tableJSON[1].originalDataSource.length / rowsPerPage
  );
  const anchors = document.querySelectorAll(".page-numbers a");

  if (totalRows <= 1) {
    //when only one page is there
    prev.style.cursor = "not-allowed";
    next.style.cursor = "not-allowed";
  } else if (
    totalRows == anchors.length &&
    currentPage === anchors.length - 1
  ) {
    //two pages and active in last page
    prev.style.cursor = "pointer";
    next.style.cursor = "not-allowed";
  } else if (totalRows > 1 && currentPage === 0) {
    //there are two pages, but active is in first page.
    prev.style.cursor = "not-allowed";
    next.style.cursor = "pointer";
  } else {
    //remaining all are pointers
    prev.style.cursor = "pointer";
    next.style.cursor = "pointer";
  }
}

prev.addEventListener("click", () => {
  if (currentPage > 0) {
    // Remove 'active' class from the currently active anchor
    const currentActive = document.querySelector(".page-numbers a.active");
    if (currentActive) currentActive.classList.remove("active");
    // Get the previous sibling element
    const previousElement = currentActive.previousElementSibling;
    previousElement.classList.add("active");
    currentPage--;
    renderTable(tableJSON[1].originalDataSource);
  }
});

next.addEventListener("click", () => {
  // const totalRows = Math.ceil(tableJSON[1].data.length / rowsPerPage);
  // if (currentPage < totalRows) {
  const currentActive = document.querySelector(".page-numbers a.active");
  if (currentActive) currentActive.classList.remove("active");
  // Get the previous sibling element
  const nextElement = currentActive.nextElementSibling;
  nextElement.classList.add("active");
  currentPage++;
  renderTable(tableJSON[1].originalDataSource);
  // }
});
