// portfolio.js - page-specific JS for Portfolio
// Add custom interactivity for portfolio page here

document.addEventListener('DOMContentLoaded', function() {
  // Example: Animate portfolio cards on scroll
  var cards = document.querySelectorAll('.portfolio-card');
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
