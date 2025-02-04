const btn = document.getElementById('button');
const sectionAll = document.querySelectorAll('section[id]');
const inputName = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const flagsElement = document.getElementById('flags');
const textsToChange = document.querySelectorAll('[data-section]');

/* ===== Loader =====*/
window.addEventListener('load', () => {
    const contenedorLoader = document.querySelector('.container--loader');
    contenedorLoader.style.opacity = 0;
    contenedorLoader.style.visibility = 'hidden';
})

/*===== Header =====*/
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('abajo', window.scrollY > 0);
});

/*===== Boton Menu =====*/
btn.addEventListener('click', function() {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.classList.add('not-active');
        document.querySelector('.nav_menu').classList.remove('active');
        document.querySelector('.nav_menu').classList.add('not-active');
    }
    else {
        this.classList.add('active');
        this.classList.remove('not-active');
        document.querySelector('.nav_menu').classList.remove('not-active');
        document.querySelector('.nav_menu').classList.add('active');
    }
});

/*===== Cambio de idioma =====*/
const changeLanguage = async language => {
    const requestJson = await fetch(`./languages/${language}.json`);
    const texts = await requestJson.json();

    for(const textToChange of textsToChange) {
        const section = textToChange.dataset.section;
        const value = textToChange.dataset.value;

        textToChange.innerHTML = texts[section][value];
    }
}

flagsElement.addEventListener('click', (e) => {
    changeLanguage(e.target.parentElement.dataset.language);
})

/*===== class active por secciones =====*/
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sectionAll.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelector('nav a[href*=' + sectionId + ']').classList.add('active');
        }
        else {
            document.querySelector('nav a[href*=' + sectionId + ']').classList.remove('active');
        }
    });
});

/*===== Boton y función ir arriba =====*/
window.onscroll = function() {
    if (document.documentElement.scrollTop > 100) {
        document.querySelector('.go-top-container').classList.add('show');
    }
    else {
        document.querySelector('.go-top-container').classList.remove('show');
    }
}

document.querySelector('.go-top-container').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Abrir y cerrar modal
const modal = document.getElementById("modal");
const openModalButtons = document.querySelectorAll(".open-modal");
const closeModal = document.querySelector(".close");

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        modal.style.display = "flex"; // Usa flex para centrarlo según el CSS
    });
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const openModalButtons = document.querySelectorAll(".open-modal");
    const closeModal = document.querySelector(".close");

    // Ocultar el modal al cargar la página
    modal.style.display = "none";

    // Abrir el modal
    openModalButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal.style.display = "flex"; // Mostrar modal centrado
        });
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModal.addEventListener("click", () => {
        modal.style.display = "none"; // Ocultar modal
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none"; // Ocultar modal
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    let currentIndex = 0;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.toggle("active", i === index); // Mostrar solo el item activo
        });
    }

    // Evento para el botón "Anterior"
    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    });

    // Evento para el botón "Siguiente"
    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    });

    // Mostrar el primer item al inicio
    showItem(currentIndex);
});


const modal2 = document.getElementById("modal2");
const openModal2Buttons = document.querySelectorAll(".open-modal2");
const closeModal2 = document.querySelector(".close2");
openModal2Buttons.forEach(button => {
    button.addEventListener("click", () => {
        modal2.style.display = "flex"; // Usa flex para centrarlo según el CSS
    });
});

closeModal2.addEventListener("click", () => {
    modal2.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal2) {
        modal2.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal2 = document.getElementById("modal2");
    const openModal2Buttons = document.querySelectorAll(".open-modal2");
    const closeModal2 = document.querySelector(".close2");

    // Ocultar el modal al cargar la página
    modal2.style.display = "none";

    // Abrir el modal
    openModal2Buttons.forEach(button => {
        button.addEventListener("click", () => {
            modal2.style.display = "flex"; // Mostrar modal centrado
        });
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModal2.addEventListener("click", () => {
        modal2.style.display = "none"; // Ocultar modal
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modal2) {
            modal2.style.display = "none"; // Ocultar modal
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const items2 = document.querySelectorAll(".carousel-item2");
    const prevButton2 = document.querySelector(".prev2");
    const nextButton2 = document.querySelector(".next2");
    let currentIndex = 0;

    function showItem(index) {
        items2.forEach((item, i) => {
            item.classList.toggle("active", i === index); // Mostrar solo el item activo
        });
    }

    // Evento para el botón "Anterior"
    prevButton2.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items2.length) % items2.length;
        showItem(currentIndex);
    });

    // Evento para el botón "Siguiente"
    nextButton2.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items2.length;
        showItem(currentIndex);
    });

    // Mostrar el primer item al inicio
    showItem(currentIndex);
});


const modal3 = document.getElementById("modal3");
const openModalButtons3 = document.querySelectorAll(".open-modal3");
const closeModal3 = document.querySelector(".close3");

openModalButtons3.forEach(button => {
    button.addEventListener("click", () => {
        modal3.style.display = "flex"; // Usa flex para centrarlo según el CSS
    });
});

closeModal3.addEventListener("click", () => {
    modal3.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal3) {
        modal3.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal3 = document.getElementById("modal3");
    const openModalButtons3 = document.querySelectorAll(".open-modal3");
    const closeModal3 = document.querySelector(".close3");

    // Ocultar el modal al cargar la página
    modal3.style.display = "none";

    // Abrir el modal
    openModalButtons3.forEach(button => {
        button.addEventListener("click", () => {
            modal3.style.display = "flex"; // Mostrar modal centrado
        });
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModal3.addEventListener("click", () => {
        modal3.style.display = "none"; // Ocultar modal
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modal3) {
            modal3.style.display = "none"; // Ocultar modal
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const items3 = document.querySelectorAll(".carousel-item3");
    const prevButton3 = document.querySelector(".prev3");
    const nextButton3 = document.querySelector(".next3");
    let currentIndex = 0;

    function showItem(index) {
        items3.forEach((item, i) => {
            item.classList.toggle("active", i === index); // Mostrar solo el item activo
        });
    }

    // Evento para el botón "Anterior"
    prevButton3.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items3.length) % items3.length;
        showItem(currentIndex);
    });

    // Evento para el botón "Siguiente"
    nextButton3.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items3.length;
        showItem(currentIndex);
    });

    // Mostrar el primer item al inicio
    showItem(currentIndex);
});