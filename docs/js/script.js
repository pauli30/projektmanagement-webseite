// Skript für Warenkorb-Funktionalität
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const ACCOUNT_PASSWORD = 'Professor2026!';

function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    if (!counter) return;
    const cart = getCart();
    counter.textContent = cart.length;
}

function addToCart(name, price, img) {
    const cart = getCart();
    cart.push({ name, price: parseFloat(price), img });
    setCart(cart);
    updateCartCounter();
    console.log('Added to cart:', name, price, img, 'New cart:', cart);
}

document.addEventListener('DOMContentLoaded', function() {
    // Für Testzwecke: lastSurvey und appliedCoupon entfernen
    localStorage.removeItem('lastSurvey');
    localStorage.removeItem('appliedCoupon');
    
    const buttons = document.querySelectorAll('button[data-name]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const img = this.getAttribute('data-img');
            addToCart(name, price, img);
            alert(name + ' zum Warenkorb hinzugefügt!');
        });
    });

    const loginForm = document.querySelector('main form');
    if (loginForm && window.location.pathname.endsWith('login.html')) {
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('login-error');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!passwordInput) return;
            const password = passwordInput.value.trim();
            if (password === ACCOUNT_PASSWORD) {
                localStorage.setItem('authenticated', 'true');
                window.location.href = 'account.html';
            } else {
                if (errorMessage) {
                    errorMessage.textContent = 'Falsches Passwort. Bitte versuche es erneut.';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    if (window.location.pathname.endsWith('account.html')) {
        if (localStorage.getItem('authenticated') !== 'true') {
            window.location.href = 'login.html';
        }
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('authenticated');
                window.location.href = 'login.html';
            });
        }
    }

    // Checkout Button Handler
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Prüfen, ob die Umfrage bereits ausgefüllt wurde
            if (localStorage.getItem('lastSurvey')) {
                // Direkt bestellen
                alert('Bestellung erfolgreich! Vielen Dank für Ihren Einkauf.');
                // Warenkorb leeren
                setCart([]);
                updateCartCounter();
                // Seite neu laden, um die Anzeige zu aktualisieren
                window.location.reload();
            } else {
                // Umfrage öffnen
                const surveyModal = document.getElementById('survey-modal');
                if (surveyModal) {
                    surveyModal.style.display = 'block';
                }
            }
        });
    }

    // Survey Form Handler
    const surveyForm = document.getElementById('survey-form');
    if (surveyForm) {
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedSource = document.querySelector('input[name="source"]:checked').value;
            const otherText = document.getElementById('other-text').value;
            
            // Wenn "Sonstiges" ausgewählt wurde und Text eingegeben
            const finalSource = selectedSource === 'Sonstiges' ? otherText : selectedSource;
            
            // Umfrage-Daten speichern
            const surveyData = {
                source: finalSource,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('lastSurvey', JSON.stringify(surveyData));
            
            // Survey Modal schließen
            document.getElementById('survey-modal').style.display = 'none';
            
            // Gutschein Modal zeigen
            const voucherModal = document.getElementById('voucher-modal');
            if (voucherModal) {
                voucherModal.style.display = 'block';
            }
        });
    }

    // Close Survey Modal Button
    const closeSurveyBtn = document.getElementById('close-survey');
    if (closeSurveyBtn) {
        closeSurveyBtn.addEventListener('click', function() {
            document.getElementById('survey-modal').style.display = 'none';
        });
    }

    // Close Voucher Modal Button
    const closeVoucherBtn = document.getElementById('close-voucher');
    if (closeVoucherBtn) {
        closeVoucherBtn.addEventListener('click', function() {
            document.getElementById('voucher-modal').style.display = 'none';
        });
    }

    // Voucher Close Button
    const closeVoucherBtnMain = document.getElementById('close-voucher-btn');
    if (closeVoucherBtnMain) {
        closeVoucherBtnMain.addEventListener('click', function() {
            // Bestellung abschließen
            alert('Bestellung erfolgreich! Vielen Dank für Ihren Einkauf.');
            // Warenkorb leeren
            setCart([]);
            updateCartCounter();
            // Modal schließen
            document.getElementById('voucher-modal').style.display = 'none';
            // Seite neu laden, um die Anzeige zu aktualisieren
            window.location.reload();
        });
    }

    // Copy Voucher Code Button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const voucherText = document.getElementById('voucher-text').textContent;
            navigator.clipboard.writeText(voucherText).then(function() {
                alert('Code kopiert: ' + voucherText);
            });
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const surveyModal = document.getElementById('survey-modal');
        const voucherModal = document.getElementById('voucher-modal');
        
        if (event.target === surveyModal) {
            surveyModal.style.display = 'none';
        }
        if (event.target === voucherModal) {
            voucherModal.style.display = 'none';
        }
    });

    // Galerie Funktionalität
    const galleries = document.querySelectorAll('.image-gallery');
    galleries.forEach(gallery => {
        const img = gallery.querySelector('.product-img');
        const imgs = img.getAttribute('data-imgs').split(',');
        let currentIndex = 0;
        const prevBtn = gallery.querySelector('.prev');
        const nextBtn = gallery.querySelector('.next');

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
            img.src = imgs[currentIndex];
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % imgs.length;
            img.src = imgs[currentIndex];
        });
    });

    // Produkt-Details Modal (nur wenn vorhanden)
    const products = document.querySelectorAll('.product');
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close');

    if (modal && closeBtn && products.length > 0) {
        const modalTitle = document.getElementById('modal-title');
        const modalImg = document.getElementById('modal-img');
        const modalSize = document.getElementById('modal-size');
        const modalCondition = document.getElementById('modal-condition');
        const modalDescription = document.getElementById('modal-description');

        products.forEach(product => {
            product.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') { // Nicht den Warenkorb-Button
                    const name = this.querySelector('h4').textContent;
                    const img = this.querySelector('img').src;
                    const size = this.getAttribute('data-size');
                    const condition = this.getAttribute('data-condition');
                    const description = this.getAttribute('data-description');

                    modalTitle.textContent = name;
                    modalImg.src = img;
                    modalSize.textContent = size;
                    modalCondition.textContent = condition;
                    modalDescription.textContent = description;
                    modal.style.display = 'block';
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Pop-up Modal beim Laden anzeigen
    const popupModal = document.getElementById('popup-modal');
    if (popupModal) {
        popupModal.style.display = 'flex';
        const closeBtn = popupModal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            popupModal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === popupModal) {
                popupModal.style.display = 'none';
            }
        });
    }

    // Filtering für Produkte-Seite
    if (document.getElementById('product-grid')) {
        // Category buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterProducts();
            });
        });

        // Filter selects
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', filterProducts);
        });

        const toggleCategories = document.getElementById('toggle-categories');
        const categoriesPanel = document.getElementById('categories-panel');
        const toggleFilters = document.getElementById('toggle-filters');
        const filtersPanel = document.getElementById('filters-panel');

        if (toggleCategories && categoriesPanel) {
            toggleCategories.addEventListener('click', () => {
                categoriesPanel.classList.toggle('hidden');
                toggleCategories.textContent = categoriesPanel.classList.contains('hidden') ? 'Kategorien anzeigen' : 'Kategorien ausblenden';
            });
        }

        if (toggleFilters && filtersPanel) {
            toggleFilters.addEventListener('click', () => {
                filtersPanel.classList.toggle('hidden');
                toggleFilters.textContent = filtersPanel.classList.contains('hidden') ? 'Filter anzeigen' : 'Filter ausblenden';
            });
        }

        function filterProducts() {

            const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
            const sizeFilter = document.getElementById('size-filter').value;
            const colorFilter = document.getElementById('color-filter').value;
            const conditionFilter = document.getElementById('condition-filter').value;

            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                let show = true;
                if (activeCategory !== 'all' && product.getAttribute('data-category') !== activeCategory) {
                    show = false;
                }
                if (sizeFilter !== 'Alle' && sizeFilter !== '' && product.getAttribute('data-size') !== sizeFilter) {
                    show = false;
                }
                if (colorFilter !== 'Alle' && colorFilter !== '' && product.getAttribute('data-color') !== colorFilter) {
                    show = false;
                }
                if (conditionFilter !== 'Alle' && conditionFilter !== '' && product.getAttribute('data-condition') !== conditionFilter) {
                    show = false;
                }
                product.style.display = show ? 'block' : 'none';
            });

            // Sortierung nach Kategorie (Alphabetisch) zur besseren Übersicht
            const grid = document.getElementById('product-grid');
            const productsArray = Array.from(grid.querySelectorAll('.product'));
            productsArray.sort((a, b) => a.getAttribute('data-category').localeCompare(b.getAttribute('data-category'), 'de'));
            productsArray.forEach(p => grid.appendChild(p));
        }

        // Debug: initial Filter/Sort ausführen
        filterProducts();
    }

    // Warenkorb-Indikator aktualisieren immer
    updateCartCounter();

    // Warenkorb anzeigen, falls auf Warenkorbseite
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
});

