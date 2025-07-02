import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col pt-16">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
