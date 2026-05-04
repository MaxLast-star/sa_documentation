import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Требования',
    icon: '📋',
    description: 'Функциональные и нефункциональные требования к системе. Use Cases для ключевых сценариев работы.',
    link: '/docs/requirements/functional',
    linkLabel: 'Открыть раздел',
  },
  {
    title: 'Архитектура',
    icon: '🏗️',
    description: 'BPMN-диаграмма процессов, технологии хранения данных, асинхронные взаимодействия (RabbitMQ, gRPC).',
    link: '/docs/architecture/process',
    linkLabel: 'Открыть раздел',
  },
  {
    title: 'API Reference',
    icon: '⚡',
    description: 'Интерактивная документация REST API в формате Redoc. Эндпоинты, схемы запросов и ответов.',
    link: '/api/ui',
    linkLabel: 'Открыть раздел',
  },
  {
    title: 'База данных',
    icon: '🗄️',
    description: 'Концептуальная, логическая и физическая модели данных. ERD-диаграммы и описание сущностей.',
    link: '/docs/database/data-model',
    linkLabel: 'Открыть раздел',
  },
  {
    title: 'Стейкхолдеры',
    icon: '👥',
    description: 'Классификация стейкхолдеров по матрице RACI. Вопросы для интервью по каждой группе.',
    link: '/docs/scenarios/stakeholders',
    linkLabel: 'Открыть раздел',
  },
  {
    title: 'Стратегия',
    icon: '🚀',
    description: 'Стратегия платформизации, целевые сегменты, модель монетизации и дорожная карта версий.',
    link: '/docs/scenarios/platform-strategy',
    linkLabel: 'Открыть раздел',
  },
];

function Feature({icon, title, description, link, linkLabel}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card', styles.featureCard)}>
        <div className="card__header">
          <div className={styles.featureIcon}>{icon}</div>
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--sm" to={link}>
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
