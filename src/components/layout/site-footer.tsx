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

export const SiteFooterComponent = () =>
  <footer className="site-footer">
    <h2 className="site-footer__heading">About</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <ul className="contact-links list-unstyled">
      {footerLinks.map((link, index) =>
        <li key={index} className="contact-links__item">
          <SiteFooterContactLink {...link} />
        </li>
      )}
    </ul>
  </footer>;
