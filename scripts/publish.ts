import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllPackages } from './shared';

const libPath = fileURLToPath(new URL('../', import.meta.url));

function updatePackageREADME(roots: string[]) {
  roots.forEach((root) => {
    const packageReadme = resolve(root, 'README.md');
    const libReadme = resolve(libPath, 'README.md');
    const libReadmeText = readFileSync(libReadme).toString();

    if (!existsSync(packageReadme)) {
      writeFileSync(packageReadme, libReadmeText, 'utf-8');
    }
    else {
      const packageReadmeText = readFileSync(packageReadme).toString();
      writeFileSync(packageReadme, `${packageReadmeText}\n\n${libReadmeText}`, 'utf-8');
    }
  });
}

function updatePackageLICENSE(roots: string[]) {
  roots.forEach((root) => {
    const packageLicense = resolve(root, 'LICENSE');
    const libLicense = resolve(libPath, 'LICENSE');
    const LibLicenseText = readFileSync(libLicense).toString();

    writeFileSync(packageLicense, LibLicenseText, 'utf-8');
  });
}

const command = 'pnpm publish -r --no-git-checks --access public';

function run() {
  const packages = getAllPackages();
  updatePackageREADME(packages.map(e => e.root));
  updatePackageLICENSE(packages.map(e => e.root));
  execSync(command);
}

run();
