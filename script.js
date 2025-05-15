// Hamburger menu toggle
const hamburgerIcon = document.getElementById('hamburger-icon');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const closeNavButton = document.getElementById('close-nav');

/**
 * Toggles the mobile navigation menu open and closed.
 */
function toggleMobileNav() {
    const isExpanded = mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open');
    mobileNavOverlay.style.display = mobileNav.classList.contains('open') ? 'block' : 'none';
    hamburgerIcon.setAttribute('aria-expanded', !isExpanded);
    // Set focus to the close button when the nav opens
    if (!isExpanded) {
        closeNavButton.focus();
    } else {
        // Set focus back to the hamburger button when the nav closes
        hamburgerIcon.focus();
    }
}

// Add event listeners for mobile navigation toggle
hamburgerIcon.addEventListener('click', toggleMobileNav);
mobileNavOverlay.addEventListener('click', toggleMobileNav);
closeNavButton.addEventListener('click', toggleMobileNav);

// Close mobile nav when a link inside it is clicked
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
            toggleMobileNav();
        }
    });
});

// Mobile navigation dropdown toggle functionality
mobileNav.querySelectorAll('li.dropdown-toggle').forEach(item => {
    item.addEventListener('click', function(event) {
        // Prevent the link click from immediately closing the nav/scrolling
        event.preventDefault();
        event.stopPropagation(); // Stop event from bubbling up to close nav

        const wasOpen = this.classList.contains('open');
        const nestedUl = this.querySelector('ul'); // Find the nested ul

        // Close all other open dropdowns in the mobile nav
        mobileNav.querySelectorAll('li.dropdown-toggle.open').forEach(openItem => {
            if (openItem !== this) {
                openItem.classList.remove('open');
                openItem.setAttribute('aria-expanded', 'false');
                 // Hide the nested ul directly
                const otherNestedUl = openItem.querySelector('ul');
                if (otherNestedUl) {
                    otherNestedUl.style.display = 'none';
                }
            }
        });

        // Toggle the clicked dropdown
        this.classList.toggle('open');
        this.setAttribute('aria-expanded', !wasOpen);

        // Toggle display of the nested ul
        if (nestedUl) {
            nestedUl.style.display = this.classList.contains('open') ? 'block' : 'none';
        }

         // If the clicked element is the link inside the dropdown-toggle,
         // allow default link behavior (scrolling) after a small delay
         // to allow the dropdown to toggle first.
         if (event.target.tagName === 'A') {
             const targetHref = event.target.getAttribute('href');
             if (targetHref) {
                 setTimeout(() => {
                     window.location.href = targetHref;
                 }, 100); // Small delay
             }
         }
    });

     // Add click listener to the links inside the dropdowns to close the nav
     item.querySelectorAll('ul a').forEach(nestedLink => {
         nestedLink.addEventListener('click', () => {
              if (mobileNav.classList.contains('open')) {
                 toggleMobileNav();
             }
         });
     });
});


// Basic script to highlight active navigation link based on scroll position
const sections = document.querySelectorAll('main section, main article, main .content-subsection');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a'); // Select links from both navs

window.addEventListener('scroll', () => {
    let current = '';
    // Get the current scroll position and adjust for fixed header/nav height
    // Use the same margin-top value as in CSS for accurate calculation
    const fixedHeaderHeight = window.innerWidth >= 768 ? 11 * 16 : 5 * 16; // Approx rem to px conversion

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if the top of the section is within the viewport, considering the fixed header/nav
        if (window.scrollY + fixedHeaderHeight >= sectionTop && window.scrollY + fixedHeaderHeight < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if the link's href matches the current section id exactly
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        } else {
            // For parent links (Parts), check if the current section is within that part
            const partId = link.getAttribute('href');
            // Check if the current section ID starts with the part ID (excluding the '#')
            if (partId.startsWith('#part-') && current.startsWith(partId.substring(1))) {
                 // This is a simplified check; a more robust solution might involve
                 // checking the DOM structure to see if the current section is a child
                 // of the part, but for this structure, checking the ID prefix works.
                 link.classList.add('active');
            }
        }
    });
});

// Trigger scroll event on load to highlight the initial section if page is loaded with a hash
window.addEventListener('load', () => {
     window.dispatchEvent(new Event('scroll'));
});

// Add keyboard navigation for dropdown toggles
mobileNav.querySelectorAll('li.dropdown-toggle').forEach(item => {
    item.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click(); // Simulate a click to trigger the toggle logic
        }
    });
});

 // Add keyboard navigation for close button
closeNavButton.addEventListener('keydown', function(event) {
     if (event.key === 'Enter' || event.key === ' ') {
         event.preventDefault();
         this.click(); // Simulate a click to trigger the close logic
     }
 });
