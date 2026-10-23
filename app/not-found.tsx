import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <main id="contenido" className="flex min-h-svh flex-col bg-paper">
      <SiteHeader />
      <div className="flex flex-1 flex-col justify-center px-4 pb-16 sm:px-7">
        <h1 className="display text-[clamp(4rem,22vw,16rem)] text-accent">
          404
        </h1>
        <p className="mt-4 max-w-[32rem] text-lead">
          Esta página no existe. Lo que buscás probablemente está en el inicio.
        </p>
        <Link href="/" className="btn mt-8 self-start">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
