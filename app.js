/* ==========================================================================
   CONTROL VIAL - SEGURIDAD ATLAS (ZONA CARIBE)
   Lógica JavaScript ES6+ & Multi-step Wizard
   ========================================================================== */

// Configuración de URL del Script en Google Apps Script
const BACKEND_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-lnHE2s_g8aXEdWeKOlIKJQiH0VA4rqiFaQt8O3MM5UqRM0uumZVcGVvaB8z5w49rFA/exec";

// Datos de Municipios por Departamento de la Zona Caribe
const MUNICIPIOS_ZONA_CARIBE = {
  ATLANTICO: [
    "BARRANQUILLA", "BARANOA", "CAMPO DE LA CRUZ", "CANDELARIA", "GALAPA",
    "JUAN DE ACOSTA", "LURUACO", "MALAMBO", "MANATI", "PALMAR DE VARELA",
    "PIOJO", "POLONUEVO", "PONEDERA", "PUERTO COLOMBIA", "REPELON",
    "SABANAGRANDE", "SABANALARGA", "SANTA LUCIA", "SANTO TOMAS", "SOLEDAD",
    "SUAN", "TUBARA", "USIACURI"
  ],
  BOLIVAR: [
    "CARTAGENA", "ACHI", "ALTOS DEL ROSARIO", "ARENAL", "ARJONA", "ARROYOHONDO",
    "BARRANCO DE LOBA", "CALAMAR", "CANTAGALLO", "CICUCO", "CLEMENCIA", "CORDOBA",
    "EL CARMEN DE BOLIVAR", "EL GUAMO", "EL PEÑON", "HATILLO DE LOBA", "MAGANGUE",
    "MAHATES", "MARGARITA", "MARIA LA BAJA", "MOMPOS", "MONTECRISTO", "MORALES",
    "NOROSI", "PINILLOS", "REGIDOR", "RIO VIEJO", "SAN CRISTOBAL", "SAN ESTANISLAO",
    "SAN FERNANDO", "SAN JACINTO", "SAN JACINTO DEL CAUCA", "SAN JUAN NEPOMUCENO",
    "SAN MARTIN DE LOBA", "SAN PABLO", "SANTA CATALINA", "SANTA ROSA",
    "SANTA ROSA DEL SUR", "SIMITI", "SOPLAVIENTO", "TALAIGUA NUEVO", "TIQUISIS",
    "TURBACO", "TURBANA", "VILLANUEVA", "ZAMBRANO"
  ],
  MAGDALENA: [
    "SANTA MARTA", "ALGARROBO", "ARACATACA", "ARIGUANI", "PIVIJAY", "EL BANCO",
    "CIENAGA", "ZONA BANANERA", "PLATO", "FUNDACION", "GUAMAL", "PEDRAZA",
    "PIJIÑO DEL CARMEN", "SITIONUEVO", "PUEBLOVIEJO", "TENERIFE", "SAN ZENON",
    "SANTA ANA", "SANTA BARBARA DE PINTO", "SABANAS DE SAN ANGEL", "REMOLINO",
    "SALAMINA", "CHIBOLO", "CONCORDIA", "EL RETEN", "ZAPAYAN"
  ],
  CESAR: [
    "VALLEDUPAR", "AGUACHICA", "AGUSTIN CODAZZI", "ASTREA", "BECERRIL", "BOSCONIA",
    "CHIMICHAGUA", "CHIRIGUANA", "CURUMANI", "EL COPEY", "EL PASO", "GAMARRA",
    "GONZALEZ", "LA GLORIA", "LA JAGUA DE IBIRICO", "MANAURE BALCON DEL CESAR",
    "PAILITAS", "PELAYA", "PUEBLO BELLO", "RIO DE ORO", "SAN ALBERTO", "SAN DIEGO",
    "SAN MARTIN", "TAMALAMEQUE"
  ],
  "LA GUAJIRA": [
    "RIOHACHA", "ALBANIA", "BARRANCAS", "DIBULLA", "DISTRACCION", "EL MOLINO",
    "FONSECA", "HATONUEVO", "LA JAGUA DEL PILAR", "MAICAO", "MANAURE",
    "SAN JUAN DEL CESAR", "URIBIA", "URUMITA", "VILLANUEVA"
  ],
  CORDOBA: [
    "MONTERIA", "AYAPEL", "BUENAVISTA", "CANALETE", "CERETE", "CHIMA", "CHINU",
    "CIENAGA DE ORO", "COTORRA", "LA APARTADA", "LORICA", "LOS CORDOBAS", "MOMIL",
    "MONTELIBANO", "MOÑITOS", "PLANETA RICA", "PUEBLO NUEVO", "PUERTO ESCONDIDO",
    "PUERTO LIBERTADOR", "PURISIMA", "SAHAGUN", "SAN ANDRES DE SOTAVENTO",
    "SAN ANTERO", "SAN BERNARDO DEL VIENTO", "SAN CARLOS", "SAN JOSE DE URE",
    "SAN PELAYO", "TIERRALTA", "TUCHIN", "VALENCIA"
  ],
  SUCRE: [
    "SINCELEJO", "BUENAVISTA", "CAIMITO", "COLOSO", "COROZAL", "COVEÑAS",
    "EL ROBLE", "GALERAS", "GUARANDA", "LA UNION", "LOS PALMITOS", "MAJAGUAL",
    "MORROA", "OVEJAS", "PALMITO", "SAMPUES", "SAN BENITO ABAD",
    "SAN JUAN DE BETULIA", "SAN MARCOS", "SAN ONOFRE", "SAN PEDRO", "SINCERIN",
    "SUCRE", "TOLU", "TOLUVIEJO"
  ],
  "SAN ANDRES Y PROVIDENCIA": [
    "SAN ANDRES", "PROVIDENCIA Y SANTA CATALINA"
  ]
};

