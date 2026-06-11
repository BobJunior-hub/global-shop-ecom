import Link from "next/link";
import type { BrandConfig } from "@/src/lib/branding";

export const Footer = ({ brand }: { brand: BrandConfig }) => {
  return (
    <footer className="bg-brand-primary pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-bold tracking-tight text-brand-secondary">
              {brand.displayName}
            </Link>
            <p className="text-sm text-brand-secondary-muted leading-relaxed max-w-xs">
              {brand.description}
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-1">
              {brand.socials.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-secondary hover:opacity-80 transition-opacity"
                >
                  <svg className="w-4 h-4 fill-current text-brand-primary" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-secondary-muted">
              Filiallarimiz
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {brand.locations.map((loc) => (
                <div key={loc.name} className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-brand-secondary">{loc.name}</p>
                  <div className="text-xs text-brand-secondary-muted flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 mt-px shrink-0 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {loc.mapUrl !== "#" ? (
                      <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors underline underline-offset-2">
                        {loc.address}
                      </a>
                    ) : (
                      loc.address
                    )}
                  </div>
                  <p className="text-xs text-brand-secondary-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {loc.hours}
                  </p>
                  <p className="text-xs text-brand-secondary-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {loc.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
