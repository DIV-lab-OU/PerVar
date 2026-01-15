const ENDPOINT = 'https://script.google.com/macros/s/AKfycby6opSWI8r_t1sz2tVPkAzRzSq1mA2jfzNW-ja9IbjyLnxRBa07C1rHcohbrtH-Di15Sg/exec';

const form = document.getElementById('interest-form');

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  let statusRegion = document.getElementById('form-status');
  // If the page doesn't include a status region, create one above the form for feedback.
  if (!statusRegion) {
    statusRegion = document.createElement('div');
    statusRegion.id = 'form-status';
    statusRegion.className = 'form-status';
    form.insertBefore(statusRegion, form.firstChild);
  }
  const roleRadios = Array.from(form.querySelectorAll('input[name="role"]'));
  const roleOtherInput = document.getElementById('role-other-text');
  const roleOtherWrapper = document.getElementById('role-other-wrapper');
  const timezoneSelect = document.getElementById('timezone');

  // Defensive: ensure the 'Other' free-text field is hidden on initial load
  if (roleOtherWrapper) {
    roleOtherWrapper.hidden = true;
    roleOtherWrapper.setAttribute('aria-hidden', 'true');
  }
  if (roleOtherInput) {
    roleOtherInput.required = false;
    roleOtherInput.value = '';
  }
  // mark all radios as collapsed initially
  roleRadios.forEach((r) => r.setAttribute('aria-expanded', 'false'));

  const errorMap = new Map();
  form.querySelectorAll('.field-error').forEach((node) => {
    const key = node.id.replace('error-', '');
    errorMap.set(key, node);
  });

  const controls = {
    experience: document.getElementById('experience'),
    affiliation: document.getElementById('affiliation'),
    organization: document.getElementById('organization'),
    timezone: document.getElementById('timezone'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    alternate: document.getElementById('alternate')
  };

  const updateRoleOtherVisibility = () => {
    const selected = getSelectedRole();
    const isOther = selected && selected.value === 'Other';
    roleOtherWrapper.hidden = !isOther;
  roleOtherWrapper.setAttribute('aria-hidden', String(!isOther));
    roleOtherInput.required = isOther;
    roleRadios.forEach((radio) => radio.setAttribute('aria-expanded', String(isOther && radio.value === 'Other')));
    if (!isOther) {
      roleOtherInput.value = '';
      clearError('role-other');
    }
  };

  const getSelectedRole = () => roleRadios.find((radio) => radio.checked);

  const showStatus = (message, type = '') => {
    if (!statusRegion) return; // gracefully no-op if no status region in DOM
    statusRegion.textContent = message;
    statusRegion.classList.remove('success', 'error');
    if (type) {
      statusRegion.classList.add(type);
    }
  };

  const showError = (key, message) => {
    const node = errorMap.get(key);
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
    node.setAttribute('role', 'alert');
    const field = getFieldByKey(key);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', node.id);
    }
  };

  const clearError = (key) => {
    const node = errorMap.get(key);
    if (!node) return;
    node.textContent = '';
    node.hidden = true;
  node.removeAttribute('role');
    const field = getFieldByKey(key);
    if (field) {
      field.removeAttribute('aria-invalid');
    }
  };

  const getFieldByKey = (key) => {
    if (key === 'role') return roleRadios[0];
    if (key === 'role-other') return roleOtherInput;
    return controls[key] || null;
  };

  const validateRole = (showErrors = true) => {
    const selected = getSelectedRole();
    if (!selected) {
      if (showErrors) showError('role', 'Select the role that best describes you.');
      return false;
    }
    clearError('role');
    if (selected.value === 'Other') {
      if (!roleOtherInput.value.trim()) {
        if (showErrors) showError('role-other', 'Please describe your role when "Other" is selected.');
        return false;
      }
    }
    clearError('role-other');
    return true;
  };

  const validateRequiredText = (key, message, showErrors = true) => {
    const field = controls[key];
    if (!field) return true;
    if (!field.value.trim()) {
      if (showErrors) showError(key, message);
      return false;
    }
    clearError(key);
    return true;
  };

  const validateSelect = (key, message, showErrors = true) => {
    const field = controls[key];
    if (!field) return true;
    if (!field.value) {
      if (showErrors) showError(key, message);
      return false;
    }
    clearError(key);
    return true;
  };

  const validateEmail = (showErrors = true) => {
    const { email } = controls;
    const value = email.value.trim();
    if (!value) {
      if (showErrors) showError('email', 'Email is required.');
      return false;
    }
    const emailPattern = /^(?:[a-zA-Z0-9_'^&+{}=\-`~]+(?:\.[a-zA-Z0-9_'^&+{}=\-`~]+)*)@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
    if (!emailPattern.test(value)) {
      if (showErrors) showError('email', 'Enter a valid email address.');
      return false;
    }
    clearError('email');
    return true;
  };

  const validateForm = (showErrors = true) => {
    const roleValid = validateRole(showErrors);
    const expValid = validateSelect('experience', 'Select your years of experience.', showErrors);
    const timezoneValid = validateSelect('timezone', 'Select your time zone.', showErrors);
    const nameValid = validateRequiredText('name', 'Please enter your name.', showErrors);
    const emailValid = validateEmail(showErrors);
    return roleValid && expValid && timezoneValid && nameValid && emailValid;
  };

  const updateSubmitState = () => {
    const isValid = validateForm(false);
    submitButton.disabled = !isValid;
    return isValid;
  };

  const serializeForm = () => {
    const data = new FormData(form);
    const payload = {};
    for (const [key, value] of data.entries()) {
      if (payload[key]) {
        payload[key] = [payload[key], value].join(', ');
      } else {
        payload[key] = value;
      }
    }
    const selected = getSelectedRole();
    if (selected && selected.value === 'Other') {
      payload.roleOther = roleOtherInput.value.trim();
    }
    payload.nonce = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    payload.submittedAt = new Date().toISOString();
    return payload;
  };

  const setLoading = (loading) => {
    submitButton.disabled = loading;
    submitButton.setAttribute('aria-busy', String(loading));
    submitButton.textContent = loading ? 'Submitting…' : 'Submit interest';
  };

  // Show/hide the 'Please describe your role' input only when the user actively clicks the 'Other' radio.
  const roleOtherRadio = form.querySelector('input[id="role-other"]');
  roleRadios.forEach((radio) => {
    // keep validation reactive on change but do not toggle the other field here
    radio.addEventListener('change', () => {
      validateRole(false);
      updateSubmitState();
    });
    // clicking any non-Other radio should hide the extra field
    if (radio !== roleOtherRadio) {
      radio.addEventListener('click', (e) => {
        // Only respond to actual pointer clicks (mouse/touch). Ignore keyboard-initiated clicks.
        if (e && typeof e.detail === 'number' && e.detail === 0) return;
        roleOtherWrapper.hidden = true;
        roleOtherWrapper.setAttribute('aria-hidden', 'true');
        roleOtherInput.required = false;
        roleOtherInput.value = '';
        roleRadios.forEach((r) => r.setAttribute('aria-expanded', 'false'));
        clearError('role-other');
      });
    }
  });

  if (roleOtherRadio) {
    roleOtherRadio.addEventListener('click', (e) => {
      // Only show the extra input on pointer clicks (mouse/touch), not keyboard selection.
      if (e && typeof e.detail === 'number' && e.detail === 0) return;
      roleOtherWrapper.hidden = false;
      roleOtherWrapper.setAttribute('aria-hidden', 'false');
      roleOtherInput.required = true;
      roleOtherRadio.setAttribute('aria-expanded', 'true');
      updateSubmitState();
      // move focus to the text input for convenience
      setTimeout(() => roleOtherInput.focus(), 50);
    });
  }

  Object.values(controls).forEach((control) => {
    if (!control) return; // guard missing elements
    control.addEventListener('input', () => {
      if (control === controls.email) {
        validateEmail(false);
      } else {
        validateForm(false);
      }
      updateSubmitState();
    });
    control.addEventListener('blur', () => {
      if (control === controls.email) {
        validateEmail();
      } else {
        validateForm();
      }
    });
  });

  if (roleOtherInput) {
    roleOtherInput.addEventListener('input', () => {
      if (roleOtherInput.value.trim()) {
        clearError('role-other');
      }
      updateSubmitState();
    });
  }

  // Time zone population (Outlook-style labels)
  // Primary source: Maintained list with text like "(UTC+05:45) Kathmandu"
  const TZ_LIST_API = 'https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json';
  // Fallback source: Plain IANA list
  const TZ_LIST_FALLBACK = 'https://worldtimeapi.org/api/timezone';

  function setSelectOptions(select, items, placeholder = 'Select an option') {
    select.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder;
    ph.disabled = true;
    ph.selected = true;
    select.appendChild(ph);
    items.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label || value;
      select.appendChild(opt);
    });
  }

  async function loadAllTimezones() {
    try {
      // Try the Outlook-style dataset first
      const res = await fetch(TZ_LIST_API, { cache: 'force-cache' });
      if (!res.ok) throw new Error('tz list status ' + res.status);
      const data = await res.json(); // array of objects
      let items = data
        .filter((tz) => tz && tz.value && tz.text)
        .sort((a, b) => {
          const ao = typeof a.offset === 'number' ? a.offset : 0;
          const bo = typeof b.offset === 'number' ? b.offset : 0;
          if (ao !== bo) return ao - bo;
          return a.text.localeCompare(b.text);
        })
        .map((tz) => ({ value: tz.value, label: tz.text }));
      if (!items.length) throw new Error('Empty TZ items');
      setSelectOptions(timezoneSelect, items, 'Select a time zone');
    } catch (e) {
      console.error('Failed to load time zones', e);
      try {
        // Fallback to plain IANA names if the curated list fails
        const res2 = await fetch(TZ_LIST_FALLBACK, { cache: 'force-cache' });
        if (!res2.ok) throw new Error('fallback tz list status ' + res2.status);
        const zones = await res2.json(); // array of strings
        const items = zones
          .filter((z) => typeof z === 'string')
          .sort((a, b) => a.localeCompare(b))
          .map((z) => ({ value: z, label: z.replaceAll('_', ' ') }));
        setSelectOptions(timezoneSelect, items, 'Select a time zone');
        timezoneSelect.disabled = false;
      } catch (e2) {
        // Final minimal fallback to ensure the form is usable
        console.error('Failed to load fallback time zones', e2);
        const fallback = [
          'UTC', 'Asia/Kathmandu', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
          'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
          'Australia/Sydney'
        ].map((z) => ({ value: z, label: z.replaceAll('_', ' ') }));
        setSelectOptions(timezoneSelect, fallback, 'Select a time zone');
        timezoneSelect.disabled = false;
      }
    }
  }
  if (timezoneSelect) {
    loadAllTimezones();
    timezoneSelect.addEventListener('change', () => {
      clearError('timezone');
      updateSubmitState();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showStatus('');
    if (!validateForm(true)) {
      showStatus('Please fix the highlighted fields and try again.', 'error');
      submitButton.disabled = true;
      return;
    }

    const payload = serializeForm();
    setLoading(true);

    try {
      // Send as URL-encoded to avoid CORS preflight; Apps Script can read via e.parameter
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(payload)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Treat any successful HTTP 2xx as success. Some Apps Script endpoints return HTML/text.
      const success = document.createElement('div');
      success.className = 'form-success';
      success.setAttribute('role', 'status');
      success.innerHTML = '<p><strong>Submitted successfully.</strong> Please choose a preferred time to schedule your 30‑minute interview below.</p><p><a href="https://calendly.com/pandey-ou/pervar-interview-study" target="_blank" rel="noopener noreferrer" class="button primary">Schedule a 30‑minute interview</a></p>';
      // Replace the form with a success message (page reload will restore the original form)
      form.replaceWith(success);
    } catch (error) {
      console.error(error);
      showStatus('We could not submit your interest right now. Please retry in a moment or email pandey@ou.edu.', 'error');
      submitButton.disabled = false;
    } finally {
      setLoading(false);
    }
  });

  updateSubmitState();
}
 
