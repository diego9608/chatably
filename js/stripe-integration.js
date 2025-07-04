// Stripe Configuration
const STRIPE_PUBLIC_KEY = 'pk_test_51234567890abcdef';

// Plan configurations
const PLANS = {
    'básico': {
        name: 'Básico',
        price: 1200,
        checkoutUrl: 'https://buy.stripe.com/28E9AS1T99SQcW18Qz7ok0b',
        currency: 'mxn',
        features: [
            'Hasta 1,000 conversaciones/mes',
            '1 número de WhatsApp',
            'Respuestas ilimitadas',
            'Plantillas personalizadas',
            'Soporte por email'
        ]
    },
    'pro': {
        name: 'Pro',
        price: 2400,
        checkoutUrl: 'https://buy.stripe.com/7sYfZgcxN3usbRX0k37ok0c',
        currency: 'mxn',
        features: [
            'Hasta 5,000 conversaciones/mes',
            '3 números de WhatsApp',
            'Integración con CRM',
            'Análisis avanzados',
            'Soporte prioritario',
            'Entrenamiento personalizado IA'
        ]
    },
    'ultra': {
        name: 'Ultra',
        price: 3500,
        checkoutUrl: 'https://buy.stripe.com/cNifZg0P54yw2hnfeX7ok0d',
        currency: 'mxn',
        features: [
            'Conversaciones ilimitadas',
            'Números ilimitados',
            'API personalizada',
            'Manager dedicado',
            'SLA garantizado',
            'Configuración white label'
        ]
    }
};

class StripeCheckout {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.paymentElement = null;
        this.currentPlan = null;
        this.init();
    }

    async init() {
        try {
            // Initialize Stripe
            this.stripe = Stripe(STRIPE_PUBLIC_KEY);
            
            // Get plan from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const planParam = urlParams.get('plan');
            
            if (planParam && PLANS[planParam]) {
                this.currentPlan = PLANS[planParam];
                this.setupCheckoutPage();
            } else {
                this.showError('Plan no válido seleccionado');
                return;
            }

            // Setup payment element
            await this.setupPaymentElement();
            
            // Setup form submission
            this.setupFormSubmission();
            
        } catch (error) {
            console.error('Error initializing Stripe:', error);
            this.showError('Error al inicializar el sistema de pagos');
        }
    }

    setupCheckoutPage() {
        // Update plan summary
        const planNameElement = document.getElementById('plan-name');
        const planPriceElement = document.getElementById('plan-price');
        const planFeaturesElement = document.getElementById('plan-features');
        const planTotalElement = document.getElementById('plan-total');

        if (planNameElement) planNameElement.textContent = this.currentPlan.name;
        if (planPriceElement) planPriceElement.textContent = `$${this.currentPlan.price.toLocaleString('es-MX')}`;
        if (planTotalElement) planTotalElement.textContent = `$${this.currentPlan.price.toLocaleString('es-MX')} MXN/mes`;

        if (planFeaturesElement) {
            planFeaturesElement.innerHTML = '';
            this.currentPlan.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                planFeaturesElement.appendChild(li);
            });
        }
    }

    async setupPaymentElement() {
        try {
            // Create payment intent
            const response = await this.createPaymentIntent();
            const { client_secret } = response;

            // Create Elements instance
            this.elements = this.stripe.elements({
                clientSecret: client_secret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#4D8DFF',
                        colorBackground: '#ffffff',
                        colorText: '#1a1a1a',
                        colorDanger: '#df1b41',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px'
                    }
                }
            });

            // Create and mount payment element
            this.paymentElement = this.elements.create('payment');
            this.paymentElement.mount('#payment-element');

            // Handle real-time validation errors
            this.paymentElement.on('change', (event) => {
                if (event.error) {
                    this.showError(event.error.message);
                } else {
                    this.hideError();
                }
            });

        } catch (error) {
            console.error('Error setting up payment element:', error);
            this.showError('Error al configurar el formulario de pago');
        }
    }

    async createPaymentIntent() {
        // In a real implementation, this would call your backend
        // For now, we'll simulate the response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    client_secret: 'pi_test_' + Math.random().toString(36).substr(2, 9) + '_secret_test'
                });
            }, 1000);
        });
    }

    setupFormSubmission() {
        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit-payment');

        if (form && submitButton) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleSubmit(event);
            });
        }
    }

    async handleSubmit(event) {
        const submitButton = document.getElementById('submit-payment');
        
        try {
            // Disable submit button and show loading
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Procesando...';
            }

            // Confirm payment with Stripe
            const { error, paymentIntent } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: window.location.origin + '/success.html',
                    payment_method_data: {
                        billing_details: {
                            name: document.getElementById('customer-name')?.value || '',
                            email: document.getElementById('customer-email')?.value || '',
                        }
                    }
                },
                redirect: 'if_required'
            });

            if (error) {
                // Payment failed
                this.showError(error.message);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Confirmar Suscripción';
                }
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment succeeded
                this.showSuccess('¡Pago procesado exitosamente!');
                
                // Redirect to success page after a short delay
                setTimeout(() => {
                    window.location.href = '/success.html?plan=' + encodeURIComponent(this.currentPlan.name.toLowerCase());
                }, 2000);
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            this.showError('Error al procesar el pago. Por favor intenta de nuevo.');
            
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Confirmar Suscripción';
            }
        }
    }

    showError(message) {
        const errorElement = document.getElementById('payment-errors');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    hideError() {
        const errorElement = document.getElementById('payment-errors');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showSuccess(message) {
        const successElement = document.getElementById('payment-success');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
    }
}

// Initialize Stripe checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('payment-element')) {
        new StripeCheckout();
    }
});

