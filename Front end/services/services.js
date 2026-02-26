// services.js - page-specific JS for Services
// Add custom interactivity for services page here

// Example: Highlight service cards on scroll

document.addEventListener('DOMContentLoaded', function() {
  var cards = document.querySelectorAll('.service');
  if(cards.length) {
    window.addEventListener('scroll', function() {
      cards.forEach(function(card) {
        var rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight - 80) {
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
        }
      });
    });
  }
});
