"use client";

type SocialLinkProps = {
  href: string;
  label: string;
  icon: string;
};

export function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor="link"
      className="flex flex-col items-center gap-2.5 transition-opacity duration-200 hover:opacity-90"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt=""
        width={96}
        height={96}
        className="h-[4.25rem] w-[4.25rem] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.2)] md:h-[4.75rem] md:w-[4.75rem]"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      <span className="font-mono text-[9px] tracking-wider text-muted">{label}</span>
    </a>
  );
}

export function FooterIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl md:max-w-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/footerintro-cutout.png"
        alt=""
        width={1264}
        height={843}
        className="mx-auto w-full max-w-[280px] object-contain sm:max-w-[420px] md:max-w-[520px]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