// Webhook handling documentation
/*
STRIPE WEBHOOK INTEGRATION GUIDE

Para manejar los webhooks de Stripe en producción, deberás:

1. Configurar un endpoint en tu servidor (ej: /webhook/stripe)
2. Verificar la firma del webhook usando tu webhook secret
3. Manejar estos eventos importantes:

- payment_intent.succeeded: Pago completado exitosamente
- payment_intent.payment_failed: Pago falló
- customer.subscription.created: Nueva suscripción creada
- customer.subscription.updated: Suscripción actualizada
- customer.subscription.deleted: Suscripción cancelada
- invoice.payment_succeeded: Pago de factura exitoso
- invoice.payment_failed: Pago de factura falló

Ejemplo de endpoint (Node.js/Express):

app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_...'; // Tu webhook secret
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            // Actualizar base de datos, enviar email de confirmación, etc.
            break;
        case 'customer.subscription.created':
            const subscription = event.data.object;
            console.log('Subscription created!');
            // Activar acceso del cliente, enviar email de bienvenida, etc.
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
});

4. Configurar las URLs de webhook en tu dashboard de Stripe
5. Usar HTTPS en producción (requerido por Stripe)
6. Implementar reintentos e idempotencia para manejar fallos
*/

// Utility functions for price formatting
function formatPrice(price, currency = 'MXN') {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(price);
}

// Redirect to Stripe checkout
function redirectToCheckout(planKey) {
    if (PLANS[planKey] && PLANS[planKey].checkoutUrl) {
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                'currency': 'MXN',
                'value': PLANS[planKey].price,
                'items': [{
                    'item_id': planKey,
                    'item_name': PLANS[planKey].name,
                    'category': 'subscription',
                    'quantity': 1,
                    'price': PLANS[planKey].price
                }]
            });
        }
        
        // Redirect to Stripe checkout
        window.location.href = PLANS[planKey].checkoutUrl;
    } else {
        console.error('Plan not found:', planKey);
    }
}

// Export functions for use in other files
window.StripeIntegration = {
    PLANS,
    formatPrice,
    StripeCheckout,
    redirectToCheckout
};