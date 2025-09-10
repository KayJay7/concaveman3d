import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/main.ts',
    output: {
        file: 'concaveman3d-bundle.js',
        format: 'iife',
        name: 'concaveman3d',
    },
    plugins: [
        nodeResolve({
            browser: true,
        }), // pulls deps from node_modules
        commonjs({
            include: 'node_modules/**',
        }), // converts CJS deps to ESM
        typescript({
            include: ["src/**/*.ts"]
        })
        // terser()
    ],
    treeshake: {
        moduleSideEffects: false, // assume modules have no side effects unless marked
        // propertyReadSideEffects: false, // treat unused property reads as safe to remove (obj.foo with no use won’t be kept)
    }

};