// Nombres descriptivos de etapas
const STEP_TITLES = [
  "Datos del Conductor",
  "Datos del Vehículo",
  "Documentos Obligatorios",
  "Fotografías del Vehículo"
];

// Nombres legibles de campos para la cámara
const FIELD_NAMES_MAP = {
  cedula_frente: "Cédula (Frente)",
  cedula_respaldo: "Cédula (Respaldo)",
  licencia_frente: "Licencia de Conducción (Frente)",
  licencia_respaldo: "Licencia de Conducción (Respaldo)",
  propiedad_frente: "Tarjeta de Propiedad (Frente)",
  propiedad_respaldo: "Tarjeta de Propiedad (Respaldo)",
  soat: "Póliza SOAT Vigente",
  tecno: "Certificado Tecnomecánica",
  moto_derecha: "Costado Derecho del Vehículo",
  moto_izquierda: "Costado Izquierdo del Vehículo",
  moto_frente: "Frente del Vehículo",
  moto_trasera: "Parte Trasera del Vehículo (Placa)"
};

// Requerimientos de archivos por paso
const STEP_REQUIRED_FILES = {
  3: ["cedula_frente", "cedula_respaldo", "licencia_frente", "licencia_respaldo", "propiedad_frente", "propiedad_respaldo", "soat", "tecno"],
  4: ["moto_derecha", "moto_izquierda", "moto_frente", "moto_trasera"]
};

// Estado Global de la App
let currentStep = 1;
const totalSteps = 4;
const fileStore = {};

// Estado de la Cámara WebRTC en Vivo
let currentCameraField = null;
let currentCameraStream = null;
let currentFacingMode = "environment"; // "environment" o "user"
let capturedLiveBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  initStepper();
  initDepartmentSelect();
  initOwnerToggle();
  initFileUploadPreviews();
  initFormSubmit();
});

// ==========================================
// Stepper & Navegación por Pasos
// ==========================================
function initStepper() {
  updateStepView();
}

