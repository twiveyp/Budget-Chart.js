var dialMax = 0;
var curentSavings = 0;
function updateSavingsGoal(e) {
  dialMax = $(e).val(); // Get value of Savings Goal input
  $('.dial').trigger(
    'configure', {
      'max': dialMax // Update max of the savings dial
    }
  );
}
function updateSavings(e) {
  currentSavings = $(e).val(); // Get value of the current savings input
  $('.dial')
    .val($(e).val()) // Update value of the savings dial according to the savings input
    .trigger('change');
}

$('input.savingsGoal').on("input", function() {
  updateSavingsGoal(this); // Update savings goal
  updateSavings($('.dial'));
});
$('input.totalSavings').on("input", function() {
  updateSavings(this); // Update savings
});

const json_url = '/data.json'; // Get JSON file
const expenseData = [];
const incData = [];
const saveData = [];
const savingGoal = [];
async function getJSON() {
  const response = await fetch(json_url); // Response waits for JSON file to set variable
  const data = await response.json(); // ""
  for (var i = 0; i < data.length; i++) {
    expenseData.push(data[i].expenses); // Update expenses variable with data from JSON
    incData.push(data[i].income); // Update income variable with data from JSON
    saveData.push(data[i].savings); // Update savings variable with data from JSON
    savingGoal.push(data[i].savingsgoal); // Update savings goal variable with data from JSON
  }

  async function knobCreate() { // Create savings dial
    $('.dial').knob({
      //'max': savingGoal[0],
      'thickness': .2, // Thickness of dial
      'fgColor': '#66C3FF',
      'width': 150,
      'height': 150,
      'displayInput': true, // true of false
      'bgColor': '#f0f0f0',
      'readOnly': true, // true or false
      'font': '"Roboto", sans-serif'
    });
  }
  knobCreate(); // Run creation of dial
  chartIt(); // Run creation of pie chart
}
getJSON(); // Run get JSON (Fetches data and creates the dial and pie chart)

function openDropdown() { // Open Filter Dropdown Function
  $(".dropdownFilterMenu").addClass("dropdownOpen");
  $(".dropdownItem").show();
  $("button.btn").css({
    "border-radius": "5px 5px 0 0"
  });
  gsap.to(".dropdownItem", {
    duration: 0.1,
    css: {
      marginTop: 0
    }
  });
  $(".dropdownFilterMenu").css({
    border: "1px solid #f0f0f0"
  });
}

function closeDropdown() { // Close Filter Dropdown Function
  $(".dropdownFilterMenu").removeClass("dropdownOpen");
  gsap.to(".dropdownItem", {
    duration: 0.1,
    css: {
      marginTop: -38
    }
  });
  $("button.btn").css({
    "border-radius": "5px"
  });
  $(".dropdownFilterMenu").css({
    border: "none"
  });
}
$(document).click(function(e) {
  if ($(e.target).is('.btn, .dropdownFilterMenu')) { // If user clicks on filter button or filter menu
    if ($(".dropdownFilterMenu").hasClass("dropdownOpen")) { // and if the dropdown is already open
      closeDropdown(); // close
    } else {
      openDropdown(); // open
    }
  } else {
    closeDropdown(); // If the user clicks somewhere other than the filter button or filter menu. Close dropdown
  }
});
$(".dropdownItem").click(function() { // Once a user clicks on a dropdown item in the filter menu
  $("#dropdownMenuButton").text($(this).text()); // Replace the value of the filter button
  closeDropdown(); // then close the dropdown
});

// Pie Chart
async function chartIt() {
  const leftBudgetChart = document.getElementById("leftBudgetChart").getContext("2d");
  const budgetChart = new Chart(leftBudgetChart, {
    type: "pie", // Can be line, bar, radar, doughnut, pie, polar area, bubble, and scatter
    data: {
      labels: ["Income", "Expenses", "Savings"], // Set labels for the data
      datasets: [{
        label: "Patrick and Jessie", // Set label for the entire dataset
        data: [
          incData,
          expenseData,
          saveData
        ],
        backgroundColor: [
          "#363732",
          "#53D8FB",
          "#66C3FF"
        ]
      }]
    },
    options: {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      legend: {
        display: true // True or false - for the legend to display
      },
      tooltips: {
        enabled: true,
        cornerRadius: 6,
        backgroundColor: "rgba(0, 0, 0, 0.7)"
      },
      responsive: true, // Responsive pie chart sizing
      maintainAspectRatio: true,
      cutoutPercentage: 0 // Change from pie chart to doughnut. 0-100
    }
  });
}
