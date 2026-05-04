// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import remarkSimplePlantUML from '@akebifiky/remark-simple-plantuml';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SA Documentation',
  tagline: 'Техническая документация',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://MaxLast-star.github.io',
  baseUrl: '/sa_documentation/',
  organizationName: 'MaxLast-star',
  projectName: 'sa_documentation',
  onBrokenLinks: 'warn',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [
            [remarkSimplePlantUML, { baseUrl: 'https://www.plantuml.com/plantuml/svg' }],
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'ui-api',
            spec: 'https://MaxLast-star.github.io/sa_documentation/media-and-data/api-ui.yml',
            route: '/api/ui',
          },
        ],
        theme: {
          primaryColor: '#1890ff',
        },
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-drawio',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'SA Documentation',
        logo: {
          alt: 'SA Documentation Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
          },
          {
            to: '/api/ui',
            label: 'API Reference',
            position: 'left',
          },
          {
            href: 'https://github.com/MaxLast-star/sa_documentation',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} SA Documentation. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
