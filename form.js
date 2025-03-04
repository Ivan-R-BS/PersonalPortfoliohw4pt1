document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formpost');
    const nameInput = document.getElementById('yourname');
    const emailInput = document.getElementById('email');
    const commentsTextarea = document.getElementById('comments');
    const errorMessage = document.getElementById('errormessage');
    const infoMessage = document.getElementById('infomessage');
    const submitButton = document.getElementById('submit');
  
    // Collect errors here
    let form_errors = [];
  
    // Create a hidden input to store form errors
    const formErrorsInput = document.createElement('input');
    formErrorsInput.type = 'hidden';
    formErrorsInput.name = 'form-errors';
    formErrorsInput.id = 'form-errors';
    form.appendChild(formErrorsInput);
  
    // Regex definitions:
    // Name now accepts letters and spaces.
    const nameAllowed = /^[A-Za-z\s]+$/;
    const singleCharNameAllowed = /[A-Za-z\s]/;
    // Comments: letters, digits, spaces, and basic punctuation
    const commentsAllowed = /^[A-Za-z0-9\s.,!?'"-]+$/;
    const singleCharCommentsAllowed = /[A-Za-z0-9\s.,!?'"-]/;
  
    // Show a quick error message with a red background so it stands out.
    function showFlashError(msg) {
      errorMessage.textContent = msg;
      errorMessage.style.display = 'block';
      errorMessage.style.color = '#fff';
      errorMessage.style.backgroundColor = 'red';
      errorMessage.style.border = '2px solid darkred';
      errorMessage.style.padding = '0.5em';
  
      // Remove the message after 3 seconds.
      setTimeout(() => {
        errorMessage.style.display = 'none';
        errorMessage.style.color = '';
        errorMessage.style.backgroundColor = '';
        errorMessage.style.border = '';
        errorMessage.style.padding = '';
      }, 3000);
    }
  
    // Flash the border and background of the element temporarily.
    function flashBorder(element) {
      const originalBorder = element.style.border;
      const originalBg = element.style.backgroundColor;
  
      // Temporarily set red border and light red background.
      element.style.border = '2px solid red';
      element.style.backgroundColor = '#ffd5d5';
  
      // Reset after 500ms.
      setTimeout(() => {
        element.style.border = originalBorder;
        element.style.backgroundColor = originalBg;
      }, 500);
    }
  
    // Reset specific input style to default.
    function resetInputStyle(input) {
      if (input.hasAttribute('required')) {
        // For required fields, default is lightgoldenrodyellow.
        input.style.backgroundColor = 'lightgoldenrodyellow';
      } else {
        input.style.backgroundColor = '';
      }
      input.style.border = '';
    }
  
    // Mark a field as invalid: add a class and set a persistent light red background.
    function markInvalid(field) {
      field.classList.add('invalid');
      // For both name and email, set persistent light red background.
      if (field === nameInput || field === emailInput) {
        field.style.backgroundColor = '#ffcccc'; // persistent light red
      }
    }
  
    // Mark a field as valid: remove the invalid class and reset the background.
    function markValid(field) {
      field.classList.remove('invalid');
      if (field === nameInput || field === emailInput) {
        if (field.hasAttribute('required')) {
          field.style.backgroundColor = 'lightgoldenrodyellow';
        } else {
          field.style.backgroundColor = '';
        }
      }
    }
  
    // --- NAME FIELD HANDLERS ---
  
    nameInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const lastChar = value.slice(-1);
      
      // If the last character is invalid (not a letter or space), remove it.
      if (lastChar && !singleCharNameAllowed.test(lastChar)) {
        e.target.value = value.slice(0, -1);
        
        showFlashError(`Invalid character: "${lastChar}" - Only letters and spaces are allowed`);
        flashBorder(e.target);
        
        form_errors.push({
          field: 'name',
          type: 'invalid_character',
          value: lastChar,
          timestamp: new Date().toISOString()
        });
        formErrorsInput.value = JSON.stringify(form_errors);
      }
      // Reset style after input.
      resetInputStyle(e.target);
      updateFormStatus();
    });
  
    nameInput.addEventListener('blur', () => {
      nameInput.value = nameInput.value.trim();
      if (!nameInput.value || !nameAllowed.test(nameInput.value)) {
        markInvalid(nameInput);
      } else {
        markValid(nameInput);
      }
      updateFormStatus();
    });
  
    // --- EMAIL FIELD HANDLERS ---
  
    emailInput.addEventListener('input', () => {
      resetInputStyle(emailInput);
      updateFormStatus();
    });
  
    function validateEmail() {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val || !emailRegex.test(val)) {
        markInvalid(emailInput);
        return false;
      } else {
        markValid(emailInput);
        return true;
      }
    }
  
    emailInput.addEventListener('blur', () => {
      if (!validateEmail()) {
        showFlashError("Invalid email address. Please use format: name@domain.com");
        flashBorder(emailInput);
      }
      updateFormStatus();
    });
  
    // --- COMMENTS FIELD HANDLERS ---
  
    commentsTextarea.addEventListener('input', (e) => {
      const value = e.target.value;
      const lastChar = value.slice(-1);
      
      if (lastChar && !singleCharCommentsAllowed.test(lastChar)) {
        e.target.value = value.slice(0, -1);
        
        showFlashError(`Invalid character: "${lastChar}" - Only letters, numbers, spaces, and basic punctuation are allowed`);
        flashBorder(e.target);
        
        form_errors.push({
          field: 'comments',
          type: 'invalid_character',
          value: lastChar,
          timestamp: new Date().toISOString()
        });
        formErrorsInput.value = JSON.stringify(form_errors);
      }
      
      resetInputStyle(e.target);
      updateCharacterCounter();
      updateFormStatus();
    });
  
    commentsTextarea.addEventListener('blur', () => {
      commentsTextarea.value = commentsTextarea.value.trim();
      updateCharacterCounter();
    });
  
    // --- CHARACTER COUNTER FOR COMMENTS ---
    
    const maxLength = parseInt(commentsTextarea.getAttribute('maxlength'), 10);
    function updateCharacterCounter() {
      const used = commentsTextarea.value.length;
      const remaining = maxLength - used;
      
      if (remaining <= 50) {
        infoMessage.style.display = 'block';
        if (remaining <= 20) {
          infoMessage.textContent = `Only ${remaining} characters remaining!`;
          infoMessage.style.color = 'red';
          infoMessage.style.borderColor = 'red';
          infoMessage.style.backgroundColor = '#fff0f0';
        } else {
          infoMessage.textContent = `${remaining} characters remaining`;
          infoMessage.style.color = 'orange';
          infoMessage.style.borderColor = 'orange';
          infoMessage.style.backgroundColor = '#fff8e8';
        }
      } else {
        checkFormReadiness();
      }
    }
  
    // --- FORM READINESS CHECK ---
    
    function checkFormReadiness() {
      const nameValid = nameInput.value && nameAllowed.test(nameInput.value);
      const emailValid = emailInput.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
      
      if (nameValid && emailValid) {
        infoMessage.style.display = 'block';
        infoMessage.textContent = 'Form is ready to submit';
        infoMessage.style.color = 'green';
        infoMessage.style.borderColor = 'green';
        infoMessage.style.backgroundColor = '#f0fff0';
      } else {
        infoMessage.style.display = 'none';
      }
    }
  
    function updateFormStatus() {
      if (commentsTextarea.value.length > 0 && (maxLength - commentsTextarea.value.length) <= 50) {
        updateCharacterCounter();
      } else {
        checkFormReadiness();
      }
    }
  
    // --- FORM SUBMISSION HANDLER ---
    
    form.addEventListener('submit', (e) => {
      formErrorsInput.value = JSON.stringify(form_errors);
      
      const nameValid = nameInput.value && nameAllowed.test(nameInput.value);
      if (!nameValid) {
        e.preventDefault();
        showFlashError('Name must contain only letters and spaces');
        flashBorder(nameInput);
        markInvalid(nameInput);
        form_errors.push({
          field: 'name',
          type: 'validation_failed',
          value: nameInput.value,
          timestamp: new Date().toISOString()
        });
        formErrorsInput.value = JSON.stringify(form_errors);
      }
      
      if (!form.checkValidity()) {
        e.preventDefault();
        showFlashError('Please fix errors before submitting');
        form_errors.push({
          field: 'form',
          type: 'submission_with_errors',
          timestamp: new Date().toISOString()
        });
        formErrorsInput.value = JSON.stringify(form_errors);
      }
    });
  
    // Initialize: reset styles and update form status.
    resetInputStyle(nameInput);
    resetInputStyle(emailInput);
    resetInputStyle(commentsTextarea);
    updateFormStatus();
  });
  