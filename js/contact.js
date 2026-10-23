/**
 * COTA ZERO — contact.js
 * Validação acessível e envio simulado do formulário de contacto.
 * Não existe backend: os dados ficam no browser e nunca são transmitidos.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{9,24}$/;

const clean = (value) => String(value ?? "").trim();

const digits = (value) => clean(value).replace(/\D/g, "");

const validators = {
  nome: (value) => (clean(value).length >= 2 ? "" : "Indique o nome, com pelo menos 2 caracteres."),
  email: (value) =>
    EMAIL.test(clean(value)) ? "" : "Introduza um email válido, por exemplo nome@dominio.pt.",
  telefone: (value) => {
    if (!clean(value)) return "";
    const number = digits(value);
    return PHONE.test(clean(value)) && number.length >= 9 && number.length <= 15
      ? ""
      : "Introduza um número com 9 a 15 dígitos.";
  },
  tipo: (value) => (clean(value) ? "" : "Escolha o tipo de projeto."),
  mensagem: (value) =>
    clean(value).length >= 20 ? "" : "Descreva o pedido com pelo menos 20 caracteres.",
  rgpd: (_, field) => (field.checked ? "" : "Autorize o tratamento dos dados para podermos responder.")
};

const labels = {
  nome: "Nome",
  email: "Email",
  telefone: "Telefone",
  tipo: "Tipo de projeto",
  mensagem: "Mensagem",
  rgpd: "Autorização de dados"
};

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form || form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const summary = form.querySelector("[data-form-error-summary]");
  const status = document.querySelector("[data-form-status]");
  const submit = form.querySelector("[data-form-submit]");
  const submitText = form.querySelector("[data-submit-text]");
  const message = form.querySelector("[name='mensagem']");
  const charCount = form.querySelector("[data-char-count]");
  const honeypot = form.querySelector("[name='website']");
  let sending = false;

  const fieldFor = (name) => form.querySelector(`[data-field="${name}"]`);
  const controlFor = (name) => form.querySelector(`[name="${name}"]`);
  const errorFor = (name) => form.querySelector(`[data-error-for="${name}"]`);

  const setError = (name, text) => {
    const field = fieldFor(name);
    const control = controlFor(name);
    const error = errorFor(name);
    if (field) field.classList.toggle("has-error", Boolean(text));
    const check = field?.querySelector(".form__check");
    if (check) check.classList.toggle("has-error", Boolean(text));
    if (control) {
      control.setAttribute("aria-invalid", text ? "true" : "false");
      if (text) control.setAttribute("aria-describedby", `erro-${name}`);
      else control.removeAttribute("aria-describedby");
    }
    if (error) error.textContent = text;
  };

  const validate = (name) => {
    const control = controlFor(name);
    if (!control || !validators[name]) return "";
    const error = validators[name](control.value, control);
    setError(name, error);
    return error;
  };

  const validateAll = () => {
    const errors = [];
    Object.keys(validators).forEach((name) => {
      if (validate(name)) errors.push(name);
    });
    return errors;
  };

  const updateCount = () => {
    if (!message || !charCount) return;
    const length = message.value.length;
    charCount.textContent = `${length} / 20 caracteres mínimos`;
    charCount.classList.toggle("is-low", length < 20);
  };

  const showSummary = (errors) => {
    if (!summary) return;
    if (!errors.length) {
      summary.hidden = true;
      summary.innerHTML = "";
      return;
    }
    summary.hidden = false;
    summary.innerHTML = `
      <strong>Falta corrigir ${errors.length === 1 ? "um campo" : `${errors.length} campos`}.</strong>
      <p>Verifique os dados assinalados antes de enviar:</p>
      <ul>
        ${errors
          .map((name) => `<li><a href="#${name}">${labels[name] || name}</a></li>`)
          .join("")}
      </ul>
    `;
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  const clearSummary = () => {
    if (!summary) return;
    summary.hidden = true;
    summary.innerHTML = "";
  };

  const resetForm = () => {
    form.reset();
    Object.keys(validators).forEach((name) => setError(name, ""));
    clearSummary();
    updateCount();
    form.hidden = false;
    if (status) status.hidden = true;
    const nome = controlFor("nome");
    window.requestAnimationFrame(() => nome?.focus({ preventScroll: true }));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (sending) return;
    sending = true;

    const errors = validateAll();
    if (errors.length) {
      sending = false;
      showSummary(errors);
      return;
    }

    clearSummary();
    if (submit) submit.disabled = true;
    if (submitText) submitText.textContent = "A enviar…";
    if (honeypot) honeypot.value = "";

    // Simulação local: não há pedido de rede nem armazenamento de dados.
    window.setTimeout(() => {
      sending = false;
      if (submit) submit.disabled = false;
      if (submitText) submitText.textContent = "Enviar mensagem";
      form.hidden = true;
      if (status) {
        status.hidden = false;
        status.focus({ preventScroll: true });
      }
    }, 900);
  });

  form.addEventListener("blur", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const name = target.getAttribute("name");
    if (!name || !validators[name]) return;
    if (fieldFor(name)?.classList.contains("has-error") || form.dataset.attempted === "true") {
      validate(name);
    }
  }, true);

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const name = target.getAttribute("name");
    if (name === "mensagem") updateCount();
    if (name && validators[name] && fieldFor(name)?.classList.contains("has-error")) {
      validate(name);
    }
    if (summary && !summary.hidden && !form.querySelector(".field.has-error")) clearSummary();
  });

  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const name = target.getAttribute("name");
    if (name === "rgpd" || name === "tipo") validate(name);
  });

  status?.querySelector("[data-form-again]")?.addEventListener("click", resetForm);

  if (message) updateCount();
}
