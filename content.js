(function() {
    'use strict';

    // Fetch the extension name from the manifest.json or fallback
    const EXTENSION_NAME = 'By: ' + (chrome.runtime.getManifest().name || "Extension");

    // Function to safely parse the price from a text string
    function parsePrice(text) {
        try {
            const cleanedText = text.replace(/[^\d,]/g, '').replace(',', '.');
            return parseFloat(cleanedText) || null;
        } catch (error) {
            // console.log('Error parsing price:', error);
            return null;
        }
    }

    // Function to style elements and add a title
    function styleElement(element, className) {
        element.classList.add(className);
        element.setAttribute('title', EXTENSION_NAME);
    }

    // Function to create and style the total price element
    function createTotalElement(total) {
        const totalElement = document.createElement('span');

        // Format the total using Intl.NumberFormat
        const formattedTotal = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(total);

        const totalText = `Sum: ${formattedTotal}`;
        totalElement.textContent = totalText;
        styleElement(totalElement, 'highlight-total');
        return totalElement;
    }


    // Function to create a divider element
    function createDividerElement() {
        const dividerElement = document.createElement('span');
        dividerElement.classList.add('thread-divider');
        return dividerElement;
    }

    // Function to process a single block and apply the necessary styles
    function processBlock(block) {
        const priceElement = block.querySelector('span.threadItemCard-price, span.thread-price');
        const shippingElement = block.querySelector('span.overflow--wrap-off.size--all-s');

        if (priceElement && shippingElement && !block.dataset.processed) {
            const price = parsePrice(priceElement.textContent.trim());
            const shipping = parsePrice(shippingElement.textContent.trim());
            // console.log('Processing block:', price, shipping);
            if (price !== null && shipping !== null) {
                const total = price + shipping;
                styleElement(shippingElement, 'highlight-shipping');
                const totalElement = createTotalElement(total);
                const dividerElement = createDividerElement();
                shippingElement.parentNode.appendChild(dividerElement);
                shippingElement.parentNode.appendChild(totalElement);
                block.dataset.processed = 'true';
                // console.log('Processed block:', price, shipping, total);
            } else {
                // console.log('Invalid price or shipping format:', priceElement.textContent, shippingElement.textContent);
            }
        }
    }

    // Function to check and style all relevant spans on the page
    function checkAndStyleSpans() {
        const blocks = document.querySelectorAll('span.overflow--fade');
        blocks.forEach(block => processBlock(block));
        // console.log('Processed blocks:', blocks);
    }

    // Function to debounce actions for better performance
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Initialize when the page loads
    window.addEventListener('load', () => {
        setTimeout(checkAndStyleSpans, 500);
    });

    // Observe changes to the DOM and apply styles accordingly
    const observer = new MutationObserver(debounce(() => {
        setTimeout(checkAndStyleSpans, 500);
    }, 300));

    observer.observe(document.body, { childList: true, subtree: true });

    // Inject CSS styles into the page for custom classes
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .highlight-shipping {
                color: white;
                font-weight: bold;
                background-color: rgba(255,0,0, .8);
                font-size: 1rem;
                border-radius: 5px;
                padding: 1px 5px;
            }
            .highlight-total {
                color: white;
                font-weight: bold;
                background-color: rgba(34,139,34, .8);
                font-size: 1rem;
                border-radius: 5px;
                padding: 3px 5px;
            }
            .highlight-total:hover, .highlight-shipping:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }

    injectStyles(); // Inject the custom styles into the page

})();
