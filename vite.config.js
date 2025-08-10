import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import yaml from '@rollup/plugin-yaml';
import { execSync } from 'child_process';
const gitRevision = execSync('git rev-parse --short HEAD').toString().trim();
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), yaml()],
    define: {
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        __GIT_REVISION__: JSON.stringify(gitRevision),
    }
});
