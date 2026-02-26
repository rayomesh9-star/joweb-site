// quote.js - page-specific JS for Quote
// Add custom interactivity for quote page here

document.addEventListener('DOMContentLoaded', function() {
  // Example: Animate quote form on scroll
  var form = document.getElementById('quoteForm');
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
