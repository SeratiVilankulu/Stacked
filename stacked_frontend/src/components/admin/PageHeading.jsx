import HeroBooks from "@/assets/books.jpg";

// Page title block with the decorative hero image used across admin pages.
function PageHeading({
  eyebrow = "Admin Management",
  title,
  description,
  image = HeroBooks,
  imageAlt = "Books laid out on a library table",
}) {
  return (
    <section className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="animate-rise">
        <p className="text-eyebrow text-orange">{eyebrow}</p>
        <h1 className="mt-3 text-4xl xl:text-5xl">{title}</h1>
        {description && <p className="mt-3 text-muted">{description}</p>}
      </div>

      <div className="relative hidden h-40 w-72 shrink-0 md:block">
        <div className="absolute inset-y-2 left-0 w-3/4 rounded-[50%] bg-sky/70" />
        <img
          src={image}
          alt={imageAlt}
          className="absolute top-0 right-4 h-full w-4/5 rounded-tl-[5rem] rounded-br-[var(--radius-lg)] rounded object-cover shadow-card"
        />
      </div>
    </section>
  );
}

export default PageHeading;
