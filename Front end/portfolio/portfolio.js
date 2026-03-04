// portfolio.js - page-specific JS for Portfolio

// Project details database
const projectDetails = {
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
    image: '../images/ba2.jpg',
    service: 'Graphic Design'
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
    image: '../images/ba3.jpg',
    service: 'Logistics & Transportation'
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
    image: '../images/ba4.jpg',
    service: 'Printing & Branding'
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
    image: '../images/ba4.jpg',
    service: 'Graphic Design'
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
    image: '../images/ba4.jpg',
    service: 'Printing & Branding'
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
    image: '../images/ba4.jpg',
    service: 'Graphic Design'
  }
};

// Handle portfolio card clicks
function setupPortfolioInteraction() {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const projectId = this.getAttribute('data-project-id');
      if (projectId && projectDetails[projectId]) {
        openProjectModal(projectId);
      }
    });
  });
}

// Modal close functionality
function setupModalHandlers() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', function() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
  });
}

// Open project modal with details
function openProjectModal(projectId) {
  const project = projectDetails[projectId];
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const content = document.getElementById('projectContent');
  
  // Build content HTML
  let html = `
    <img src="${project.image}" alt="${project.title}">
    <p><strong>${project.service}</strong></p>
    <p>${project.description}</p>
    <h3>Project Details:</h3>
    <ul>
  `;
  
  project.details.forEach(detail => {
    html += `<li>${detail}</li>`;
  });
  
  html += '</ul>';
  
  content.innerHTML = html;
  document.getElementById('projectModalTitle').textContent = project.title;
  
  // Update "Interested" button
  const interestedBtn = document.getElementById('projectInterested');
  interestedBtn.onclick = function() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    const quoteModal = document.getElementById('quoteModal');
    quoteModal.classList.add('show');
    quoteModal.setAttribute('aria-hidden', 'false');
  };
  
  // Show modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', function() {
  setupPortfolioInteraction();
  setupModalHandlers();
  
  // Animate portfolio cards on scroll
  const cards = document.querySelectorAll('.portfolio-card');
  if(cards.length) {
    window.addEventListener('scroll', function() {
      cards.forEach(function(card) {
        const rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight - 80) {
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
        }
      });
    });
  }
});
