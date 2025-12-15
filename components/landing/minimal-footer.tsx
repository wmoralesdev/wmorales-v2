export function MinimalFooter() {
  return (
    <footer className="pt-12">
      <p className="font-mono text-[10px] text-muted-foreground/40">
        © {new Date().getFullYear()} Walter Morales
      </p>
    </footer>
  );
}
