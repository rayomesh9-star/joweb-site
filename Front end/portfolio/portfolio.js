// portfolio.js - page-specific JS for Portfolio

/**
 * Configuration constants for easy maintenance
 */
const CONFIG = Object.freeze({
  IMAGE_BASE_PATH: '../images/',
  SCROLL_THRESHOLD: 80,
  DEBOUNCE_DELAY: 150
});

/**
 * Service categories enum for consistency across all projects
 */
const SERVICES = Object.freeze({
  GRAPHIC_DESIGN: 'Graphic Design',
  LOGISTICS: 'Logistics & Transportation',
  PRINTING: 'Printing & Branding'
});

// Project details database with validated structure
const projectDetails = Object.freeze({
  'retail-rebrand': {
    title: 'Retail Rebrand',
    description: 'Complete rebranding package for a regional retail chain.',
    details: [
      'Designed modern logo with versatile mark system',
      'Created comprehensive packaging design for 8 product lines',
      'Developed in-store signage and POS materials',
      'Brand guidelines and implementation standards',
      'Resulted in 23% increase in brand recognition'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba2.jpg`,
    service: SERVICES.GRAPHIC_DESIGN
  },
  'supply-chain': {
    title: 'Supply Chain Optimization',
    description: 'Strategic redesign of transportation network for logistics company.',
    details: [
      'Analyzed existing distribution and delivery routes',
      'Implemented optimized hub-and-spoke model',
      'Reduced delivery times by 18% across all regions',
      'Created visual dashboards for route management',
      'Designed reporting materials for stakeholder presentations',
      'Cost savings of $2.3M annually'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba3.jpg`,
    service: SERVICES.LOGISTICS
  },
  'trade-show': {
    title: 'Trade Show Collateral',
    description: 'Complete marketing materials suite for international trade show.',
    details: [
      '10x20ft custom booth design and build specs',
      'High-impact banner system with modular components',
      'Printed brochures with product specs and benefits',
      'Leave-behind promotional cards and USB holders',
      'Digital display content and booth signage',
      'Generated 247 qualified leads during 3-day event'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba4.jpg`,
    service: SERVICES.PRINTING
  },
  'corporate-identity': {
    title: 'Corporate Identity',
    description: 'Comprehensive brand identity system for tech startup.',
    details: [
      'Modern, scalable logo design with mark variations',
      'Complete color palette and typography system',
      'Brand guidelines covering 40+ usage scenarios',
      'Business card, letterhead, and envelope design',
      'Email signature and digital asset templates',
      'Application across website and marketing materials'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba5.jpg`,
    service: SERVICES.GRAPHIC_DESIGN
  },
  'packaging-design': {
    title: 'Packaging Design',
    description: 'Custom packaging solutions for rapidly growing e-commerce brand.',
    details: [
      'Structural design for sustainability and functionality',
      'Eye-catching graphics aligned with brand identity',
      'Created 3 packaging variants for product lines',
      'Die-cut templates and production specifications',
      'Unboxing experience optimization',
      'Resulted in 34% improvement in customer perception'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba6.jpg`,
    service: SERVICES.PRINTING
  },
  'digital-campaign': {
    title: 'Digital Campaign',
    description: 'Integrated marketing materials for multi-channel product launch.',
    details: [
      'Social media graphics and templates (Instagram, LinkedIn, Facebook)',
      'Email newsletter design and animation',
      'Digital ads and banner formats',
      'Website hero graphics and product visuals',
      'Motion graphics for promotional video',
      'Achieved 156% higher engagement than industry average'
    ],
    image: `${CONFIG.IMAGE_BASE_PATH}ba2.jpg`,
    service: SERVICES.GRAPHIC_DESIGN
  }
});

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Creates image element with error handling and lazy loading
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @returns {string} - HTML string
 */
function createSafeImage(src, alt) {
  // Use onerror only if the image exists (check for placeholder.jpg existence)
  const fallback = `this.onerror=null;this.src='${CONFIG.IMAGE_BASE_PATH}ba2.jpg'`;
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" 
          onerror="${fallback}" loading="lazy">`;
}

/**
 * Validates project object has required fields
 * @param {Object} project - Project to validate
 * @returns {boolean} - True if valid
 */
function validateProject(project) {
  const required = ['title', 'description', 'details', 'image', 'service'];
  return required.every(field => 
    project && typeof project[field] !== 'undefined' && project[field] !== ''
  );
}

/**
 * Debounce utility for scroll handler performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Helper to close a modal
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Handle portfolio card clicks
function setupPortfolioInteraction() {
  const cards = document.querySelectorAll('.portfolio-card');
  
  cards.forEach(card => {
    const projectId = card.getAttribute('data-project-id');
    
    // Skip if no project ID or project doesn't exist
    if (!projectId || !projectDetails[projectId]) {
      console.warn(`Project not found: ${projectId}`);
      return;
    }
    
    card.addEventListener('click', () => openProjectModal(projectId));
    
    // Improve accessibility - keyboard support
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(projectId);
      }
    });
  });
}

// Modal close functionality
function setupModalHandlers() {
  const modals = document.querySelectorAll('.modal');
  
  // Single escape key listener for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('show')) {
          closeModal(modal);
        }
      });
    }
  });
  
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const handleClose = () => closeModal(modal);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', handleClose);
    }
    
    if (overlay) {
      overlay.addEventListener('click', handleClose);
    }
  });
}

// Open project modal with details
function openProjectModal(projectId) {
  const project = projectDetails[projectId];
  
  // Validate project exists
  if (!project) {
    console.error(`Project not found: ${projectId}`);
    return;
  }
  
  // Validate project data
  if (!validateProject(project)) {
    console.error(`Invalid project data for: ${projectId}`);
    return;
  }
  
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('projectContent');
  const titleEl = document.getElementById('projectModalTitle');
  
  // Check required DOM elements exist
  if (!modal || !content || !titleEl) {
    console.error('Modal elements not found in DOM');
    return;
  }
  
  // Build content HTML safely using map and join (more efficient)
  const detailsHtml = project.details
    .map(detail => `<li>${escapeHtml(detail)}</li>`)
    .join('');
  
  // Use template literals with escaped content
  content.innerHTML = `
    ${createSafeImage(project.image, project.title)}
    <p><strong>${escapeHtml(project.service)}</strong></p>
    <p>${escapeHtml(project.description)}</p>
    <h3>Project Details:</h3>
    <ul>${detailsHtml}</ul>
  `;
  
  titleEl.textContent = project.title;
  
  // Update "Interested" button with proper handler management
  const interestedBtn = document.getElementById('projectInterested');
  if (interestedBtn) {
    interestedBtn.onclick = () => {
      closeModal(modal);
      const quoteModal = document.getElementById('quoteModal');
      if (quoteModal) {
        quoteModal.classList.add('show');
        quoteModal.setAttribute('aria-hidden', 'false');
      }
    };
  }
  
  // Show modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

// Optimized scroll handler with debouncing
function setupScrollAnimation() {
  const cards = document.querySelectorAll('.portfolio-card');
  
  if (!cards.length) return;
  
  const animateCards = debounce(() => {
    const threshold = window.innerHeight - CONFIG.SCROLL_THRESHOLD;
    
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const shouldBeVisible = rect.top < threshold;
      
      card.classList.toggle('visible', shouldBeVisible);
    });
  }, CONFIG.DEBOUNCE_DELAY);
  
  // Use passive listener for better scroll performance
  window.addEventListener('scroll', animateCards, { passive: true });
  
  // Trigger initial check
  animateCards();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setupPortfolioInteraction();
  setupModalHandlers();
  setupScrollAnimation();
});
