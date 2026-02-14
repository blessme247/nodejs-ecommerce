//  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
//     const mobileMenu = document.getElementById('mobileMenu');

//     mobileMenuToggle.addEventListener('click', () => {
//       mobileMenuToggle.classList.toggle('active');
//       mobileMenu.classList.toggle('active');
//     });

//     // Close mobile menu when clicking a link
//     const mobileLinks = document.querySelectorAll('.nav-mobile-link, .mobile-auth-buttons a');
//     mobileLinks.forEach(link => {
//       link.addEventListener('click', () => {
//         mobileMenuToggle.classList.remove('active');
//         mobileMenu.classList.remove('active');
//       });
//     });

//     // Close mobile menu on window resize to desktop
//     window.addEventListener('resize', () => {
//       if (window.innerWidth >= 768) {
//         mobileMenuToggle.classList.remove('active');
//         mobileMenu.classList.remove('active');
//       }
//     });

  // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.nav-mobile-link, .mobile-auth-buttons a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });

    // Profile Dropdown Toggle
    const profileDropdown = document.getElementById('profileDropdown');
    const profileButton = document.getElementById('profileButton');

    if (profileButton) {
      profileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('active');
        }
      });
    }