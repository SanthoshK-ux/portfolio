/**
 * Contact Form & Clipboard Interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Copy Email to Clipboard
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const email = 'santhoshsudha128@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            showToast('Email copied to clipboard: ' + email);
          },
          function () {
            prompt('Copy email manually:', email);
          }
        );
      } else {
        prompt('Copy email manually:', email);
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please complete all required fields before sending.';
        }
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Hi Santhosh,\n\n${message}\n\nFrom: ${name} (${email})`
      );
      const mailtoUrl = `mailto:santhoshsudha128@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.textContent =
          'Opening your email client to dispatch the message. Thank you for connecting!';
      }

      setTimeout(function () {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }
});
