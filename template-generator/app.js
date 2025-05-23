// --- Translations ---
const translations = {
  es: {
    appTitle: 'Odoo EasyPanel Temple App',
    languageLabel: 'Idioma:',
    darkModeLabel: 'Modo Oscuro', // Visually hidden, but good for accessibility
    generatedConfigTitle: 'Configuración Generada',
    copyJsonButton: 'Copiar JSON',
    jsonOutputPlaceholder: 'Tu JSON aparecerá aquí...',
    deploymentSettingsTitle: 'Ajustes de Despliegue',
    coreServicesTitle: 'Servicios Principales',
    odooServiceNameLabel: 'Nombre del Servicio Odoo *',
    odooVersionLabel: 'Versión de Odoo *',
    dbServiceNameLabel: 'Nombre del Servicio de BD *',
    postgresVersionLabel: 'Versión de Postgres *',
    dbCredentialsTitle: 'Credenciales de Base de Datos',
    customizeDbVarsLabel: 'Personalizar Variables de BD de Odoo',
    odooDbPortLabel: 'ODOO_DB_PORT',
    odooDbUserLabel: 'ODOO_DB_USER',
    odooDbPasswordLabel: 'ODOO_DB_PASSWORD',
    generatePasswordPlaceholder: 'Clic 🔑 para generar',
    addonsConfigTitle: 'Configuración de Addons',
    addonsPathsLabel: 'Selección de Rutas de Addons',
    addonsMountModeLabel: 'Modo de Montaje de Addons',
    productionButton: 'Producción',
    developmentButton: 'Desarrollo',
    odooInternalsTitle: 'Internos de Odoo y Red',
    odooDataDirLabel: 'ODOO_DATA_DIR (Montar)',
    mountDataDirCheckbox: 'Montar /var/lib/odoo',
    xmlrpcPortLabel: 'Puerto XML-RPC',
    longpollingPortLabel: 'Puerto Longpolling',
    odooDomainLabel: 'Dominio Odoo',
    logLevelLabel: 'Nivel de Log',
    proxyModeLabel: 'Modo Proxy',
    generateConfigButton: 'Generar Configuración',
    copiedFeedback: '¡Copiado!',
    nothingToCopyAlert:
      'Nada que copiar. Por favor, genera una configuración primero.',
    errorCopyingAlert: 'Error al copiar JSON. Ver consola para detalles.',
    jsonOutputPlaceholderGenerated: 'Tu JSON aparecerá aquí...',
  },
  en: {
    appTitle: 'Odoo EasyPanel Temple App',
    languageLabel: 'Language:',
    darkModeLabel: 'Dark Mode', // Visually hidden
    generatedConfigTitle: 'Generated Configuration',
    copyJsonButton: 'Copy JSON',
    jsonOutputPlaceholder: 'Your JSON will appear here...',
    deploymentSettingsTitle: 'Deployment Settings',
    coreServicesTitle: 'Core Services',
    odooServiceNameLabel: 'Odoo Service Name *',
    odooVersionLabel: 'Odoo Version *',
    dbServiceNameLabel: 'Database Service Name *',
    postgresVersionLabel: 'Postgres Version *',
    dbCredentialsTitle: 'Database Credentials',
    customizeDbVarsLabel: 'Customize Odoo DB Variables',
    odooDbPortLabel: 'ODOO_DB_PORT',
    odooDbUserLabel: 'ODOO_DB_USER',
    odooDbPasswordLabel: 'ODOO_DB_PASSWORD',
    generatePasswordPlaceholder: 'Click 🔑 to generate',
    addonsConfigTitle: 'Addons Configuration',
    addonsPathsLabel: 'Addons Paths Selection',
    addonsMountModeLabel: 'Addons Mount Mode',
    productionButton: 'Production',
    developmentButton: 'Development',
    odooInternalsTitle: 'Odoo Internals & Networking',
    odooDataDirLabel: 'ODOO_DATA_DIR (Mount)',
    mountDataDirCheckbox: 'Mount /var/lib/odoo',
    xmlrpcPortLabel: 'XML-RPC Port',
    longpollingPortLabel: 'Longpolling Port',
    odooDomainLabel: 'Odoo Domain',
    logLevelLabel: 'Log Level',
    proxyModeLabel: 'Proxy Mode',
    generateConfigButton: 'Generate Configuration',
    copiedFeedback: 'Copied!',
    nothingToCopyAlert:
      'Nothing to copy. Please generate a configuration first.',
    errorCopyingAlert: 'Error copying JSON. See console for details.',
    jsonOutputPlaceholderGenerated: 'Your JSON will appear here...',
  },
};