function goToStep(step) {
  if (step === currentStep) return;
  if (step < currentStep) {
    currentStep = step;
    updateStepView();
  } else {
    // Validar pasos anteriores
    let canProceed = true;
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        canProceed = false;
        break;
      }
    }
    if (canProceed) {
      currentStep = step;
      updateStepView();
    }
  }
}

function updateStepView() {
  // Ocultar todas las tarjetas y mostrar la activa
  document.querySelectorAll(".form-card").forEach((card, index) => {
    card.classList.remove("active");
    if (index + 1 === currentStep) {
      card.classList.add("active");
    }
  });

  // Actualizar círculos del stepper
  document.querySelectorAll(".step-item").forEach((item, index) => {
    const stepNum = index + 1;
    item.classList.remove("active", "completed");
    if (stepNum === currentStep) {
      item.classList.add("active");
    } else if (stepNum < currentStep) {
      item.classList.add("completed");
    }
  });

  // Actualizar títulos e indicadores de porcentaje
  const nameEl = document.getElementById("stepCurrentName");
  const pctBadge = document.getElementById("stepPctBadge");
  const progressBar = document.getElementById("progressBar");

  if (nameEl && STEP_TITLES[currentStep - 1]) {
    nameEl.textContent = STEP_TITLES[currentStep - 1];
  }

  const percentage = Math.round((currentStep / totalSteps) * 100);
  if (pctBadge) {
    pctBadge.textContent = `Paso ${currentStep} de ${totalSteps} (${percentage}%)`;
  }

  if (progressBar) {
    const barProgress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${barProgress}%`;
  }

  // Desplazamiento suave hacia arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepView();
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
}

// ==========================================
// Validaciones por Paso
// ==========================================
function validateStep(step) {
  const activeCard = document.querySelector(`.form-card[data-step="${step}"]`);
  if (!activeCard) return true;

  let isValid = true;
  let firstInvalidInput = null;

  // Validación de inputs tradicionales en Paso 1 y 2
  if (step === 1 || step === 2) {
    const requiredInputs = activeCard.querySelectorAll("[required]");
    requiredInputs.forEach((input) => {
      let fieldValid = true;

      if (input.type === "radio") {
        const radioGroup = activeCard.querySelectorAll(`input[name="${input.name}"]`);
        fieldValid = Array.from(radioGroup).some((r) => r.checked);
      } else {
        fieldValid = Boolean(input.value && input.value.trim().length > 0);
      }

      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
        input.classList.add("input-error");
      } else {
        input.classList.remove("input-error");
      }
    });
  }

  // Validación de Archivos y Fotos en Paso 3 y 4
  if (step === 3 || step === 4) {
    const requiredList = STEP_REQUIRED_FILES[step] || [];
    requiredList.forEach((fieldKey) => {
      const card = document.querySelector(`.upload-card[data-field="${fieldKey}"]`);
      const hasData = Boolean(fileStore[fieldKey] && fileStore[fieldKey].base64);

      if (!hasData) {
        isValid = false;
        if (card) {
          card.classList.add("input-error");
          if (!firstInvalidInput) firstInvalidInput = card;
        }
      } else {
        if (card) card.classList.remove("input-error");
      }
    });

    // Validar checkbox de políticas en Paso 4
    if (step === 4) {
      const chk = document.getElementById("acepto_politica");
      if (chk && !chk.checked) {
        isValid = false;
        chk.focus();
        showAlert("Debe aceptar la Política y Aviso de Privacidad para enviar su registro.", "danger");
        return false;
      }
    }
  }

  if (!isValid) {
    showAlert("Por favor, complete todos los campos y adjunte todos los documentos y fotos obligatorias (*) antes de continuar.", "danger");
    if (firstInvalidInput) {
      if (typeof firstInvalidInput.scrollIntoView === "function") {
        firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (typeof firstInvalidInput.focus === "function") {
        firstInvalidInput.focus();
      }
    }
  } else {
    hideAlert();
  }

  return isValid;
}

function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("alertBox");
  if (alertBox) {
    alertBox.className = `alert-box alert-${type} active`;
    alertBox.innerHTML = `
      <span style="font-size: 1.25rem;">⚠️</span>
      <div>${message}</div>
    `;
  }
}

function hideAlert() {
  const alertBox = document.getElementById("alertBox");
  if (alertBox) alertBox.classList.remove("active");
}

// ==========================================
// Selección de Departamento y Municipio
// ==========================================
function initDepartmentSelect() {
  const deptSelect = document.getElementById("departamento");
  const muniSelect = document.getElementById("ciudad");

  if (deptSelect && muniSelect) {
    deptSelect.addEventListener("change", (e) => {
      const deptValue = e.target.value;
      muniSelect.innerHTML = `<option value="" disabled selected>Seleccione Municipio...</option>`;

      if (MUNICIPIOS_ZONA_CARIBE[deptValue]) {
        MUNICIPIOS_ZONA_CARIBE[deptValue].forEach((muni) => {
          const opt = document.createElement("option");
          opt.value = muni;
          opt.textContent = muni;
          muniSelect.appendChild(opt);
        });
        muniSelect.disabled = false;
      } else {
        muniSelect.disabled = true;
      }
    });
  }
}

// ==========================================
// Conmutador de Propietario (SÍ / NO)
// ==========================================
function initOwnerToggle() {
  const propSi = document.getElementById("prop_si");
  const propNo = document.getElementById("prop_no");
  const conditionalBox = document.getElementById("boxNoPropietario");

  function toggleOwner(isOwner) {
    const inputs = ["nombre_propietario", "doc_propietario", "tel_propietario"];
    if (!isOwner) {
      if (conditionalBox) conditionalBox.classList.add("active");
      inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.required = true;
      });
    } else {
      if (conditionalBox) conditionalBox.classList.remove("active");
      inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.required = false;
          el.value = "";
        }
      });
    }
  }

  if (propSi && propNo) {
    propSi.addEventListener("change", () => toggleOwner(true));
    propNo.addEventListener("change", () => toggleOwner(false));
  }
}

// ==========================================
// Carga y Selección de Archivos (Cámara vs Archivo)
// ==========================================

// Disparador principal de Cámara o Archivo
window.triggerUpload = function(fieldKey, source) {
  if (source === "cam") {
    // Si el navegador soporta WebRTC getUserMedia (PC Webcam o Móvil en Vivo)
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      openLiveCamera(fieldKey);
    } else {
      // Fallback a input estándar con capture
      const camInput = document.getElementById(`${fieldKey}_cam`);
      if (camInput) camInput.click();
    }
  } else {
    // Subir Archivo tradicional
    const fileInput = document.getElementById(`${fieldKey}_file`);
    if (fileInput) fileInput.click();
  }
};

// Cambiar archivo existente
window.rechooseFile = function(fieldKey) {
  const card = document.querySelector(`.upload-card[data-field="${fieldKey}"]`);
  if (card) {
    card.classList.remove("has-file");
    const badge = card.querySelector(".status-badge");
    if (badge) badge.textContent = "Pendiente";
  }
};

// Quitar archivo existente
window.removeFile = function(fieldKey) {
  delete fileStore[fieldKey];
  const camInput = document.getElementById(`${fieldKey}_cam`);
  const fileInput = document.getElementById(`${fieldKey}_file`);
  if (camInput) camInput.value = "";
  if (fileInput) fileInput.value = "";

  const card = document.querySelector(`.upload-card[data-field="${fieldKey}"]`);
  if (card) {
    card.classList.remove("has-file");
    const badge = card.querySelector(".status-badge");
    if (badge) badge.textContent = "Pendiente";
    const previewThumb = card.querySelector(".preview-thumb");
    if (previewThumb) previewThumb.src = "";
    const previewPdf = card.querySelector(".preview-pdf-info");
    if (previewPdf) previewPdf.style.display = "none";
  }
};

function initFileUploadPreviews() {
  const hiddenInputs = document.querySelectorAll(".file-hidden-input");

  hiddenInputs.forEach((input) => {
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      const fieldKey = input.id.replace("_cam", "").replace("_file", "");
      const card = document.querySelector(`.upload-card[data-field="${fieldKey}"]`);

      if (file && card) {
        card.classList.add("has-file");
        card.classList.remove("input-error");
        
        const badge = card.querySelector(".status-badge");
        const previewThumb = card.querySelector(".preview-thumb");
        const previewPdf = card.querySelector(".preview-pdf-info");
        const pdfFilename = card.querySelector(".pdf-filename");

        if (file.type.startsWith("image/")) {
          if (previewThumb) {
            previewThumb.style.display = "block";
            const reader = new FileReader();
            reader.onload = (evt) => {
              previewThumb.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
          if (previewPdf) previewPdf.style.display = "none";
          if (badge) badge.textContent = "✓ Foto lista";
        } else if (file.type === "application/pdf") {
          if (previewThumb) previewThumb.style.display = "none";
          if (previewPdf) {
            previewPdf.style.display = "flex";
            if (pdfFilename) {
              pdfFilename.textContent = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name;
            }
          }
          if (badge) badge.textContent = "✓ PDF listo";
        }

        // Comprimir y convertir a Base64
        fileStore[fieldKey] = await processFileToBase64(file);
      }
    });
  });
}

// ==========================================
// Módulo de Cámara WebRTC en Vivo (PC y Móvil)
// ==========================================
async function openLiveCamera(fieldKey) {
  currentCameraField = fieldKey;
  const modal = document.getElementById("cameraModal");
  const titleEl = document.getElementById("cameraModalFieldTitle");
  const videoEl = document.getElementById("cameraVideo");
  const capturedImg = document.getElementById("cameraCapturedImg");
  const liveControls = document.getElementById("cameraLiveControls");
  const reviewControls = document.getElementById("cameraReviewControls");
  const guideOverlay = document.getElementById("cameraGuideOverlay");

  if (titleEl) {
    titleEl.textContent = FIELD_NAMES_MAP[fieldKey] ? `Cámara: ${FIELD_NAMES_MAP[fieldKey]}` : "Cámara en Vivo";
  }

  // Resetear estados visuales
  if (videoEl) videoEl.style.display = "block";
  if (capturedImg) { capturedImg.style.display = "none"; capturedImg.src = ""; }
  if (guideOverlay) guideOverlay.style.display = "flex";
  if (liveControls) liveControls.style.display = "flex";
  if (reviewControls) reviewControls.style.display = "none";

  if (modal) modal.classList.add("active");

  await startCameraStream();
}

async function startCameraStream() {
  if (currentCameraStream) {
    currentCameraStream.getTracks().forEach((t) => t.stop());
    currentCameraStream = null;
  }

  const videoEl = document.getElementById("cameraVideo");
  try {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    currentCameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoEl) {
      videoEl.srcObject = currentCameraStream;
      videoEl.play();
    }
  } catch (err) {
    console.warn("No se pudo iniciar el stream con facingMode:", currentFacingMode, err);
    // Intento secundario con cualquier cámara disponible
    try {
      currentCameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoEl) {
        videoEl.srcObject = currentCameraStream;
        videoEl.play();
      }
    } catch (fallbackErr) {
      closeLiveCamera();
      showAlert("No se pudo acceder a la cámara web. Por favor permita el acceso a la cámara en el navegador o use el botón 'Subir Archivo'.", "danger");
      // Fallback al explorador/selector
      const camInput = document.getElementById(`${currentCameraField}_cam`);
      if (camInput) camInput.click();
    }
  }
}

window.switchLiveCamera = async function() {
  currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
  await startCameraStream();
};

window.takeLiveSnapshot = function() {
  const videoEl = document.getElementById("cameraVideo");
  const canvas = document.getElementById("cameraCanvas");
  const capturedImg = document.getElementById("cameraCapturedImg");
  const liveControls = document.getElementById("cameraLiveControls");
  const reviewControls = document.getElementById("cameraReviewControls");
  const guideOverlay = document.getElementById("cameraGuideOverlay");

  if (!videoEl || !canvas) return;

  const vWidth = videoEl.videoWidth || 640;
  const vHeight = videoEl.videoHeight || 480;

  canvas.width = vWidth;
  canvas.height = vHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, vWidth, vHeight);

  capturedLiveBase64 = canvas.toDataURL("image/jpeg", 0.75);

  if (capturedImg) {
    capturedImg.src = capturedLiveBase64;
    capturedImg.style.display = "block";
  }
  if (videoEl) videoEl.style.display = "none";
  if (guideOverlay) guideOverlay.style.display = "none";
  if (liveControls) liveControls.style.display = "none";
  if (reviewControls) reviewControls.style.display = "flex";
};

window.retakeLiveSnapshot = function() {
  const videoEl = document.getElementById("cameraVideo");
  const capturedImg = document.getElementById("cameraCapturedImg");
  const liveControls = document.getElementById("cameraLiveControls");
  const reviewControls = document.getElementById("cameraReviewControls");
  const guideOverlay = document.getElementById("cameraGuideOverlay");

  capturedLiveBase64 = null;
  if (capturedImg) { capturedImg.style.display = "none"; capturedImg.src = ""; }
  if (videoEl) videoEl.style.display = "block";
  if (guideOverlay) guideOverlay.style.display = "flex";
  if (liveControls) liveControls.style.display = "flex";
  if (reviewControls) reviewControls.style.display = "none";
};

window.confirmLiveSnapshot = function() {
  if (!capturedLiveBase64 || !currentCameraField) {
    closeLiveCamera();
    return;
  }

  // Guardar en fileStore
  const base64Clean = capturedLiveBase64.split(",")[1];
  fileStore[currentCameraField] = {
    base64: base64Clean,
    mimeType: "image/jpeg"
  };

  // Actualizar tarjeta UI
  const card = document.querySelector(`.upload-card[data-field="${currentCameraField}"]`);
  if (card) {
    card.classList.add("has-file");
    card.classList.remove("input-error");

    const badge = card.querySelector(".status-badge");
    const previewThumb = card.querySelector(".preview-thumb");
    const previewPdf = card.querySelector(".preview-pdf-info");

    if (previewThumb) {
      previewThumb.src = capturedLiveBase64;
      previewThumb.style.display = "block";
    }
    if (previewPdf) previewPdf.style.display = "none";
    if (badge) badge.textContent = "✓ Foto lista";
  }

  closeLiveCamera();
};

window.closeLiveCamera = function() {
  if (currentCameraStream) {
    currentCameraStream.getTracks().forEach((track) => track.stop());
    currentCameraStream = null;
  }

  const modal = document.getElementById("cameraModal");
  if (modal) modal.classList.remove("active");

  const videoEl = document.getElementById("cameraVideo");
  if (videoEl) videoEl.srcObject = null;

  capturedLiveBase64 = null;
  currentCameraField = null;
};

// Compresión y conversión de imagen/PDF a Base64
async function processFileToBase64(file) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: reader.result.split(",")[1], mimeType: file.type });
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 1200;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
        resolve({ base64: dataUrl.split(",")[1], mimeType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==========================================
// Envío del Formulario al Backend GAS
// ==========================================
function initFormSubmit() {
  const form = document.getElementById("formVial");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateStep(currentStep)) return;

      const loadingOverlay = document.getElementById("loadingOverlay");
      if (loadingOverlay) loadingOverlay.classList.add("active");

      // Progreso simulado para feedback visual premium
      const lStep2 = document.getElementById("lStep2");
      const lStep3 = document.getElementById("lStep3");
      const lStep4 = document.getElementById("lStep4");

      setTimeout(() => {
        if (lStep2) { lStep2.className = "loading-step-item done"; lStep2.textContent = "✓ Fotografías y documentos optimizados"; }
        if (lStep3) { lStep3.className = "loading-step-item active"; }
      }, 1000);

      try {
        const esPropietarioVal = document.getElementById("prop_si").checked ? "SI" : "NO";

        const payload = {
          nombre: document.getElementById("nombre").value.trim().toUpperCase(),
          documento: document.getElementById("documento").value.trim(),
          departamento: document.getElementById("departamento").value,
          ciudad: document.getElementById("ciudad").value,
          placa: document.getElementById("placa").value.trim().toUpperCase(),
          es_propietario: esPropietarioVal,
          nombre_propietario: document.getElementById("nombre_propietario").value.trim().toUpperCase(),
          doc_propietario: document.getElementById("doc_propietario").value.trim(),
          tel_propietario: document.getElementById("tel_propietario").value.trim(),
          acepto_politica: document.getElementById("acepto_politica").checked,

          cedula_frente: fileStore["cedula_frente"] || null,
          cedula_respaldo: fileStore["cedula_respaldo"] || null,
          licencia_frente: fileStore["licencia_frente"] || null,
          licencia_respaldo: fileStore["licencia_respaldo"] || null,
          propiedad_frente: fileStore["propiedad_frente"] || null,
          propiedad_respaldo: fileStore["propiedad_respaldo"] || null,
          soat: fileStore["soat"] || null,
          tecno: fileStore["tecno"] || null,

          moto_derecha: fileStore["moto_derecha"] || null,
          moto_izquierda: fileStore["moto_izquierda"] || null,
          moto_frente: fileStore["moto_frente"] || null,
          moto_trasera: fileStore["moto_trasera"] || null
        };

        const showSuccessModal = (msg) => {
          if (loadingOverlay) loadingOverlay.classList.remove("active");
          const modal = document.getElementById("successModal");
          const msgEl = document.getElementById("successModalMsg");
          if (msg && msgEl) {
            msgEl.textContent = msg;
          }
          if (modal) modal.classList.add("active");
        };

        // Si corre dentro del entorno de Google Apps Script
        if (typeof google !== "undefined" && google.script && google.script.run) {
          google.script.run
            .withSuccessHandler((res) => {
              if (lStep3) { lStep3.className = "loading-step-item done"; lStep3.textContent = "✓ Archivos almacenados en Google Drive"; }
              if (lStep4) { lStep4.className = "loading-step-item done"; lStep4.textContent = "✓ Datos asentados en Google Sheets"; }
              showSuccessModal(res?.mensaje || `Registro vial exitoso para ${payload.nombre} (${payload.placa}).`);
            })
            .withFailureHandler((err) => {
              if (loadingOverlay) loadingOverlay.classList.remove("active");
              showAlert("Error procesando el registro: " + err.message, "danger");
            })
            .procesarFormulario(payload);
        } else {
          // Si corre en un servidor web externo o localhost usando fetch
          await fetch(BACKEND_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (lStep3) { lStep3.className = "loading-step-item done"; lStep3.textContent = "✓ Archivos almacenados en Google Drive"; }
          if (lStep4) { lStep4.className = "loading-step-item done"; lStep4.textContent = "✓ Registro completado"; }
          
          showSuccessModal(`Registro vial transmitido correctamente para ${payload.nombre} con placa ${payload.placa}.`);
        }
      } catch (error) {
        if (loadingOverlay) loadingOverlay.classList.remove("active");
        showAlert("Ocurrió un error inesperado al enviar: " + error.message, "danger");
      }
    });
  }
}
