const form = document.getElementById('classForm');
const classContainer = document.getElementById('classContainer');
const submitBtn = document.getElementById('submitBtn');
const saveBtn = document.getElementById('saveBtn');

let editMode = false;
let classBeingEdited = null;

// Load from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('classSchedules');
  if (stored) {
    JSON.parse(stored).forEach(data => addClassToDOM(data));
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const classData = getClassDataFromForm();
  if (!classData) return;

  if (editMode && classBeingEdited) {
    classContainer.removeChild(classBeingEdited);
    classBeingEdited = null;
    editMode = false;
    submitBtn.textContent = "Add Class";
  }

  addClassToDOM(classData);
  saveClassesToStorage();
  form.reset();
});

// Get form data
function getClassDataFromForm() {
  const className = document.getElementById('className').value.trim();
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const lateAllowance = document.getElementById('lateAllowance').value;
  const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(cb => cb.value);

  if (!className || selectedDays.length === 0) {
    alert("Please enter a class name and select at least one day.");
    return null;
  }

  return { className, startTime, endTime, lateAllowance, selectedDays };
}

// Create and append class element
function addClassToDOM({ className, startTime, endTime, lateAllowance, selectedDays }) {
  const section = document.createElement('div');
  section.className = "class-section";

  const header = document.createElement('h3');
  header.textContent = className;

  const timeP = document.createElement('p');
  timeP.innerHTML = `<strong>Time:</strong> <span>${formatTime(startTime)} - ${formatTime(endTime)}</span>`;

  const dayP = document.createElement('p');
  dayP.innerHTML = `<strong>Day:</strong> <span>${selectedDays.join(', ')}</span>`;

  const allowanceP = document.createElement('p');
  allowanceP.innerHTML = `<strong>Late Allowance:</strong> <span>${lateAllowance} mins</span>`;

  section.appendChild(header);
  section.appendChild(timeP);
  section.appendChild(dayP);
  section.appendChild(allowanceP);
  classContainer.appendChild(section);

  // Buttons
  const btnSpan = document.createElement('span');
  btnSpan.style.marginLeft = 'auto';
  btnSpan.style.display = 'flex';
  btnSpan.style.gap = '0.3rem';

  const editBtn = document.createElement('button');
  editBtn.className = 'small edit-btn';
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'small delete-btn';
  deleteBtn.textContent = 'Delete';

  btnSpan.appendChild(editBtn);
  btnSpan.appendChild(deleteBtn);
  header.appendChild(btnSpan);

  // Edit button
  editBtn.addEventListener('click', () => {
    document.getElementById('className').value = className;
    document.getElementById('startTime').value = startTime;
    document.getElementById('endTime').value = endTime;
    document.getElementById('lateAllowance').value = lateAllowance;
    document.querySelectorAll('input[name="day"]').forEach(cb => {
      cb.checked = selectedDays.includes(cb.value);
    });

    classBeingEdited = section;
    editMode = true;
    submitBtn.textContent = "Update Class";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Delete button
  deleteBtn.addEventListener('click', () => {
    if (confirm(`Delete "${className}"?`)) {
      classContainer.removeChild(section);
      saveClassesToStorage();
    }
  });
}

// Save classes to localStorage
function saveClassesToStorage() {
  const sections = document.querySelectorAll('.class-section');
  const data = [...sections].map(section => {
    const name = section.querySelector('h3').childNodes[0].textContent.trim();
    const times = section.querySelector('p:nth-child(2) span').textContent.split(' - ');
    const days = section.querySelector('p:nth-child(3) span').textContent.split(', ');
    const allowance = parseInt(section.querySelector('p:nth-child(4) span').textContent);
    return {
      className: name,
      startTime: to24hr(times[0]),
      endTime: to24hr(times[1]),
      lateAllowance: allowance,
      selectedDays: days
    };
  });

  localStorage.setItem('classSchedules', JSON.stringify(data));
}

// Convert 12hr to 24hr for storage
function to24hr(time12) {
  const [time, ampm] = time12.trim().split(' ');
  let [hour, min] = time.split(':').map(Number);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${min}`;
}

// Convert 24hr to 12hr for display
function formatTime(time24) {
  let [hour, minute] = time24.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Save button click (optional)
saveBtn.addEventListener('click', () => {
  saveClassesToStorage();
  alert('Classes saved!');
});

// Dashboard nav
const dashboardBtn = document.getElementById('dashboardBtn');
dashboardBtn.addEventListener('click', () => {
  window.location.href = 'index.html'; // or your actual path
});
    