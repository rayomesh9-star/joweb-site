// Basic interactivity: nav toggle and simple form handlers
document.addEventListener('DOMContentLoaded',function(){
	// attach nav toggles on pages
	document.querySelectorAll('.nav-toggle').forEach(function(btn){
		btn.addEventListener('click',function(){
			// find the nearest nav in the header
			var header = btn.closest('.header-inner') || document.querySelector('.header-inner');
			var nav = header && header.querySelector('.site-nav');
			if(nav) nav.classList.toggle('show');
		});
		// allow Enter/Space to toggle for accessibility
		btn.addEventListener('keydown', function(ev){ if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); btn.click(); } });
	});

	// set years in footers
	var y = new Date().getFullYear();
	['year','yearSvc','yearAbout','yearPort','yearContact','yearQuote'].forEach(function(id){
		var el = document.getElementById(id);
		if(el) el.textContent = y;
	});
	// Close mobile nav when a link is clicked
	document.querySelectorAll('.site-nav a').forEach(function(link){
		link.addEventListener('click', function(){
			var nav = link.closest('.site-nav');
			if(nav && nav.classList.contains('show')) nav.classList.remove('show');
		});
	});

	// Wire quote modal openers (links/buttons with .open-quote)
	document.querySelectorAll('.open-quote').forEach(function(btn){
		btn.addEventListener('click', function(ev){
			ev.preventDefault();
			openQuoteModal();
		});
	});

	// Modal close listeners (overlay and close button)
	document.addEventListener('click', function(e){
		if(e.target.matches('.modal-overlay') || e.target.matches('.modal-close')){
			closeQuoteModal();
		}
	});

	// ESC to close modal
	document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeQuoteModal(); } });

	// Back-to-top behavior
	var back = document.getElementById('backToTop');
	function toggleBack(){ if(!back) return; if(window.scrollY > 240) back.classList.add('show'); else back.classList.remove('show'); }
	window.addEventListener('scroll', toggleBack); toggleBack();
	if(back) back.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

	// Newsletter handler (footer)
	var newsletterForm = document.getElementById('newsletterForm');
	if(newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
});

function openQuoteModal(){
	var modal = document.getElementById('quoteModal');
	if(!modal) return;
	modal.classList.add('show');
	modal.setAttribute('aria-hidden','false');
	var first = modal.querySelector('input,select,textarea,button');
	if(first) first.focus();
}

function closeQuoteModal(){
	var modal = document.getElementById('quoteModal');
	if(!modal) return;
	modal.classList.remove('show');
	modal.setAttribute('aria-hidden','true');
}

