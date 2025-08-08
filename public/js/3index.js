document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const returnFields = document.querySelectorAll('[name="returnDate"], [name="returnTime"]');
  const tripType = document.getElementById('tripType')?.value;

  // 🔍 Debug
  console.log("Trip Type:", tripType);

  // ✅ Hide return fields if one-way
  if (tripType === 'one-way') {
    returnFields.forEach(field => {
      field.closest('.row').style.display = 'none';
      field.removeAttribute('required');
    });
  }

  // ✅ Form submission validation
  form.addEventListener('submit', function (e) {
    const departureDate = this.departureDate.value;
    const departureTime = this.departureTime.value;
    const returnDate = this.returnDate?.value;
    const returnTime = this.returnTime?.value;

    const today = new Date();
    const depDateObj = new Date(departureDate);
    const retDateObj = returnDate ? new Date(returnDate) : null;

    today.setHours(0, 0, 0, 0);
    depDateObj.setHours(0, 0, 0, 0);
    if (retDateObj) retDateObj.setHours(0, 0, 0, 0);

    if (depDateObj < today) {
      alert("Departure date cannot be in the past.");
      e.preventDefault();
      return;
    }

   

    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }

    form.classList.add('was-validated');
  });

  // Bootstrap validation styling
  const forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
});
