// ==================== COOKIE MANAGEMENT SYSTEM ====================

class CookieManager {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.banner = null;
        this.modal = null;
        this.initialized = false;
        this.init();
    }
    
    init() {
        this.banner = document.getElementById('cookieBanner');
        this.modal = document.getElementById('cookieModal');
        
        if (!this.banner) {
            console.warn('Banner de cookies no encontrado, esperando carga...');
            setTimeout(() => this.init(), 500);
            return;
        }
        
        if (this.initialized) return;
        this.initialized = true;
        
        this.checkCookieConsent();
        this.setupEventListeners();
        
        if (this.getCookie(this.cookieName)) {
            this.showFloatingButton();
        }
    }
    
    checkCookieConsent() {
        const consent = this.getCookie(this.cookieName);
        
        if (!consent) {
            setTimeout(() => {
                if (this.banner) {
                    this.banner.classList.add('show');
                }
            }, 1000);
        } else {
            this.applyCookieSettings(JSON.parse(consent));
        }
    }
    
    setupEventListeners() {
        // Botón de aceptar todas
        const acceptBtn = document.getElementById('acceptCookiesBtn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        // 🆕 Botón de rechazar todas
        const rejectBtn = document.getElementById('rejectCookiesBtn');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectAllCookies());
        }
        
        // Botón de personalizar
        const customizeBtn = document.getElementById('customizeCookiesBtn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => this.showModal());
        }
        
        // Guardar preferencias del modal
        const saveBtn = document.getElementById('savePreferencesBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.savePreferences());
        }
        
        // Aceptar todas desde el modal
        const acceptAllModalBtn = document.getElementById('acceptAllModalBtn');
        if (acceptAllModalBtn) {
            acceptAllModalBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        // 🆕 Rechazar todas desde el modal
        const rejectAllModalBtn = document.getElementById('rejectAllModalBtn');
        if (rejectAllModalBtn) {
            rejectAllModalBtn.addEventListener('click', () => this.rejectAllCookies());
        }
        
        // Cerrar modal al hacer clic fuera
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                    this.hideModal();
                }
            });
        }
        
        const policyLink = document.getElementById('cookiePolicyLink');
        if (policyLink) {
            policyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCookiePolicy();
            });
        }
    }
    
    // ✅ Aceptar todas las cookies
    acceptAllCookies() {
        const consent = {
            necessary: true,
            analytics: true,
            preferences: true,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieSettings(consent);
        this.hideBanner();
        this.hideModal();
        this.showNotification('✅ Has aceptado todas las cookies', 'success');
        this.showFloatingButton();
    }
    
    // 🆕 Rechazar todas las cookies no esenciales
    rejectAllCookies() {
        const consent = {
            necessary: true,
            analytics: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieSettings(consent);
        this.hideBanner();
        this.hideModal();
        this.showNotification('❌ Has rechazado todas las cookies no esenciales', 'info');
        this.showFloatingButton();
    }
    
    // ✅ Guardar preferencias personalizadas
    savePreferences() {
        const analyticsChecked = document.getElementById('analyticsCookies')?.checked || false;
        const preferencesChecked = document.getElementById('preferencesCookies')?.checked || false;
        
        const consent = {
            necessary: true,
            analytics: analyticsChecked,
            preferences: preferencesChecked,
            timestamp: new Date().toISOString()
        };
        
        this.saveCookieConsent(consent);
        this.applyCookieSettings(consent);
        this.hideBanner();
        this.hideModal();
        this.showNotification('✅ Preferencias guardadas correctamente', 'success');
        this.showFloatingButton();
    }
    
    applyCookieSettings(consent) {
        this.setCookie(this.cookieName, JSON.stringify(consent), 365);
        
        if (consent.analytics) {
            this.enableAnalyticsCookies();
        } else {
            this.disableAnalyticsCookies();
        }
        
        if (consent.preferences) {
            this.enablePreferencesCookies();
        } else {
            this.disablePreferencesCookies();
        }
        
        window.cookiesEnabled = {
            analytics: consent.analytics,
            preferences: consent.preferences
        };
        
        console.log('🍪 Cookies aplicadas:', consent);
    }
    
    enableAnalyticsCookies() {
        console.log('📊 Cookies de análisis habilitadas');
        // Aquí tu código de Google Analytics
    }
    
    disableAnalyticsCookies() {
        console.log('📊 Cookies de análisis deshabilitadas');
        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
    }
    
    enablePreferencesCookies() {
        console.log('🎨 Cookies de preferencias habilitadas');
        this.loadUserPreferences();
    }
    
    disablePreferencesCookies() {
        console.log('🎨 Cookies de preferencias deshabilitadas');
        this.deleteCookie('user_preferences');
        this.deleteCookie('user_theme');
        this.deleteCookie('user_language');
    }
    
    loadUserPreferences() {
        const savedTheme = this.getCookie('user_theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
    }
    
    saveCookieConsent(consent) {
        this.setCookie(this.cookieName, JSON.stringify(consent), 365);
    }
    
    showModal() {
        if (!this.modal) return;
        
        const currentConsent = this.getCookie(this.cookieName);
        if (currentConsent) {
            const consent = JSON.parse(currentConsent);
            const analyticsCheckbox = document.getElementById('analyticsCookies');
            const preferencesCheckbox = document.getElementById('preferencesCookies');
            
            if (analyticsCheckbox) analyticsCheckbox.checked = consent.analytics || false;
            if (preferencesCheckbox) preferencesCheckbox.checked = consent.preferences || false;
        }
        
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    }
    
    showFloatingButton() {
        const floatingBtn = document.querySelector('.cookie-floating-btn');
        if (floatingBtn) {
            floatingBtn.style.display = 'flex';
        }
    }
    
    showCookiePolicy() {
        // Modal de política de cookies
        const policyModal = document.createElement('div');
        policyModal.className = 'cookie-policy-modal';
        policyModal.innerHTML = `
            <div class="cookie-policy-content">
                <h3>📋 Política de Cookies</h3>
                <p>Nuestro sitio web utiliza cookies para mejorar tu experiencia:</p>
                <ul>
                    <li><strong>🍪 Cookies necesarias:</strong> Funcionamiento básico del sitio</li>
                    <li><strong>📊 Cookies de análisis:</strong> Mejorar nuestra web según tu uso</li>
                    <li><strong>🎨 Cookies de personalización:</strong> Recordar tus preferencias</li>
                </ul>
                <p>Puedes gestionar tus preferencias en cualquier momento haciendo clic en el botón 🍪 en la esquina inferior izquierda.</p>
                <p><small>Para más información, contacta con <a href="mailto:info@pandarojo.org">info@pandarojo.org</a></small></p>
                <button class="cookie-btn cookie-btn-accept" onclick="this.closest('.cookie-policy-modal').remove()">Cerrar</button>
            </div>
        `;
        
        policyModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            animation: fadeIn 0.3s ease;
        `;
        
        const policyContent = policyModal.querySelector('.cookie-policy-content');
        policyContent.style.cssText = `
            background: white;
            color: #333;
            max-width: 500px;
            width: 90%;
            border-radius: 12px;
            padding: 2rem;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(policyModal);
        document.body.style.overflow = 'hidden';
        
        policyModal.addEventListener('click', (e) => {
            if (e.target === policyModal) {
                policyModal.remove();
                document.body.style.overflow = '';
            }
        });
    }
    
    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.cookie-notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        const bgColor = type === 'success' ? '#28a745' : type === 'info' ? '#17a2b8' : '#ffc107';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
    }
    
    getCookie(name) {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
            }
        }
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

// ===== FUNCIONES DE CARGA =====
function loadCookieContent() {
    const container = document.getElementById('contenedor-cookies');
    if (!container) {
        console.error('❌ Contenedor de cookies no encontrado');
        return;
    }
    
    if (container.querySelector('#cookieBanner')) {
        if (!window.cookieManager) {
            window.cookieManager = new CookieManager();
        }
        return;
    }
    
    fetch('components/cookies/index_cookies_panda.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            if (!window.cookieManager) {
                window.cookieManager = new CookieManager();
            } else {
                window.cookieManager.init();
            }
        })
        .catch(error => {
            console.error('❌ Error cargando cookies:', error);
            if (!window.cookieManager) {
                window.cookieManager = new CookieManager();
            }
        });
}

// Funciones globales
function areAnalyticsCookiesEnabled() {
    return window.cookiesEnabled?.analytics || false;
}

function arePreferencesCookiesEnabled() {
    return window.cookiesEnabled?.preferences || false;
}

// ===== INICIALIZACIÓN =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCookieContent);
} else {
    loadCookieContent();
}