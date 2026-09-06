import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
writeFileSync('.test-build/package.json', '{"type":"commonjs"}');
const result = spawnSync(process.execPath, ['--test', 'tests/workflow.test.cjs'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
