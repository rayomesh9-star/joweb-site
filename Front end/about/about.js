// about.js - page-specific JS for About
// Add custom interactivity for about page here

document.addEventListener('DOMContentLoaded', function() {
  // Example: Animate mission section on scroll
  var mission = document.querySelector('h2');
  if(mission) {
    window.addEventListener('scroll', function() {
      var rect = mission.getBoundingClientRect();
      if(rect.top < window.innerHeight - 60) {
        mission.classList.add('visible');
      } else {
        mission.classList.remove('visible');
      }
    });
  }
});
