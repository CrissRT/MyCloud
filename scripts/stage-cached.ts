import { execSync } from 'child_process';
import os from 'os';

if (os.platform() === 'win32') {
  try {
    execSync(`powershell -Command "git diff --name-only --cached | ForEach-Object { git add -- $_ }"`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('Error executing PowerShell command:', error.message);
    process.exit(1);
  }
} else {
  try {
    execSync(`git diff --name-only --cached -z | xargs -0 git add --`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error executing git command:', error.message);
    process.exit(1);
  }
}
