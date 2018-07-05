import { h, Component } from 'preact';
import { IconComponent } from './icon';

interface SiteFooterContactLinkProps {
  href: string;
  icon: 'twitter' | 'linkedin' | 'github';
}

interface SiteFooterProps {
  className?: string;
}

const footerLinks: SiteFooterContactLinkProps[] = [
  {
    href: 'https://github.com/mattdistefano',
    icon: 'github'
  },
  {
    href: 'https://twitter.com/mattdistefano',
    icon: 'twitter'
  },
  {
    href: 'https://www.linkedin.com/in/matt-distefano/',
    icon: 'linkedin'
  }
];

// tslint:disable-next-line:variable-name
const SiteFooterContactLink = (props: SiteFooterContactLinkProps) => (
  <a className="action-icon contact-links__action-icon" href={props.href}>
    <IconComponent
      name={props.icon}
      title={`matt distefano on ${props.icon}`}
      size={22}
    />
  </a>
);

const year = new Date().getFullYear();

// tslint:disable-next-line:variable-name
export class SiteFooterComponent extends Component<SiteFooterProps> {
  render() {
    return (
      <footer className={`site-footer container ${this.props.className || ''}`}>
        <h2 className="site-footer__heading h5">&copy; {year} Matt Distefano</h2>
        <p>
          I'm a web developer with 12 years of experience in the financial
          industry. I write about many aspects of web development, with a focus
          on modern frontend stacks, accessibility, and UX design.
        </p>
        <p>
          Site built with a whole buncha stuff.{' '}
          <a href="https://github.com/mattdistefano/mattdistefano.com">
            Check it out on github
          </a>.
        </p>
        <ul className="contact-links list-unstyled">
          {footerLinks.map((link, index) => (
            <li key={index} className="contact-links__item">
              <SiteFooterContactLink {...link} />
            </li>
          ))}
        </ul>
      </footer>
    );
  }
}
