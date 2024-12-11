// resources/js/bootstrap.ts

import axios from "axios";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Установка CSRF-токена, если он есть в мета-тегах
const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

if (token) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
} else {
    console.error("CSRF token not found. AJAX requests may not be secure.");
}

// Экспорт axios, если нужно использовать его в других модулях
export default axios;
