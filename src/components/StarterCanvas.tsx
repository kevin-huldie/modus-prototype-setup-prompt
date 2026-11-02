import {
  ModusWcAlert,
  ModusWcCard,
  ModusWcIcon,
  ModusWcLink,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

type StarterCanvasProps = {
  productName: string;
};

const EXPLORE_RESOURCES = [
  {
    title: 'Component library',
    description:
      'Browse buttons, inputs, dialogs, and other UI building blocks.',
    href: 'https://modus.trimble.com/components',
  },
  {
    title: 'Modus templates',
    description:
      'See common page layouts and patterns you can adapt for your idea.',
    href: 'https://modus.trimble.com/templates',
  },
  {
    title: 'Icon ecosystem',
    description:
      'Find official Trimble icons for labels, actions, and wayfinding.',
    href: 'https://modus.trimble.com/foundations/icons/',
  },
] as const;

const GETTING_STARTED_ITEMS = [
  'App shell and navigation',
  'Modus components in this project',
  'Light and dark modes',
] as const;

export function StarterCanvas({ productName }: StarterCanvasProps) {
  return (
    <div className="starter-canvas">
      <div className="shell-setup-alert">
        <ModusWcAlert
          variant="success"
          dismissible={false}
          customClass="w-full"
          alertTitle="Prototype setup complete"
          alertDescription="Your Modus shell is configured. Browse the resources below, then replace this canvas with your first screen."
        />
      </div>

      <header className="starter-page-header">
        <ModusWcTypography
          hierarchy="h1"
          label="Modus prototype template"
          size="3xl"
          weight="bold"
        />
        <p className="starter-subtitle low-contrast">{productName}</p>
      </header>

      <ModusWcCard bordered padding="compact" customClass="canvas-section">
        <ModusWcTypography
          slot="title"
          hierarchy="h4"
          size="md"
          weight="semibold"
          label="Explore Modus"
        />
        <p className="explore-intro">
          Use these links while you build and iterate in this project.
        </p>
        <div className="resource-grid">
          {EXPLORE_RESOURCES.map((resource) => (
            <ModusWcCard
              key={resource.href}
              bordered={false}
              padding="compact"
              customClass="resource-card"
            >
              <ModusWcTypography
                slot="title"
                hierarchy="h4"
                size="md"
                weight="semibold"
                label={resource.title}
              />
              <ModusWcTypography hierarchy="p" size="sm" label={resource.description} />
              <div className="resource-link-row">
                <ModusWcLink
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="always"
                  customClass="inline-link"
                >
                  Learn more
                  <ModusWcIcon name="launch" size="xs" decorative />
                </ModusWcLink>
              </div>
            </ModusWcCard>
          ))}
        </div>
      </ModusWcCard>

      <ModusWcCard bordered padding="compact" customClass="canvas-section">
        <ModusWcTypography
          slot="title"
          hierarchy="h4"
          size="md"
          weight="semibold"
          label="Happy prototyping 🎉"
        />
        <p className="getting-started-intro">
          You&apos;re ready to start prototyping with Modus components.
        </p>
        <ul className="getting-started-list">
          {GETTING_STARTED_ITEMS.map((item) => (
            <li key={item} className="getting-started-item">
              <ModusWcIcon name="check_circle" size="sm" decorative />
              <ModusWcTypography hierarchy="p" size="sm" label={item} />
            </li>
          ))}
        </ul>
      </ModusWcCard>

      <footer className="starter-footer">
        <ModusWcTypography
          size="sm"
          hierarchy="p"
          label="Created by Ryan Hicks."
          customClass="starter-footer-link"
        />
        <ModusWcLink
          href="mailto:ryan_hicks@trimble.com"
          underline="always"
          customClass="starter-footer-link inline-link starter-footer-link-text"
        >
          Have feedback?
        </ModusWcLink>
      </footer>
    </div>
  );
}
