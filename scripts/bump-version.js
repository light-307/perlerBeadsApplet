/**
 * 版本号递增脚本
 *
 * 用法：
 *   node scripts/bump-version.js            # 递增修订号（默认，兼容旧调用方式）
 *   node scripts/bump-version.js patch      # 0.2.0 -> 0.2.1（小改动）
 *   node scripts/bump-version.js minor      # 0.2.1 -> 0.3.0（新增功能）
 *   node scripts/bump-version.js major      # 0.3.1 -> 1.0.0（不兼容变更）
 *
 * 也可以直接 `npm run bump:minor` / `npm run bump:major`。
 *
 * 版本号同时写入两处，保证设置页展示的版本与仓库一致：
 *   - package.json 的 version
 *   - .env.production 的 TARO_APP_VERSION（设置页通过该变量展示）
 *
 * 递增后请一并提交，并打上与版本号一致的 git tag（如 v0.2.1）。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ENV_PRODUCTION_PATH = path.join(ROOT, '.env.production');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');

const RELEASE_TYPES = ['patch', 'minor', 'major'];
const SEMVER_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * 计算递增后的版本号。
 * @param {string} version 当前版本号，形如 0.2.0
 * @param {'patch'|'minor'|'major'} releaseType 递增类型
 * @returns {string} 递增后的版本号
 */
function bumpVersion(version, releaseType = 'patch') {
  if (!RELEASE_TYPES.includes(releaseType)) {
    throw new Error(
      `未知的递增类型 "${releaseType}"，可选值：${RELEASE_TYPES.join(' / ')}`
    );
  }

  const matched = SEMVER_PATTERN.exec(String(version).trim());
  if (!matched) {
    throw new Error(
      `版本号格式不合法："${version}"，应为 MAJOR.MINOR.PATCH（如 0.2.0）`
    );
  }

  let major = Number(matched[1]);
  let minor = Number(matched[2]);
  let patch = Number(matched[3]);

  if (releaseType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (releaseType === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

function updateEnvVersion(newVersion) {
  const content = fs.readFileSync(ENV_PRODUCTION_PATH, 'utf8');
  const nextContent = content.replace(
    /TARO_APP_VERSION\s*=\s*"[^"]*"/,
    `TARO_APP_VERSION="${newVersion}"`
  );

  if (nextContent === content) {
    throw new Error('未能更新 .env.production 中的 TARO_APP_VERSION，请检查该文件格式');
  }

  fs.writeFileSync(ENV_PRODUCTION_PATH, nextContent, 'utf8');
}

function updatePackageVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2), 'utf8');
}

function main() {
  const releaseType = (process.argv[2] || 'patch').replace(/^--/, '');
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const currentVersion = packageJson.version;
  const newVersion = bumpVersion(currentVersion, releaseType);

  updateEnvVersion(newVersion);
  updatePackageVersion(newVersion);

  console.log(`版本号已递增（${releaseType}）：${currentVersion} → ${newVersion}`);
  console.log('请一并提交，并打上与版本号一致的 git tag。');
}

if (require.main === module) {
  main();
}

module.exports = { bumpVersion, RELEASE_TYPES };
