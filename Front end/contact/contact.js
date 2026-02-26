// contact.js - page-specific JS for Contact
// Add custom interactivity for contact page here

document.addEventListener('DOMContentLoaded', function() {
  // Example: Animate contact form on scroll
  var form = document.getElementById('contactForm');
  if(form) {
    window.addEventListener('scroll', function() {
      var rect = form.getBoundingClientRect();
      if(rect.top < window.innerHeight - 60) {
        form.classList.add('visible');
      } else {
        form.classList.remove('visible');
      }
    });
  }
});
