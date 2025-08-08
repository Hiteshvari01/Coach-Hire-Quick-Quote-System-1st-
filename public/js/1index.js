
  const form = document.querySelector('.form-wrapper');
  const pickup = document.getElementById('pickup');
  const destination = document.getElementById('destination');
  const travelersInput = document.getElementById('travelers');
  const minusBtn = document.getElementById('minusBtn');
  const plusBtn = document.getElementById('plusBtn');
  const tripButtons = document.querySelectorAll('.trip-type-btn');
  const tripTypeInput = document.getElementById('tripTypeInput');

  // ✅ Plus and Minus Button Functionality
  minusBtn.addEventListener('click', () => {
    let currentValue = parseInt(travelersInput.value) || 1;
    if (currentValue > 1) {
      travelersInput.value = currentValue - 1;
    }
  });

  plusBtn.addEventListener('click', () => {
    let currentValue = parseInt(travelersInput.value) || 1;
    if (currentValue < 60) {
      travelersInput.value = currentValue + 1;
    }
  });

  // ✅ Trip type selection logic
  tripButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tripButtons.forEach((b) => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-secondary');
      });

      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-primary');

      tripTypeInput.value = btn.getAttribute('data-type');
    });
  });

 
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
