import type { ReactNode } from 'react';

type AdminStatusCardProps = {
  title: string;
  children: ReactNode;
};

export default function AdminStatusCard({ title, children }: AdminStatusCardProps) {
  return (
    <section className="rounded-lg border border-[#dbe3e8] bg-white p-5 shadow-[0_10px_28px_rgba(23,32,38,0.06)]">
      <h3 className="text-base font-semibold text-[#172026]">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-[#52636f]">{children}</div>
    </section>
  );
}
