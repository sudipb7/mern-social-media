export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="w-full py-2 px-3 flex flex-col justify-center items-start gap-1 sticky top-0 left-0 right-0 border-b bg-background bg-opacity-10 backdrop-blur-xl z-10">
      <h3 className="w-full text-justify font-semibold">{title}</h3>
      {subtitle && (
        <p className="w-full text-justify text-xs font-light text-muted-foreground">
          {subtitle}
        </p>
      )}
    </section>
  );
}
