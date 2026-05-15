import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-8 space-y-3">
        <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-600 backdrop-blur">
          Your profile
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Tune your shape preferences
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">
          Tell us the categories, price range, and favorite shape you shop for.
          We&apos;ll use this to tailor the catalog. Existing answers stay
          loaded so you can tweak any field.
        </p>
      </header>

      <ProfileForm />
    </main>
  );
}
