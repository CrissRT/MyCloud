import { execSync } from 'child_process';
import os from 'os';

if (os.platform() === 'win32')
  execSync(`powershell -Command "git diff --name-only --cached | ForEach-Object { git add -- $_ }"`, {
    stdio: 'inherit'
  });
else execSync(`git diff --name-only --cached -z | xargs -0 git add --`, { stdio: 'inherit' });
