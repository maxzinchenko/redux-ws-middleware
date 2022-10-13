import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import externalDeps from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import size from 'rollup-plugin-size';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.ts';
const formats = ['cjs', 'esm', 'umd'];
const output = { name: 'ReduxAwesomeSocketMiddleware', sourcemap: true, exports: 'named' };

const createRollupConfig = format => {
  const extension = format === 'esm' ? 'mjs' : 'js';
  const file = `dist/index.${format}.${format === 'cjs' ? 'cjs' : extension}`;

  const plugins = [
    externalDeps(),
    typescript({ exclude: ['.test.ts'] }),
    babel({ extensions: ['.ts', '.js'], babelHelpers: 'bundled' })
  ];

  if (format === 'umd') {
    plugins.push(commonjs({ include: /\/node_modules\// }))
  }

  if (format !== 'esm') {
    plugins.push(
      terser({ output: { comments: false } }),
      replace({ 'process.env.NODE_ENV': '"production"', delimiters: ['', ''] }),
      size({ writeFile: false })
    )
  }

  return {
    input,
    output: { ...output, file, format },
    external: ['react'],
    plugins: plugins.filter(Boolean)
  };
}

export default formats.map(createRollupConfig);;
