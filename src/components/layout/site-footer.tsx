import * as React from 'react';

interface SiteFooterContactLinkProps {
  href: string;
  icon: string;
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

const SiteFooterContactLink = (props: SiteFooterContactLinkProps) =>
  <a className="action-icon contact-links__action-icon icon" href={props.href}>
    {props.icon}
  </a>;

const year = new Date().getFullYear();

export const SiteFooterComponent = () =>
  <footer className="site-footer">
    <h2 className="site-footer__heading">&copy; {year} Matt Distefano</h2>
    <p>
      Site built with a whole buncha stuff. <a href="https://github.com/mattdistefano/mattdistefano.com">Check it out on github</a>.
    </p>
    <ul className="contact-links list-unstyled">
      {footerLinks.map((link, index) =>
        <li key={index} className="contact-links__item">
          <SiteFooterContactLink {...link} />
        </li>
      )}
    </ul>
  </footer>;
