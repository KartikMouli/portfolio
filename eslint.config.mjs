import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import * as mdx from 'eslint-plugin-mdx';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // React Compiler ships this rule via eslint-plugin-react-hooks 7+;
      // it flags any setState in an effect, including legitimate cases.
      // See https://github.com/facebook/react/issues/34743
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // ---- MDX ----------------------------------------------------------
  // `mdx.flat` lints MDX/Markdown files themselves (JSX syntax, prose
  // structure via remark), `mdx.flatCodeBlocks` runs against fenced
  // code blocks inside them. The latter ships with the right disables
  // for tutorial-style snippets out of the box (no-unused-vars off,
  // no-undef off, etc.) so a `import { x } from 'foo'` example doesn't
  // flag — see node_modules/eslint-plugin-mdx/lib/configs/code-blocks.js.
  mdx.flat,
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // Code blocks in posts are illustrative — they may import names
      // that don't exist in the repo (`from 'some-package'`) or use
      // Tailwind class strings the JSX rule doesn't understand. These
      // would all create false positives.
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  // The `mdx/remark` rule requires a `.remarkrc` to do anything; without
  // one it's silent. We deliberately don't add a remark-lint config —
  // prose style is editorial, not lintable. Disabling avoids any
  // surprise warnings if a future @next/mdx upgrade injects defaults.
  {
    files: ['**/*.{md,mdx}'],
    rules: {
      'mdx/remark': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
