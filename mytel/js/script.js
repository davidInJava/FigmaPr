// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const body = document.body;
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const checkbox = document.getElementById('agree');

    burger.addEventListener('click', function () {
        // Переключаем классы для бургера и меню
        this.classList.toggle('burger--active');
        nav.classList.toggle('nav--active');

        // Блокируем прокрутку тела когда меню открыто
        body.classList.toggle('no-scroll');
    });

    // Функция для переключения активного класса у ссылок
    const navLinks = document.querySelectorAll('.nav__link');

    function setActiveLink(clickedLink) {
        // Удаляем класс nav__link--active у всех ссылок
        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
        });

        // Добавляем класс nav__link--active только на clickedLink
        clickedLink.classList.add('nav__link--active');
    }

    // Добавляем обработчик клика на каждую ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Устанавливаем активную ссылку
            setActiveLink(this);

            // Закрываем бургер-меню на мобилках
            burger.classList.remove('burger--active');
            nav.classList.remove('nav--active');
            body.classList.remove('no-scroll');
        });
    });

    // Автоматически определяем активную страницу при загрузке
    function setInitialActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === '/')) {
                link.classList.add('nav__link--active');
            }
        });
    }






    // Валидация email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Очистка ошибок
    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.textContent = '');

        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => input.classList.remove('error'));

        const labels = document.querySelectorAll('.checkbox__label');
        labels.forEach(label => label.classList.remove('error'));
    }

    // Показ ошибки
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            inputElement.classList.add('error');
        }

        // Для чекбокса
        if (fieldId === 'agree') {
            const label = document.querySelector('.checkbox__label');
            label.classList.add('error');
        }
    }

    // Валидация формы
    function validateForm(formData) {
        //console.log(checkbox)
        let isValid = true;
        clearErrors();

        // Валидация имени
        if (!formData.get('fullname').trim()) {
            showError('name', 'Please enter your full name');
            isValid = false;
        }

        // Валидация email
        const email = formData.get('email').trim();
        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Валидация сообщения
        if (!formData.get('message').trim()) {
            showError('message', 'Please enter your message');
            isValid = false;
        }

        // Валидация чекбокса
        if (!formData.get('agree')) {
            showError('agree', 'You must agree to the Terms & Conditions');
            isValid = false;
        }

        return isValid;
    }

    // Отправка формы
	async function submitForm(formData) {
	    try {
		const response = await fetch('/contact-handler.php', { // ← change URL
		    method: 'POST',
		    headers: {
		        'Accept': 'application/json'
		    },
		    body: formData
		});

		if (response.ok) {
		    // Optionally read JSON if you want details:
		    // const data = await response.json();
		    return true;
		} else {
		    console.error('Server error:', response.status);
		    return false;
		}
	    } catch (error) {
		console.error('Error submitting form:', error);
		return false;
	    }
	}


        // Обработчик отправки формы
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            if (!validateForm(formData)) {
                return;
            }

            // Показываем loading
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;

            // Отправляем форму
            const success = await submitForm(formData);  // ← UNCOMMENTED

            // Скрываем loading
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;

            if (success) {  // ← REMOVED || 1
                // Показываем успех
                successMessage.style.display = 'block';
                contactForm.reset();

                // Скрываем успех через 5 сек
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                alert('Sorry, there was an error sending your message. Please try again.');
            }
        });

    // Реаль-time валидация при вводе
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });

    // Валидация чекбокса

    checkbox.addEventListener('change', function () {
        const label = document.querySelector('.checkbox__label');
        label.classList.remove('error');
        document.getElementById('agreeError').textContent = '';
    });


    submitBtn.addEventListener('click', function () {
        //console.log("Hello")
        //console.log(checkbox.target.value)
    })


    setInitialActiveLink();
});