const VALID_COUPON = 'LOOP5PERCENT';

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.removeItem('appliedCoupon');
    loadCart();
}

function getAppliedCoupon() {
    return localStorage.getItem('appliedCoupon') === VALID_COUPON ? VALID_COUPON : null;
}

function setAppliedCoupon(code) {
    if (code === VALID_COUPON) {
        localStorage.setItem('appliedCoupon', code);
    } else {
        localStorage.removeItem('appliedCoupon');
    }
}

function loadCart() {
    console.log('Loading cart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart items:', cart);
    const emptyCartMsg = document.getElementById('empty-cart');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const appliedCoupon = getAppliedCoupon();

    if (cart.length === 0) {
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        if (cartItemsDiv) cartItemsDiv.innerHTML = '';
        if (cartSummary) cartSummary.style.display = 'none';
    } else {
        if (emptyCartMsg) emptyCartMsg.style.display = 'none';
        let html = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            html += '<div class="cart-item"><img src="' + item.img + '" alt="' + item.name + '" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;"><div style="flex: 1;"><h4>' + item.name + '</h4><p><strong>' + item.price.toFixed(2) + ' €</strong></p><button onclick="removeFromCart(' + index + ')" style="background: #d9534f; color: white; padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer;">Entfernen</button></div></div>';
        });
        if (cartItemsDiv) cartItemsDiv.innerHTML = html;

        const shipping = 5;
        const discountPercent = appliedCoupon ? 5 : 0;
        const discountAmount = total * (discountPercent / 100);
        const totalAfterDiscount = total - discountAmount;
        const grandTotal = totalAfterDiscount + shipping;

        if (cartSummary) {
            cartSummary.style.display = 'block';
            cartSummary.innerHTML = '<h3>Zusammenfassung</h3>' +
                '<p>Zwischensumme: <strong>' + total.toFixed(2) + ' €</strong></p>' +
                '<p>Versandkosten: <strong>' + shipping.toFixed(2) + ' €</strong></p>' +
                (discountPercent > 0 ? '<p>Rabatt (' + VALID_COUPON + '): <strong>-' + discountAmount.toFixed(2) + ' €</strong></p>' : '') +
                '<p><strong>Gesamtpreis: ' + grandTotal.toFixed(2) + ' €</strong></p>' +
                '<div class="coupon-row"><input type="text" id="coupon-input" placeholder="Gutscheincode eingeben" value="' + (appliedCoupon || '') + '" /><button id="apply-coupon-btn" class="apply-coupon-btn">Code anwenden</button></div>' +
                '<p id="coupon-message" class="coupon-message"></p>' +
                '<button id="checkout-btn" class="checkout-btn">Zur Kasse gehen</button>';

            setTimeout(function() {
                const checkoutBtn = document.getElementById('checkout-btn');
                if (checkoutBtn) {
                    checkoutBtn.addEventListener('click', function() {
                        console.log('Checkout button clicked');
                        console.log('lastSurvey in localStorage:', localStorage.getItem('lastSurvey'));
                        // Prüfen, ob die Umfrage bereits ausgefüllt wurde
                        if (localStorage.getItem('lastSurvey')) {
                            // Direkt bestellen
                            alert('Bestellung erfolgreich! Vielen Dank für Ihren Einkauf.');
                            setCart([]);
                            updateCartCounter();
                            // Seite neu laden, um die Anzeige zu aktualisieren
                            window.location.reload();
                        } else {
                            console.log('Opening survey modal');
                            // Umfrage öffnen
                            const surveyModal = document.getElementById('survey-modal');
                            if (surveyModal) {
                                surveyModal.style.display = 'block';
                            } else {
                                console.log('Survey modal not found');
                            }
                        }
                    });
                }

                const applyCouponBtn = document.getElementById('apply-coupon-btn');
                const couponInput = document.getElementById('coupon-input');
                const couponMessage = document.getElementById('coupon-message');
                if (couponInput) {
                    couponInput.addEventListener('input', function() {
                        if (couponMessage) couponMessage.textContent = '';
                    });
                }
                if (applyCouponBtn) {
                    applyCouponBtn.addEventListener('click', function() {
                        if (!couponInput) return;
                        const enteredCode = couponInput.value.trim().toUpperCase();
                        if (enteredCode === VALID_COUPON) {
                            setAppliedCoupon(enteredCode);
                            loadCart();
                            const newCouponMessage = document.getElementById('coupon-message');
                            if (newCouponMessage) {
                                newCouponMessage.textContent = 'Gutschein erfolgreich angewendet!';
                                newCouponMessage.classList.remove('error');
                                newCouponMessage.classList.add('success');
                            }
                        } else {
                            setAppliedCoupon('');
                            if (couponMessage) {
                                couponMessage.textContent = 'Ungültiger Gutscheincode.';
                                couponMessage.classList.remove('success');
                                couponMessage.classList.add('error');
                            }
                        }
                    });
                }
            }, 0);
        }
    }
}