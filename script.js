// ==========================================================
// script.js — Accessible form validation + bonus API fetch
// ==========================================================

// ---------------------------------------------------------
// 1 & 2 & 3: Empty field validation + format validation
// (email must contain @), with errors clearing live as the
// user corrects each field.
// ---------------------------------------------------------

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only name, email, and message are required. Phone is optional,
// but if the user does type something, it must look like a phone
// number (digits, spaces, dashes, parentheses, optional leading +).
const phonePattern = /^[\d\s\-().+]{7,}$/;

function isFieldValid(fieldId) {
  const value = document.getElementById(fieldId).value.trim();

  if (fieldId === 'email') {
    return emailPattern.test(value);
  }
  if (fieldId === 'phone') {
    // Phone is optional — empty counts as valid.
    return value === '' || phonePattern.test(value);
  }
  return value.length > 0;
}

function setFieldError(fieldId, hasError) {
  const wrapper = document.getElementById(fieldId + '-field');
  const input = document.getElementById(fieldId);
  wrapper.classList.toggle('has-error', hasError);
  input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

// Clear each field's error live as the user fixes it.
['name', 'email', 'phone', 'message'].forEach(function (fieldId) {
  document.getElementById(fieldId).addEventListener('input', function () {
    if (isFieldValid(fieldId)) {
      setFieldError(fieldId, false);
    }
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameValid = isFieldValid('name');
  const emailValid = isFieldValid('email');
  const phoneValid = isFieldValid('phone');
  const messageValid = isFieldValid('message');

  setFieldError('name', !nameValid);
  setFieldError('email', !emailValid);
  setFieldError('phone', !phoneValid);
  setFieldError('message', !messageValid);

  if (nameValid && emailValid && phoneValid && messageValid) {
    const name = document.getElementById('name').value.trim();
    status.textContent = 'Thanks, ' + name + ' — your message has been received.';
    status.className = 'success';
    form.reset();
  } else {
    status.textContent = 'Please fix the highlighted fields below and try again.';
    status.className = 'error';
  }
});

// ---------------------------------------------------------
// 4. Bonus: fetch() call to a free public API with error handling
// ---------------------------------------------------------

const factButton = document.getElementById('fact-btn');
const factText = document.getElementById('fact-text');

factButton.addEventListener('click', function () {
  factText.textContent = 'Loading...';

  fetch('https://catfact.ninja/fact')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then(function (data) {
      factText.textContent = data.fact;
    })
    .catch(function () {
      factText.textContent = 'Could not load a fact right now — please try again.';
    });
});
