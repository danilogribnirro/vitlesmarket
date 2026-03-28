// Бургер-меню
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if (burger && menu) {
    burger.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            if (menu.classList.contains("active")) {
                menu.classList.remove("active");
            }
        }
    });
});

// Функция для создания красивого уведомления
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    
    let icon = "";
    if (type === "success") {
        icon = "✓";
    } else if (type === "error") {
        icon = "✗";
    } else if (type === "info") {
        icon = "ℹ";
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Функция для создания красивого модального окна
function showModal(title, message, onConfirm = null, showCancel = false) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    
    const modal = document.createElement("div");
    modal.className = "modal-container";
    
    modal.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            ${showCancel ? '<button class="modal-btn modal-btn-secondary" id="modalCancel">Отмена</button>' : ''}
            <button class="modal-btn modal-btn-primary" id="modalConfirm">OK</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add("show");
        modal.classList.add("show");
    }, 10);
    
    const closeModal = () => {
        overlay.classList.remove("show");
        modal.classList.remove("show");
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    const closeBtn = modal.querySelector(".modal-close");
    const confirmBtn = modal.querySelector("#modalConfirm");
    
    closeBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", () => {
        closeModal();
        if (onConfirm) onConfirm();
    });
    
    if (showCancel) {
        const cancelBtn = modal.querySelector("#modalCancel");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", closeModal);
        }
    }
    
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
    
    const handleEsc = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", handleEsc);
        }
    };
    document.addEventListener("keydown", handleEsc);
}

// ==================== КАЛЬКУЛЯТОР СТОИМОСТИ ====================
const serviceType = document.getElementById("serviceType");
const volumeGroup = document.getElementById("volumeGroup");
const quantityGroup = document.getElementById("quantityGroup");
const volumeInput = document.getElementById("volume");
const quantityInput = document.getElementById("quantity");
const totalPriceSpan = document.getElementById("totalPrice");

// Цены
const prices = {
    sawing: 35,      // руб/м³ - распил доски
    beam: 40,        // руб/м³ - распил бруса
    cutting: 25,     // руб за 100 шт
    kit: 50          // от 50 руб
};

// Переключение между полями ввода
function toggleInputFields() {
    const selected = serviceType.value;
    
    if (selected === "cutting") {
        volumeGroup.style.display = "none";
        quantityGroup.style.display = "block";
    } else if (selected === "kit") {
        volumeGroup.style.display = "none";
        quantityGroup.style.display = "none";
    } else {
        volumeGroup.style.display = "block";
        quantityGroup.style.display = "none";
    }
    
    calculateTotal();
}

// Расчёт стоимости
function calculateTotal() {
    const selected = serviceType.value;
    let total = 0;
    let serviceName = "";
    let amount = "";
    
    if (selected === "sawing") {
        let volume = parseFloat(volumeInput.value) || 0;
        total = volume * prices.sawing;
        serviceName = "Распил доски";
        amount = volume + " м³";
    } else if (selected === "beam") {
        let volume = parseFloat(volumeInput.value) || 0;
        total = volume * prices.beam;
        serviceName = "Распил бруса";
        amount = volume + " м³";
    } else if (selected === "cutting") {
        let quantity = parseFloat(quantityInput.value) || 0;
        total = quantity * prices.cutting;
        serviceName = "Торцовка в размер";
        amount = quantity + " сотен шт.";
    } else if (selected === "kit") {
        total = prices.kit;
        serviceName = "Комплектация проекта";
        amount = "";
    }
    
    // Минимальная стоимость заказа 50 руб
    if (total < 50 && total > 0) {
        total = 50;
    }
    
    const roundedTotal = Math.round(total);
    totalPriceSpan.textContent = roundedTotal;
    
    // Обновляем сумму в блоке оплаты
    updatePaymentAmount(roundedTotal, serviceName, amount);
    
    return { total: roundedTotal, serviceName, amount };
}

// Обновление суммы в блоке оплаты
function updatePaymentAmount(amount, serviceName, details) {
    const paymentAmountSpan = document.getElementById("paymentAmount");
    const paymentAmountDisplay = document.getElementById("paymentAmountDisplay");
    
    if (paymentAmountSpan) {
        paymentAmountSpan.textContent = amount;
    }
    
    if (paymentAmountDisplay) {
        paymentAmountDisplay.textContent = amount;
    }
    
    // Сохраняем данные заказа для использования в оплате
    window.currentOrder = {
        amount: amount,
        serviceName: serviceName,
        details: details
    };
}

// Обработчики для калькулятора
if (serviceType) {
    serviceType.addEventListener("change", toggleInputFields);
}

if (volumeInput) {
    volumeInput.addEventListener("input", calculateTotal);
}

if (quantityInput) {
    quantityInput.addEventListener("input", calculateTotal);
}

// Кнопки быстрого выбора объёма
document.querySelectorAll(".volume-presets button").forEach(btn => {
    btn.addEventListener("click", function() {
        const volume = parseFloat(this.getAttribute("data-volume"));
        if (volumeInput) {
            volumeInput.value = volume;
            calculateTotal();
        }
    });
});

