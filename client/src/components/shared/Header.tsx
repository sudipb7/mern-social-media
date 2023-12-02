interface Props {
  title: string;
  subtitle?: string;
  isHide?: boolean;
}

const Header: React.FC<Props> = ({ title, subtitle, isHide }) => {
  return (
    <section
      className={`w-full py-3 px-3 flex flex-col justify-center items-start gap-1 sticky top-0 left-0 right-0 border-b bg-background/10 backdrop-blur-2xl z-10 ${
        isHide && "max-sm:hidden"
      }`}
    >
      <h3 className="w-full text-justify font-semibold">{title}</h3>
      {subtitle && (
        <p className="w-full text-justify text-xs font-light text-muted-foreground">
          {subtitle}
        </p>
      )}
    </section>
  );
};

export default Header;
