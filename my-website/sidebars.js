/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Требования',
      items: [
        'requirements/functional',
        'requirements/non-functional',
      ],
    },
    {
      type: 'category',
      label: 'Архитектура',
      items: [
        'architecture/process',
        'architecture/storage',
        'architecture/async',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/ui-api',
      ],
    },
    {
      type: 'category',
      label: 'База данных',
      items: [
        'database/data-model',
      ],
    },
    {
      type: 'category',
      label: 'Сценарии',
      items: [
        'scenarios/stakeholders',
        'scenarios/platform-strategy',
      ],
    },
  ],
};

export default sidebars;
