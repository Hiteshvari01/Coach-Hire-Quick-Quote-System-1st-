document.addEventListener("DOMContentLoaded", () => { 
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const formSubsection = document.querySelector(".form-subsection");
  const btnGroup = document.querySelector(".btn-group");
  const addStopBtn = document.getElementById("addStopBtn");
  const addStopbtnWrapper = document.getElementById("addStopbtnWrapper");
  const extraStopContainer = document.getElementById("extraStopContainer");

  const sameStopsCheckbox = document.getElementById("sameStops");
  const returnStopSection = document.getElementById("returnStopSection");
  const returnAddStopBtn = document.getElementById("returnAddStopBtn");
  const returnStopContainer = document.getElementById("returnStopContainer");

  const stopsForm = document.getElementById("stopsForm");
  const extraStopChoiceInput = document.getElementById("extraStopChoice");
  let stopChoice = "no"; // default: assume No is selected at start

  // Initial state 
formSubsection.style.display = "none";
btnNo.classList.add("active");
btnNo.classList.remove("inactive");
btnYes.classList.remove("active");
btnYes.classList.add("inactive");
btnGroup.style.marginBottom = "10rem";  // No button active
extraStopChoiceInput.value = "no";

// Handling Yes/No buttons
btnYes.addEventListener("click", () => {
  stopChoice = "yes";
  extraStopChoiceInput.value = "yes";
  btnYes.classList.add("active");
  btnYes.classList.remove("inactive");
  btnNo.classList.remove("active");
  btnNo.classList.add("inactive");
  formSubsection.style.display = "block";
  btnGroup.style.marginBottom = "0";  // No bottom margin for Yes
});

btnNo.addEventListener("click", () => {
  stopChoice = "no";
  extraStopChoiceInput.value = "no";
  btnNo.classList.add("active");
  btnNo.classList.remove("inactive");
  btnYes.classList.remove("active");
  btnYes.classList.add("inactive");
  formSubsection.style.display = "none";
  btnGroup.style.marginBottom = "10rem"; // Bottom margin for No
});

  // Add Going Stop
  addStopBtn.addEventListener("click", function () {
    const newRow = document.createElement("div");
    newRow.classList.add("row", "g-2", "mb-1", "align-items-end");
    newRow.innerHTML = `
      <input type="hidden" name="stopType[]" value="going" />
       <div class="flex items-start gap-2 stop-row w-full flex-nowrap">
    <!-- Stop Location -->
    <div class="flex-1 min-w-0">
      
      <div class="relative w-full">
        <input
          type="text"
          name="location[]"
          placeholder="Start typing an address or Eircode..."
          class=" form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 text-xs pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-b from-gray-100 to-white placeholder-transparent md:placeholder:text-xs"
          required
        />
        <i class="bi bi-geo-alt-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer text-xs"></i>
      </div>
    </div>

    <!-- Duration + Remove Button in same column -->
    <div class="flex flex-col w-28 flex-shrink-0">
      
      <div class="flex items-center gap-1">
        <div class="relative flex-1">
          <input
            type="text"
            name="duration[]"
            placeholder="Min"
            class=" form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-transparent md:placeholder:text-xs bg-gradient-to-b from-gray-100 to-white"
            oninput="this.value = this.value.replace(/[^0-9]/g,'')"
            required
          />
          <i class="bi bi-clock-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-xs"></i>
        </div>

        <!-- Remove button outside input but in same column -->
        <button type="button" class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gray-300 rounded-full hover:bg-red-500 hover:text-white remove-stop-btn text-xs">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
  </div>

</div>
    `;
    extraStopContainer.appendChild(newRow);

    const removeBtn = newRow.querySelector(".remove-stop-btn");
    removeBtn.addEventListener("click", () => newRow.remove());
  });

  // Same Stops Checkbox
  sameStopsCheckbox?.addEventListener("change", function () {
    returnStopContainer.innerHTML = ""; // Clear existing return stops

    if (this.checked) {
      const goingStops = extraStopContainer.querySelectorAll(".row");

      goingStops.forEach(row => {
        const locationInput = row.querySelector('input[name="location[]"]');
        const durationInput = row.querySelector('input[name="duration[]"]');

       const returnRow = document.createElement("div");
returnRow.classList.add("row", "g-2", "mb-1", "align-items-end");
returnRow.innerHTML = `
  <input type="hidden" name="stopType[]" value="return" />
  <div class="flex items-start gap-2 stop-row w-full flex-nowrap">
    <div class="flex-1 min-w-0">
      <div class="relative w-full">
        <input
          type="text"
          value="${locationInput.value}"
          name="location[]"
          placeholder="Start typing an address or Eircode..."
          class="form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 text-xs pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-b from-gray-100 to-white placeholder-transparent md:placeholder:text-xs"
          required
        />
        <i class="bi bi-geo-alt-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer text-xs"></i>
      </div>
    </div>
    <div class="flex flex-col w-28 flex-shrink-0">
      <div class="flex items-center gap-1">
        <div class="relative flex-1">
          <input
            type="text"
            value="${durationInput.value}"
            name="duration[]"
            placeholder="Min"
            class="form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-transparent md:placeholder:text-xs bg-gradient-to-b from-gray-100 to-white"
            oninput="this.value = this.value.replace(/[^0-9]/g,'')"
            required
          />
          <i class="bi bi-clock-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-xs"></i>
        </div>
        <button type="button" class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gray-300 rounded-full hover:bg-red-500 hover:text-white remove-stop-btn text-xs">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
  </div>
`;

        returnStopContainer.appendChild(returnRow);
        const removeBtn = returnRow.querySelector(".remove-stop-btn");
        removeBtn.addEventListener("click", () => returnRow.remove());
      });

      returnStopSection.style.display = "block";
    } else {
      returnStopSection.style.display = "block";
    }
  });

  // Add Return Stop
  returnAddStopBtn?.addEventListener("click", function () {
    const returnRow = document.createElement("div");
    returnRow.classList.add("row", "g-2", "mb-1", "align-items-end");
    returnRow.innerHTML = `
      <input type="hidden" name="stopType[]" value="return" />
        <div class=" mb-2 flex items-start gap-2 stop-row w-full flex-nowrap">
    <!-- Stop Location -->
    <div class="flex-1 min-w-0">
      
      <div class="relative w-full">
        <input
          type="text"
          name="location[]"
          placeholder="Start typing an address or Eircode..."
          class=" form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 text-xs pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-b from-gray-100 to-white placeholder-transparent md:placeholder:text-xs"
          required
        />
        <i class="bi bi-geo-alt-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer text-xs"></i>
      </div>
    </div>

    <!-- Duration + Remove Button in same column -->
    <div class="flex flex-col w-28 flex-shrink-0">
     
      <div class="flex items-center gap-1">
        <div class="relative flex-1">
          <input
            type="text"
            name="duration[]"
            placeholder="Min"
            class=" form-control w-full rounded-lg border border-gray-300 py-2.5 px-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-transparent md:placeholder:text-xs bg-gradient-to-b from-gray-100 to-white"
            oninput="this.value = this.value.replace(/[^0-9]/g,'')"
            required
          />
          <i class="bi bi-clock-fill absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-xs"></i>
        </div>

        <!-- Remove button outside input but in same column -->
        <button type="button" class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-gray-300 rounded-full hover:bg-red-500 hover:text-white remove-stop-btn text-xs">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
  </div>

    `;
    returnStopContainer.appendChild(returnRow);

    const removeBtn = returnRow.querySelector(".remove-stop-btn");
    removeBtn.addEventListener("click", () => returnRow.remove());
  });

});

// Validation Handling
(function () {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const stopChoice = document.getElementById("extraStopChoice").value;

      if (stopChoice === "no") {
        // If user said No to extra stops, remove required from all related inputs
        const stopInputs = form.querySelectorAll('.form-subsection input[required]');
        stopInputs.forEach(input => input.removeAttribute('required'));
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
