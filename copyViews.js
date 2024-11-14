const fs = require('fs');
const path = require('path');

// Source and destination directories
const srcDir = path.join(__dirname, './src/mail/view');
const destDir = path.join(__dirname, './dist/src/mail', 'view');

// Recursive function to copy files
function copyFolderSync(src, dest) {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const entries = fs.readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			copyFolderSync(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Run the copy function
copyFolderSync(srcDir, destDir);

console.log(`Views folder copied to ${destDir}`);
