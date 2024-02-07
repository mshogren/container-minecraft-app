export default function viteSingleFile() {
  return {
    name: 'vite:singlefile',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Only use this plugin during build
        if (!ctx || !ctx.bundle) return html;
        // Get the bundle
        let extraCode = '';
        let final = html;
        Object.entries(ctx.bundle).forEach(([, value]) => {
          const a = value;
          if (value.fileName.endsWith('.css')) {
            const reCSS = new RegExp(
              `<link rel="stylesheet"[^>]*?href="[./]*${value.fileName}"[^>]*?>`
            );
            const code = `<!-- ${a.fileName} --><style type="text/css">\n${a.source}\n</style>`;
            final = html.replace(reCSS, () => code);
          } else {
            extraCode += `\n<!-- ASSET NOT INLINED: ${a.fileName} -->\n`;
          }
        });
        return final.replace(/<\/body>/, `${extraCode}</body>`);
      },
    },
  };
}
