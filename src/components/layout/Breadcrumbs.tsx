
import React from "react";
import { Link } from "react-router-dom";

interface Crumb {
  name: string;
  url: string;
}

const Breadcrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => (
  <nav aria-label="Breadcrumb" className="mb-4">
    <ol
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className="flex flex-wrap gap-2 text-xs text-vintage-brown"
    >
      {crumbs.map((crumb, idx) => (
        <li
          key={crumb.url}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link to={crumb.url} itemProp="item">
            <span itemProp="name">{crumb.name}</span>
          </Link>
          <meta itemProp="position" content={String(idx + 1)} />
          {idx < crumbs.length - 1 && <span className="mx-1">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