// Кнопка оформления заявки из калькулятора
const submitOrderBtn = document.getElementById("submitOrderBtn");
if (submitOrderBtn) {
    submitOrderBtn.addEventListener("click", function() {
        const { total, serviceName, amount } = calculateTotal();
        
        showModal(
            "Оформление заявки",
            `Вы выбрали: ${serviceName}<br>${amount ? amount + "<br>" : ""}<strong>Итоговая стоимость: ${total} руб.</strong><br><br>Наш менеджер свяжется с вами для уточнения деталей.`,
            () => {
                showCallOrderModal(true, total, serviceName, amount);
            }
        );
    });
}

// ==================== КНОПКА ЗАКАЗА ЗВОНКА (УЛУЧШЕННАЯ) ====================
function showCallOrderModal(hasOrderDetails = false, total = null, serviceName = "", amount = "") {
    let message = "";
    if (hasOrderDetails && total) {
        message = `<div style="background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:20px;">
            <strong style="color:#b8860b;">📋 Ваш заказ:</strong><br>
            ${serviceName}<br>
            ${amount ? amount + "<br>" : ""}
            <strong>Сумма: ${total} руб.</strong>
        </div>`;
    }
    
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    
    const modal = document.createElement("div");
    modal.className = "modal-container";
    modal.style.maxWidth = "500px";
    
    modal.innerHTML = `
        <div class="modal-header">
            <h3>📞 Заказать звонок</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            ${message}
            <form id="callOrderForm">
                <div class="calc-group">
                    <label for="callName">Ваше имя *</label>
                    <input type="text" id="callName" placeholder="Иван Иванов" required>
                </div>
                <div class="calc-group">
                    <label for="callPhone">Телефон *</label>
                    <input type="tel" id="callPhone" placeholder="+375 (29) 123-45-67" required>
                </div>
                <div class="calc-group">
                    <label for="callComment">Комментарий</label>
                    <textarea id="callComment" rows="3" placeholder="Укажите удобное время для звонка или дополнительные вопросы..." class="auto-resize"></textarea>
                    <div class="comment-presets">
                        <button type="button" class="preset-btn" data-comment="Удобно с 12:00 до 15:00">📅 Удобное время</button>
                        <button type="button" class="preset-btn" data-comment="Хочу уточнить детали заказа">📝 Уточнить детали</button>
                        <button type="button" class="preset-btn" data-comment="Нужен замер на объекте">📏 Замер на объекте</button>
                        <button type="button" class="preset-btn" data-comment="Есть вопрос по скидке/акции">💰 Скидка/акция</button>
                        <button type="button" class="preset-btn" data-comment="Срочный заказ, нужно сегодня">📄 Срочный заказ</button>
                    </div>
                    <div class="comment-hint">
                        <small>💡 Нажмите на подсказку, чтобы добавить текст в комментарий</small>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="modal-btn modal-btn-primary" id="submitCallOrder">Отправить заявку</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add("show");
        modal.classList.add("show");
        
        // Автоматическое растягивание текстового поля
        const textarea = modal.querySelector(".auto-resize");
        if (textarea) {
            textarea.addEventListener("input", function() {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            });
        }
        
        // Обработчики для быстрых кнопок
        const presetBtns = modal.querySelectorAll(".preset-btn");
        presetBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                const comment = this.getAttribute("data-comment");
                const textarea = modal.querySelector("#callComment");
                if (textarea) {
                    if (textarea.value) {
                        textarea.value += "\n" + comment;
                    } else {
                        textarea.value = comment;
                    }
                    textarea.dispatchEvent(new Event("input"));
                    textarea.focus();
                    
                    // Визуальный эффект нажатия
                    this.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        this.style.transform = "";
                    }, 150);
                }
            });
        });
    }, 10);
    
    const closeModal = () => {
        overlay.classList.remove("show");
        modal.classList.remove("show");
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", closeModal);
    
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
    
    const submitBtn = modal.querySelector("#submitCallOrder");
    submitBtn.addEventListener("click", () => {
        const name = document.getElementById("callName").value;
        const phone = document.getElementById("callPhone").value;
        const comment = document.getElementById("callComment").value;
        
        if (!name || !phone) {
            showNotification("Пожалуйста, заполните имя и телефон", "error");
            return;
        }
        
        // Отправка данных (можно заменить на реальный endpoint)
        console.log("Заказ звонка:", { 
            name, 
            phone, 
            comment, 
            order: hasOrderDetails ? { total, serviceName, amount } : null 
        });
        
        let successMessage = "Заявка отправлена! Мы перезвоним в течение 15 минут.";
        if (hasOrderDetails && total) {
            successMessage = `Заявка на сумму ${total} руб. отправлена! Менеджер свяжется с вами для подтверждения заказа.`;
        }
        
        showNotification(successMessage, "success");
        closeModal();
    });
    
    const handleEsc = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", handleEsc);
        }
    };
    document.addEventListener("keydown", handleEsc);
}

// Обработчик кнопки "Заказать звонок" в хедере
const callOrderBtn = document.getElementById("callOrderBtn");
if (callOrderBtn) {
    callOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showCallOrderModal(false);
    });
}

// ==================== ОПЛАТА С УЧЁТОМ СТОИМОСТИ ====================
// Кнопка оплаты заказа
const payOrderBtn = document.getElementById("payOrderBtn");
if (payOrderBtn) {
    payOrderBtn.addEventListener("click", function() {
        const currentOrder = window.currentOrder;
        if (!currentOrder || currentOrder.amount <= 0) {
            showNotification("Пожалуйста, рассчитайте стоимость заказа в калькуляторе", "info");
            document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
            return;
        }
        
        showModal(
            "Оплата заказа",
            `Вы собираетесь оплатить заказ на сумму <strong>${currentOrder.amount} руб.</strong><br><br>
            Услуга: ${currentOrder.serviceName}<br>
            ${currentOrder.details ? currentOrder.details : ""}<br><br>
            Для завершения оплаты введите данные карты в форме ниже.`,
            null,
            false
        );
    });
}

// Обработка оплаты
const paymentForm = document.getElementById("paymentForm");
if (paymentForm) {
    paymentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const currentOrder = window.currentOrder;
        if (!currentOrder || currentOrder.amount <= 0) {
            showNotification("Сначала рассчитайте стоимость заказа в калькуляторе", "error");
            document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
            return;
        }
        
        const number = cardNumberInput.value;
        const date = cardDateInput.value;
        const cvv = cardCVVInput.value;
        const result = document.getElementById("paymentResult");

        if (!result) return;

        if (number.replace(/\s/g, "").length !== 16) {
            showNotification("Ошибка: номер карты должен содержать 16 цифр.", "error");
            result.textContent = "Ошибка: номер карты должен содержать 16 цифр.";
            result.style.color = "red";
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(date) || !validateDate(date)) {
            showNotification("Ошибка: неверная или просроченная дата.", "error");
            result.textContent = "Ошибка: неверная или просроченная дата.";
            result.style.color = "red";
            return;
        }

        if (cvv.length !== 3) {
            showNotification("Ошибка: CVV должен содержать 3 цифры.", "error");
            result.textContent = "Ошибка: CVV должен содержать 3 цифры.";
            result.style.color = "red";
            return;
        }

        if (luhnCheck(number)) {
            showNotification(`Оплата на сумму ${currentOrder.amount} руб. прошла успешно! Благодарим за доверие.`, "success");
            result.innerHTML = `✓ Оплата ${currentOrder.amount} руб. выполнена! (тестовый режим)`;
            result.style.color = "green";
            
            // Очищаем форму оплаты
            cardNumberInput.value = "";
            cardDateInput.value = "";
            cardCVVInput.value = "";
            
            setTimeout(() => {
                showModal(
                    "Оплата выполнена",
                    `Ваш платёж на сумму ${currentOrder.amount} руб. успешно обработан.<br><br>
                    Заказ: ${currentOrder.serviceName}<br>
                    ${currentOrder.details ? currentOrder.details : ""}<br><br>
                    Менеджер свяжется с вами в ближайшее время для подтверждения заказа.`
                );
            }, 500);
        } else {
            showNotification("Такой карты не существует. Оплата отклонена.", "error");
            result.textContent = "✗ Такой карты не существует. Оплата отклонена.";
            result.style.color = "red";
        }
    });
}

// ==================== КОНТАКТНАЯ ФОРМА ====================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('input[placeholder="Ваше имя"]');
        const userName = nameInput ? nameInput.value : "";
        
        showModal(
            "Заявка принята!",
            `${userName ? userName + ", " : ""}спасибо за обращение! Наш менеджер свяжется с вами в течение 15 минут.`
        );
        
        this.reset();
    });
}

// ==================== ОПЛАТА КАРТОЙ (МАСКИ И ВАЛИДАЦИЯ) ====================
const cardNumberInput = document.getElementById("cardNumber");
if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, "").slice(0, 16);
        this.value = value.replace(/(.{4})/g, "$1 ").trim();
    });
}

const cardDateInput = document.getElementById("cardDate");
if (cardDateInput) {
    cardDateInput.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, "").slice(0, 4);
        this.value = value.length >= 3 ? value.slice(0, 2) + "/" + value.slice(2) : value;
    });
}

const cardCVVInput = document.getElementById("cardCVV");
if (cardCVVInput) {
    cardCVVInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 3);
    });
}

function luhnCheck(num) {
    num = num.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

function validateDate(dateStr) {
    const [mm, yy] = dateStr.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;
    return true;
}

// Инициализация калькулятора
if (serviceType) {
    toggleInputFields();
}

// Обновление суммы при загрузке страницы
setTimeout(() => {
    calculateTotal();
}, 100);