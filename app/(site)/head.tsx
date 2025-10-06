export default function Head() {
  return (
    <>
      <title>Tóték - 2025 - Ősz</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Built with Next.js and TypeScript" />
      <link rel="icon" href="/images/favicon.ico" />
      {/* Android Chrome */}
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#1d8e4e"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#000000"
      />

      {/* iOS Safari */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
    </>
  );
}
