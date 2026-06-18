document.getElementById('portfolioForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Reset Ralat
    document.querySelectorAll('.error-msg').forEach(msg => msg.style.display = 'none');

    // Validasi Nama
    const name = document.getElementById('fullName').value.trim();
    if(name === "") {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    // Validasi Email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Validasi Kata Laluan
    const password = document.getElementById('password').value;
    if(password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    // Validasi Tarikh Lahir
    const dob = document.getElementById('dob').value;
    if(dob === "") {
        document.getElementById('dobError').style.display = 'block';
        isValid = false;
    }

    // Validasi Jantina
    const gender = document.getElementById('gender').value;
    if(gender === "") {
        document.getElementById('genderError').style.display = 'block';
        isValid = false;
    }

    // Validasi Gambar
    const photo = document.getElementById('photo').value;
    if(photo === "") {
        document.getElementById('photoError').style.display = 'block';
        isValid = false;
    }

    // Validasi Kotak Semak Terma
    const terms = document.getElementById('terms').checked;
    if(!terms) {
        document.getElementById('termsError').style.display = 'block';
        isValid = false;
    }

    // Jika semua lulus validasi
    if(isValid) {
        alert('🎉 Form submitted successfully! Thank you.');
        document.getElementById('portfolioForm').reset();
    }
});