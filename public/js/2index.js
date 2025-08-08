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
  btnGroup.style.marginBottom = "10rem";
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
    btnGroup.style.marginBottom = "1rem";
  });

  btnNo.addEventListener("click", () => {
    stopChoice = "no";
    extraStopChoiceInput.value = "no";
    btnNo.classList.add("active");
    btnNo.classList.remove("inactive");
    btnYes.classList.remove("active");
    btnYes.classList.add("inactive");
    formSubsection.style.display = "none";
    btnGroup.style.marginBottom = "10rem";
  });

  // Add Going Stop
  addStopBtn.addEventListener("click", function () {
    const newRow = document.createElement("div");
    newRow.classList.add("row", "g-2", "mb-1", "align-items-end");
    newRow.innerHTML = `
      <input type="hidden" name="stopType[]" value="going" />
      <div class="col-12 col-md-8">
        <div class="input-icon-wrapper mb-3">
          <input type="text" name="location[]" class="form-control with-icon" placeholder="Start typing an address or Eircode..." required oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
          <i class="bi bi-geo-alt-fill text-primary icon-inside open-map" style="cursor: pointer;"></i>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="input-icon-wrapper mb-3">
          <input type="number" name="duration[]" class="form-control with-icon" required />
          <i class="bi bi-clock-fill text-primary icon-inside"></i>
        </div>
      </div>
      <div class="col-1 col-md-1">
        <div class="form-control only-icon remove-stop-btn rounded-circle" style="cursor: pointer;">
          <i class="fa fa-times"></i>
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
          <div class="col-12 col-md-8">
            <div class="input-icon-wrapper mb-3">
              <input type="text" name="location[]" class="form-control with-icon" value="${locationInput.value}" placeholder="Start typing an address or Eircode..." required oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
              <i class="bi bi-geo-alt-fill text-primary icon-inside open-map" style="cursor: pointer;"></i>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="input-icon-wrapper mb-3">
              <input type="number" name="duration[]" class="form-control with-icon" value="${durationInput.value}" required />
              <i class="bi bi-clock-fill text-primary icon-inside"></i>
            </div>
          </div>
          <div class="col-1 col-md-1">
            <div class="form-control only-icon remove-stop-btn rounded-circle" style="cursor: pointer;">
              <i class="fa fa-times"></i>
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
      <div class="col-12 col-md-8">
        <div class="input-icon-wrapper mb-3">
          <input type="text" name="location[]" class="form-control with-icon" placeholder="Start typing an address or Eircode..." required />
          <i class="bi bi-geo-alt-fill text-primary icon-inside open-map" style="cursor: pointer;"></i>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="input-icon-wrapper mb-3">
          <input type="number" name="duration[]" class="form-control with-icon" required />
          <i class="bi bi-clock-fill text-primary icon-inside"></i>
        </div>
      </div>
      <div class="col-1 col-md-1">
        <div class="form-control only-icon remove-stop-btn rounded-circle" style="cursor: pointer;">
          <i class="fa fa-times"></i>
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
