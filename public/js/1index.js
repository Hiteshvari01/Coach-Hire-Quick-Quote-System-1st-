document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.needs-validation');
  const pickup = document.getElementById('pickup');
  const destination = document.getElementById('destination');
  const travelersInput = document.getElementById('travelers');
  const minusBtn = document.getElementById('minusBtn');
  const plusBtn = document.getElementById('plusBtn');
  const tripButtons = document.querySelectorAll('.trip-type-btn');
  const tripTypeInput = document.getElementById('tripTypeInput');

  // Plus and Minus Button Functionality
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

  // Trip type selection logic
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

  // Bootstrap custom validation for forms
  var forms = document.querySelectorAll('.needs-validation');

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
// Sample city list
const cities = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Agra", "Varanasi", "Ahmedabad", "Goa", "Lucknow", "Chandigarh", "Udaipur", "Surat", "Kochi", "Mysore", "Amritsar", "Bhopal", "Indore", "Bhubaneswar", "Patna", "Kanpur", "Nagpur", "Jodhpur", "Ranchi", "Dehradun", "Vadodara", "Coimbatore", "Thiruvananthapuram", "Guwahati", "Madurai", "Rajkot", "Srinagar", "Shimla", "Nashik", "Jalandhar", "Ajmer", "Siliguri", "Hubli", "Panaji", "Aligarh", "Rourkela", "Durgapur", "Gwalior", "Meerut", "Noida", "Faridabad", "Tiruchirappalli", "Kota","Khargone","Dewas","khandwa","Dhar"]

// Function to show filtered dropdown
function setupAutocomplete(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        list.innerHTML = '';
        if (value) {
            const filtered = cities.filter(city => city.toLowerCase().includes(value));
            filtered.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                li.classList.add('px-3', 'py-1', 'cursor-pointer', 'hover:bg-gray-200');
                li.addEventListener('click', () => {
                    input.value = city;
                    list.innerHTML = '';
                    list.classList.add('hidden');
                });
                list.appendChild(li);
            });
            list.classList.remove('hidden');
        } else {
            list.classList.add('hidden');
        }
    });

    // Hide list when clicking outside
    document.addEventListener('click', (e) => {
        if (!list.contains(e.target) && e.target !== input) {
            list.classList.add('hidden');
        }
    });
}

// Initialize autocomplete for both inputs
setupAutocomplete('pickup', 'pickup-list');
setupAutocomplete('destination', 'destination-list');
