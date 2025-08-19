document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const returnRow = document.querySelector('.return-row');
  const returnInputs = returnRow ? returnRow.querySelectorAll('input') : [];
  const tripTypeInput = document.querySelector('input[name="tripType"]');

  if (!form || !tripTypeInput) {
    console.error("Required elements not found!");
    return;
  }

  // Function to show/hide return row
  function toggleReturnRow() {
    if (tripTypeInput.value.trim() === 'return') {
      if (returnRow) returnRow.classList.remove('d-none');
      returnInputs.forEach(input => input.setAttribute('required', 'true'));
    } else {
      if (returnRow) returnRow.classList.add('d-none');
      returnInputs.forEach(input => input.removeAttribute('required'));
    }
  }

  // Initial toggle on page load
  toggleReturnRow();

  // Optional: If tripType can change dynamically, listen for changes
  tripTypeInput.addEventListener('change', toggleReturnRow);

  // Form validation
  form.addEventListener('submit', function (e) {
    const departureDateInput = this.departureDate;
    const returnDateInput = this.returnDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depDate = new Date(departureDateInput.value);
    depDate.setHours(0, 0, 0, 0);

    let retDate = null;
    if (returnDateInput && returnDateInput.value) {
      retDate = new Date(returnDateInput.value);
      retDate.setHours(0, 0, 0, 0);
    }

    departureDateInput.setCustomValidity('');
    if (returnDateInput) returnDateInput.setCustomValidity('');

    // Departure date cannot be in the past
    if (depDate < today) {
      departureDateInput.setCustomValidity('Departure date cannot be in the past');
    }

    // Return date must be after departure date
    if (retDate && retDate < depDate) {
      returnDateInput.setCustomValidity('Return date must be after departure date');
    }

    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }

    form.classList.add('was-validated');
  });
});