let currentLanguage = localStorage.getItem('language') || 'es';

function applyDarkMode(isDark, toggleState = true) {
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const darkModeToggleInput = document.getElementById('darkModeToggle');

  if (isDark) {
    // Dark Mode IS ACTIVE
    document.body.classList.add('dark-mode');
    if (toggleState && darkModeToggleInput) darkModeToggleInput.checked = true;
  } else {
    // Light Mode IS ACTIVE
    document.body.classList.remove('dark-mode');
    if (toggleState && darkModeToggleInput) darkModeToggleInput.checked = false;
  }
  // Icon states are handled by CSS :not(.dark-mode) and .dark-mode selectors
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-translate-key]').forEach((element) => {
    const key = element.getAttribute('data-translate-key');
    const translation = translations[lang][key];
    if (translation !== undefined) {
      if (
        element.tagName === 'INPUT' &&
        element.type === 'text' &&
        key.includes('Placeholder')
      ) {
        element.placeholder = translation;
      } else if (
        element.id === 'jsonOutput' &&
        element.textContent.trim() ===
          (translations[lang === 'es' ? 'en' : 'es']['jsonOutputPlaceholder'] ||
            translations[lang === 'es' ? 'en' : 'es'][
              'jsonOutputPlaceholderGenerated'
            ])
      ) {
        element.textContent = translation;
      } else if (element.id !== 'jsonOutput') {
        const icon = element.querySelector('i.bi');
        // Check if the element is the visually hidden label for dark mode toggle
        if (
          element.classList.contains('visually-hidden') &&
          element.htmlFor === 'darkModeToggle'
        ) {
          element.textContent = translation; // Update text for screen readers
        } else if (icon) {
          element.innerHTML = '';
          element.appendChild(icon.cloneNode(true));
          element.append(' ' + translation);
        } else {
          element.textContent = translation;
        }
      }
    }
  });
}

const initialTemplate = {
  services: [
    {
      type: 'app',
      data: {
        serviceName: 'odoo-db',
        source: { type: 'image', image: 'postgres:16' },
        env:
          'POSTGRES_DB=postgres\n' +
          'POSTGRES_PASSWORD=randomly_generated\n' +
          'POSTGRES_USER=odoo\n' +
          'PGDATA=/var/lib/postgresql/data/pgdata',
        mounts: [
          {
            type: 'volume',
            name: 'odoo-db-data',
            mountPath: '/var/lib/postgresql/data/pgdata',
          },
        ],
      },
    },
    {
      type: 'app',
      data: {
        serviceName: 'odoo',
        source: {
          type: 'github',
          owner: 'dancoLgh',
          repo: 'easypanel-template-odoo',
          ref: '17.0',
          path: '/',
          autoDeploy: false,
        },
        build: { type: 'dockerfile', file: 'Dockerfile' },
        env: '',
        domains: [],
        mounts: [
          {
            type: 'volume',
            name: 'odoo-config',
            mountPath: '/etc/odoo',
          },
        ],
      },
    },
  ],
};

