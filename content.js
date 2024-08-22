(function() {
    'use strict';

    function parsePrice(text) {
        const cleanedText = text.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(cleanedText) || null;
    }

    function checkAndStyleSpans() {
        const blocks = document.querySelectorAll('span.overflow--fade');

        blocks.forEach(block => {
            const priceElement = block.querySelector('span.threadItemCard-price');
            const shippingElement = block.querySelector('span.overflow--wrap-off.size--all-s');

            if (priceElement && shippingElement && !block.dataset.processed) {
                const priceText = priceElement.textContent.trim();
                const shippingText = shippingElement.textContent.trim();

                const price = parsePrice(priceText);
                const shipping = parsePrice(shippingText);

                if (price !== null && shipping !== null) {

                    const total = price + shipping;

                    shippingElement.style.fontWeight = 'bold';
                    shippingElement.style.color = 'white';
                    shippingElement.style.backgroundColor = 'red';
                    shippingElement.style.fontSize = '1.2rem';

                    const totalElement = document.createElement('span');
                    totalElement.textContent = ` ${total.toFixed(2).replace('.', ',')}€`;
                    totalElement.style.color = 'white';
                    totalElement.style.fontWeight = 'bold';
                    totalElement.style.backgroundColor = 'green';
                    totalElement.style.padding = '0 5px';
                    totalElement.style.marginLeft = '10px';
                    totalElement.style.fontSize = '1.2rem';

                    shippingElement.parentNode.appendChild(totalElement);

                    block.dataset.processed = 'true';
                }
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(checkAndStyleSpans, 500);  
    });

    const observer = new MutationObserver(() => {
        setTimeout(checkAndStyleSpans, 500); 
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
