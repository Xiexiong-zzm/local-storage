import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const isProduction = !process.env.ROLLUP_WATCH;
export default {
    input: 'src/local-storage.ts',
    output: {
        file: 'public/bundle.js',
        format: 'iife'
    }
}