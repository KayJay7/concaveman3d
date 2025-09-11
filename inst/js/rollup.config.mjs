import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/main.ts',
    output: {
        file: 'static/concaveman3d-bundle.js',
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
            compilerOptions: {
                composite: false,
                emitDeclarationOnly: false,
            },
        })
        // terser()
    ],
    treeshake: "smallest"

};