function handleContactSubmit(e){
	e.preventDefault();
	var form = e.target;
	var msg = document.getElementById('contactMsg');
	msg.textContent = '';
	var name = form.name.value.trim();
	var email = form.email.value.trim();
	var message = form.message.value.trim();
	if(!name || !email || !message){
		msg.textContent = 'Please complete all fields.';
		return;
	}
	// Simulate send and disable submit button for accessibility
	var submit = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
	if(submit) { submit.disabled = true; submit.setAttribute('aria-busy','true'); }
	 msg.textContent = 'Sending…';
	 fetch('/api/contact', {
	 	 method: 'POST',
	 	 headers: {'Content-Type':'application/json'},
	 	 body: JSON.stringify({name:name, email:email, message:message}),
	 	 signal: AbortSignal.timeout(5000)
	 })
	 .then(function(res){ return res.json(); })
	 .then(function(data){
	 	 if(data && data.error){
	 	 	 msg.textContent = data.error;
	 	 } else {
	 	 	 msg.textContent = 'Thank you, ' + name.split(' ')[0] + '! We received your message.';
	 	 	 form.reset();
	 	 }
	 })
	 .catch(function(){
	 	 // leave previous message or silently fail if network error occurs
	 	 console.warn('Fetch failed for contact form');
	 })
	 .finally(function(){
	 	 if(submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
	 });
}

function handleQuoteSubmit(e){
	e.preventDefault();
	var form = e.target;
	var msg = document.getElementById('quoteMsg');
	msg.textContent = '';
	var name = form.name.value.trim();
	var email = form.email.value.trim();
	if(!name || !email){
		msg.textContent = 'Please include your name and email.';
		return;
	}
	var submit = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
	if(submit) { submit.disabled = true; submit.setAttribute('aria-busy','true'); }
	 msg.textContent = 'Submitting request…';
	 fetch('/api/quote', {
	 	 method: 'POST',
	 	 headers: {'Content-Type':'application/json'},
	 	 body: JSON.stringify({name:name, email:email, service: form.service ? form.service.value : '', details: form.details ? form.details.value : '', budget: form.budget ? form.budget.value : ''}),
	 	 signal: AbortSignal.timeout(5000)
	 })
	 .then(function(res){ return res.json(); })
	 .then(function(data){
	 	 if(data && data.error){
	 	 	 msg.textContent = data.error;
	 	 } else {
	 	 	 msg.innerHTML = 'Thanks, <strong>' + (name.split(' ')[0]||name) + '</strong>! We will email a quote to <em>' + email + '</em> soon.';
	 	 	 form.reset();
	 	 }
	 })
	 .catch(function(){
	 	 console.warn('Fetch failed for quote form');
	 })
	 .finally(function(){
	 	 if(submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
	 });
}

// Modal-specific submit handler
function handleModalQuoteSubmit(e){
	e.preventDefault();
	var form = e.target;
	var msg = document.getElementById('modalQuoteMsg');
	if(!msg) return;
	msg.textContent = '';
	var name = form.name.value.trim();
	var email = form.email.value.trim();
	if(!name || !email){ msg.textContent = 'Please include your name and email.'; return; }
	var submit = form.querySelector('button[type="submit"]');
	if(submit){ submit.disabled = true; submit.setAttribute('aria-busy','true'); }
	 msg.textContent = 'Submitting request…';
	 fetch('/api/quote', {
	 	 method: 'POST',
	 	 headers: {'Content-Type':'application/json'},
	 	 body: JSON.stringify({name:name, email:email, service: form.service ? form.service.value : '', details: form.details ? form.details.value : '', budget: form.budget ? form.budget.value : ''}),
	 	 signal: AbortSignal.timeout(5000)
	 })
	 .then(function(res){ return res.json(); })
	 .then(function(data){
	 	 if(data && data.error){
	 	 	 msg.textContent = data.error;
	 	 } else {
	 	 	 msg.innerHTML = 'Thanks, <strong>' + (name.split(' ')[0]||name) + '</strong>! We will email a quote to <em>' + email + '</em> soon.';
	 	 	 form.reset();
	 	 	 // Optionally close modal after a moment
	 	 	 setTimeout(closeQuoteModal, 1200);
	 	 }
	 })
	 .catch(function(){
	 	 console.warn('Fetch failed for modal quote form');
	 })
	 .finally(function(){
	 	 if(submit){ submit.disabled = false; submit.removeAttribute('aria-busy'); }
	 });
}

function handleNewsletterSubmit(e){
	e.preventDefault();
	var form = e.target;
	var input = form.querySelector('input[name="newsletterEmail"]');
	var msg = document.getElementById('newsletterMsg');
	if(!input || !msg) return;
	var email = input.value.trim();
	if(!email){ msg.textContent = 'Please enter a valid email.'; return; }
	var submit = form.querySelector('button[type="submit"]');
	if(submit){ submit.disabled = true; submit.setAttribute('aria-busy','true'); }
	msg.textContent = 'Subscribing…';
	setTimeout(function(){
		msg.textContent = 'Subscribed — thanks!';
		form.reset();
		if(submit){ submit.disabled = false; submit.removeAttribute('aria-busy'); }
	},900);
}