function randomPassword(bytes = 12) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const appServiceNameInput = document.getElementById('appServiceName');
  const odooVersionInput = document.getElementById('odooVersion');
  const dbServiceNameInput = document.getElementById('dbServiceName');
  const postgresVersionInput = document.getElementById('postgresVersion');

  const useCustomDbEnvChk = document.getElementById('useCustomDbEnv');
  const dbEnvFieldsDiv = document.getElementById('dbEnvFields');
  const odooDbPortInput = document.getElementById('odooDbPort');
  const odooDbUserInput = document.getElementById('odooDbUser');
  const odooDbPasswordInput = document.getElementById('odooDbPassword');
  const genDbPwdBtn = document.getElementById('genDbPwdBtn');

  const addonChecks = document.querySelectorAll('input[name="addonPath"]');

  const mountDataDirChk = document.getElementById('mountDataDir');
  const xmlrpcPortInput = document.getElementById('xmlrpcPort');
  const longpollingPortInput = document.getElementById('longpollingPort');
  const proxyModeChk = document.getElementById('proxyMode');
  const logLevelSelect = document.getElementById('logLevel');
  const odooDomainInput = document.getElementById('odooDomain');

  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const jsonOutputEl = document.getElementById('jsonOutput');
  const darkModeToggleInput = document.getElementById('darkModeToggle');
  const languageSelect = document.getElementById('languageSelect');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  languageSelect.value = currentLanguage;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyDarkMode(savedTheme === 'dark');
  } else {
    applyDarkMode(true); // Default to dark mode
  }
  setLanguage(currentLanguage);

  languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });

  darkModeToggleInput.addEventListener('change', (event) => {
    applyDarkMode(event.target.checked);
    localStorage.setItem('theme', event.target.checked ? 'dark' : 'light');
  });
  sunIcon.addEventListener('click', () => {
    applyDarkMode(false); // Activate light mode
    localStorage.setItem('theme', 'light');
  });
  moonIcon.addEventListener('click', () => {
    applyDarkMode(true); // Activate dark mode
    localStorage.setItem('theme', 'dark');
  });

  genDbPwdBtn.addEventListener('click', () => {
    odooDbPasswordInput.value = randomPassword();
  });

  useCustomDbEnvChk.addEventListener('change', () => {
    dbEnvFieldsDiv.style.display = useCustomDbEnvChk.checked ? 'block' : 'none';
  });
  dbEnvFieldsDiv.style.display = useCustomDbEnvChk.checked ? 'block' : 'none';

  generateBtn.addEventListener('click', () => {
    let currentTemplate = JSON.parse(JSON.stringify(initialTemplate));

    const appName = appServiceNameInput.value.trim() || 'my-odoo-app';
    const odooVersion = odooVersionInput.value.trim() || '17.0';
    const dbName = dbServiceNameInput.value.trim() || 'odoo-db';
    const pgVersion = postgresVersionInput.value.trim() || '16';

    let finalDbPassword = odooDbPasswordInput.value.trim();
    if (!finalDbPassword && useCustomDbEnvChk.checked) {
      finalDbPassword = randomPassword();
      odooDbPasswordInput.value = finalDbPassword;
    } else if (!finalDbPassword) {
      finalDbPassword = randomPassword();
    }

    const dbService = currentTemplate.services[0].data;
    dbService.serviceName = dbName;
    dbService.source.image = `postgres:${pgVersion}`;
    dbService.env = [
      'POSTGRES_DB=postgres',
      `POSTGRES_PASSWORD=${finalDbPassword}`,
      `POSTGRES_USER=${
        useCustomDbEnvChk.checked ? odooDbUserInput.value.trim() : 'odoo'
      }`,
      'PGDATA=/var/lib/postgresql/data/pgdata',
    ].join('\n');
    dbService.mounts[0].name = `${dbName}-pgdata`;

    const odooAppService = currentTemplate.services[1].data;
    odooAppService.serviceName = appName;
    odooAppService.source.ref = odooVersion;

    const odooAppEnvVars = [
      `HOST=$(PROJECT_NAME)_${dbName}`,
      `USER=${
        useCustomDbEnvChk.checked ? odooDbUserInput.value.trim() : 'odoo'
      }`,
      `PASSWORD=${finalDbPassword}`,
      `PORT=${
        useCustomDbEnvChk.checked ? odooDbPortInput.value.trim() : '5432'
      }`,
    ];

    const selectedAddonsPaths = Array.from(addonChecks)
      .filter((ch) => ch.checked)
      .map((ch) => ch.value)
      .join(',');
    if (selectedAddonsPaths) {
      odooAppEnvVars.push(`ODOO_ADDONS_PATH=${selectedAddonsPaths}`);
    }

    const dataDirValue = mountDataDirChk.value;
    if (mountDataDirChk.checked && dataDirValue) {
      odooAppEnvVars.push(`ODOO_DATA_DIR=${dataDirValue}`);
    }
    odooAppEnvVars.push(`ODOO_XMLRPC_PORT=${xmlrpcPortInput.value.trim()}`);
    odooAppEnvVars.push(
      `ODOO_LONGPOLLING_PORT=${longpollingPortInput.value.trim()}`
    );
    if (proxyModeChk.checked) {
      odooAppEnvVars.push('ODOO_PROXY=True');
    }
    odooAppEnvVars.push(`ODOO_LOG_LEVEL=${logLevelSelect.value}`);
    odooAppService.env = odooAppEnvVars.join('\n');

    odooAppService.mounts = [
      {
        type: 'volume',
        name: `${appName}-odoo-config`,
        mountPath: '/etc/odoo',
      },
    ];

    if (mountDataDirChk.checked && dataDirValue) {
      odooAppService.mounts.unshift({
        type: 'volume',
        name: `${appName}-odoo-data`,
        mountPath: dataDirValue,
      });
    }

    const addonsMode = document.querySelector(
      'input[name="addonsMode"]:checked'
    ).value;
    const addonsInternalMountPath = '/mnt/extra-addons';

    if (selectedAddonsPaths) {
      let hostPathForAddons;
      if (addonsMode === 'produccion') {
        hostPathForAddons = '/etc/easypanel/addons/shared-odoo-addons/';
      } else {
        hostPathForAddons = `/etc/easypanel/addons/odoo-addons-dev/`;
      }
      odooAppService.mounts.push({
        type: 'bind',
        hostPath: hostPathForAddons,
        mountPath: addonsInternalMountPath,
      });
    }

    const odooDomainValue = odooDomainInput.value.trim();
    odooAppService.domains = [];
    if (odooDomainValue) {
      odooAppService.domains.push({
        host: `${odooDomainValue}`,
        https: true,
        port: parseInt(xmlrpcPortInput.value.trim()),
        path: '/',
        middlewares: [],
        certificateResolver: '',
        wildcard: false,
        internalProtocol: 'http',
      });
      odooAppService.domains.push({
        host: `${odooDomainValue}`,
        https: true,
        port: parseInt(longpollingPortInput.value.trim()),
        path: '/longpolling',
        middlewares: [],
        certificateResolver: '',
        wildcard: false,
        internalProtocol: 'http',
      });
    }

    window.template = currentTemplate;
    jsonOutputEl.textContent = JSON.stringify(currentTemplate, null, 2);
    jsonOutputEl.setAttribute(
      'data-translate-key',
      'jsonOutputPlaceholderGenerated'
    );
  });

  copyBtn.addEventListener('click', () => {
    const jsonText = jsonOutputEl.textContent;
    if (
      jsonText &&
      jsonText !== translations[currentLanguage]['jsonOutputPlaceholder'] &&
      jsonText !==
        translations[currentLanguage]['jsonOutputPlaceholderGenerated']
    ) {
      navigator.clipboard
        .writeText(jsonText)
        .then(() => {
          const originalTextContent = copyBtn.innerHTML;
          const originalClasses = copyBtn.className;

          const icon = copyBtn.querySelector('i.bi').cloneNode(true);
          copyBtn.innerHTML = '';
          copyBtn.appendChild(icon);
          copyBtn.append(' ' + translations[currentLanguage]['copiedFeedback']);

          copyBtn.classList.remove('btn-outline-secondary');
          copyBtn.classList.add('btn-success');
          setTimeout(() => {
            copyBtn.innerHTML = originalTextContent;
            copyBtn.className = originalClasses;
          }, 2000);
        })
        .catch((err) => {
          console.error('Error copying JSON: ', err);
          alert(translations[currentLanguage]['errorCopyingAlert']);
        });
    } else {
      alert(translations[currentLanguage]['nothingToCopyAlert']);
    }
  });
});
