  // Key for localStorage
        const STORAGE_KEY = 'studentManagerStudents';

        // Load students from localStorage or initialize empty array
        let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // To keep track of the last used ID (to avoid duplicates)
        let studentId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;

        const form = document.getElementById('student-form');
        const studentList = document.getElementById('student-list');
        const modal = document.getElementById('student-details-modal');
        const modalContent = document.getElementById('student-details-content');
        const closeModal = document.getElementById('close-modal');
        const searchInput = document.getElementById('search-input');

        // Save students array to localStorage
        function saveStudents() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        }

        // Function to render student list, optionally filtered by search term
        function renderStudents(filter = '') {
            studentList.innerHTML = '';
            const filteredStudents = students.filter(student =>
                student.name.toLowerCase().includes(filter.toLowerCase())
            );
            if (filteredStudents.length === 0) {
                studentList.innerHTML = '<p class="text-gray-500">No students found.</p>';
                return;
            }
            filteredStudents.forEach(student => {
                const studentDiv = document.createElement('div');
                studentDiv.className = 'bg-gray-50 p-3 rounded-lg flex justify-between items-center';
                studentDiv.innerHTML = `
                    <span class="font-medium">${student.name} (ID: ${student.id})</span>
                    <div class="space-x-2">
                        <button class="check-details bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300" data-id="${student.id}">Check Details</button>
                        <button class="delete-student bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300" data-id="${student.id}">Delete</button>
                    </div>
                `;
                studentList.appendChild(studentDiv);
            });
        }

        // Add student event listener
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const newStudent = {
                id: ++studentId,
                name: document.getElementById('student-name').value.trim(),
                age: parseInt(document.getElementById('student-age').value),
                grade: document.getElementById('student-grade').value.trim(),
                email: document.getElementById('student-email').value.trim(),
                phone: document.getElementById('student-phone').value.trim()
            };
            students.push(newStudent);
            saveStudents();
            renderStudents(searchInput.value);
            form.reset(); // Clear form after adding
        });

        // Event delegation for check details and delete buttons
        studentList.addEventListener('click', function (e) {
            const target = e.target;
            if (target.classList.contains('check-details')) {
                const studentId = target.dataset.id;
                const student = students.find(s => s.id == studentId);
                if (student) {
                    modalContent.innerHTML = `
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Age:</strong> ${student.age}</p>
                        <p><strong>Grade:</strong> ${student.grade}</p>
                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Phone:</strong> ${student.phone}</p>
                    `;
                    modal.classList.remove('hidden');
                }
            } else if (target.classList.contains('delete-student')) {
                const studentId = target.dataset.id;
                if (confirm('Are you sure you want to delete this student?')) {
                    students = students.filter(s => s.id != studentId);
                    saveStudents();
                    renderStudents(searchInput.value);
                }
            }
        });

        // Close modal event listener
        closeModal.addEventListener('click', function () {
            modal.classList.add('hidden');
        });

        // Close modal on overlay click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Search input event listener
        searchInput.addEventListener('input', function () {
            renderStudents(this.value);
        });

        // Initial render on page load
        renderStudents();