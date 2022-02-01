import replace from '@rollup/plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import externalDeps from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import size from 'rollup-plugin-size';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];

const input = 'src/index.test.ts';
const external = ['react'];

const output = {
  name: 'ReduxAwesomeSocketMiddleware',
  format: 'umd',
  sourcemap: true
};

const plugins = [
  externalDeps(),
  resolve({ extensions }),
  typescript(),
  commonJS(),
  babel({ extensions })
];

const configDevelopment = {
  input,
  output: {
    ...output,
    file: 'dist/redux-awesome-socket-middleware.development.js'
  },
  external,
  plugins
};

const configProduction = {
  input,
  output: {
    ...output,
    file: 'dist/redux-awesome-socket-middleware.production.min.js'
  },
  external,
  plugins: [
    ...plugins,
    terser(),
    replace({ 'process.env.NODE_ENV': '"production"', delimiters: ['', ''] }),
    size({ writeFile: false })
  ]
};

export default [configDevelopment, configProduction];
