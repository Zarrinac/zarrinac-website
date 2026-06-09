type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function AdminPageHeader({ eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00a8a3]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-[#172026]">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm text-[#5d6d78]">{description}</p> : null}
    </div>
  );
}
