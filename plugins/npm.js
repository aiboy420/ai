import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cmd } from '../command.js';
import axios from 'axios';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===============================
// COMMAND 1: npm (Search Package)
// ===============================
cmd({
    pattern: "npm",
    desc: "Search for a package on npm.",
    react: '📦',
    category: "tools",
    filename: __filename,
    use: ".npm <package-name>"
}, async (conn, mek, msg, { from, args, reply }) => {
    try {
        if (!args.length) {
            return reply("❌ Please provide a package name!\n\nExample: .npm axios");
        }

        const packageName = args.join(" ");
        
        // Proper encoding for scoped packages
        let encodedPkg = encodeURIComponent(packageName);
        if (packageName.startsWith('@')) {
            encodedPkg = `@${encodeURIComponent(packageName.slice(1))}`;
        }
        
        const apiUrl = `https://registry.npmjs.org/${encodedPkg}`;
        const response = await axios.get(apiUrl, { timeout: 10000 });

        const data = response.data;
        const latestVersion = data["dist-tags"].latest;
        const description = data.description || "No description available.";
        const npmUrl = `https://www.npmjs.com/package/${packageName}`;
        const license = data.license || "Unknown";
        const repository = data.repository?.url || "Not available";
        const author = data.author?.name || "Unknown";

        const message = `
📦 *NPM PACKAGE INFO*

🔰 *Package:* ${packageName}
📄 *Description:* ${description}
📌 *Version:* ${latestVersion}
👤 *Author:* ${author}
🪪 *License:* ${license}
🪩 *Repository:* ${repository}
🔗 *URL:* ${npmUrl}

💡 *Download:* .dlnpm ${packageName}

> *Powered By NAWAZ-MD*
`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (error) {
        console.error("NPM Search Error:", error.message);
        reply("❌ Package not found on npm registry!");
    }
});

// ===============================
// COMMAND 2: dlnpm (Download Package)
// ===============================
cmd({
    pattern: "dlnpm",
    desc: "Download npm package as tgz",
    category: "download",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) {
            return reply("❌ Please provide a package name!\n\nExamples:\n.dlnpm axios\n.dlnpm @fadeldev/baileys-mod");
        }

        const pkg = q.trim();
        await react("⏳");

        // Create temp directory
        const tempDir = join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // Proper encoding for scoped packages
        let encodedPkg = encodeURIComponent(pkg);
        if (pkg.startsWith('@')) {
            encodedPkg = `@${encodeURIComponent(pkg.slice(1))}`;
        }

        // 1️⃣ Get package metadata from npm registry
        const registryUrl = `https://registry.npmjs.org/${encodedPkg}`;
        const metadata = await axios.get(registryUrl, { timeout: 15000 });
        
        // 2️⃣ Get latest version
        const latestVersion = metadata.data["dist-tags"].latest;
        
        // 3️⃣ Get the CORRECT tarball URL from dist.tarball
        const tarballUrl = metadata.data.versions[latestVersion].dist.tarball;
        
        if (!tarballUrl) {
            throw new Error("Tarball URL not found");
        }

        // 4️⃣ Download tarball with redirect handling
        const tarball = await axios.get(tarballUrl, {
            responseType: 'arraybuffer',
            maxRedirects: 5,
            timeout: 60000,
            headers: {
                'User-Agent': 'npm-download-bot/1.0'
            }
        });

        if (!tarball.data || tarball.data.length === 0) {
            throw new Error("Downloaded file is empty");
        }

        // 5️⃣ Save file
        const safeName = pkg.replace(/^@/, '').replace(/\//g, '-');
        const fileName = `${safeName}-${latestVersion}.tgz`;
        const filePath = join(tempDir, fileName);
        
        fs.writeFileSync(filePath, tarball.data);
        const fileSize = (tarball.data.length / 1024).toFixed(2);

        // 6️⃣ Send file
        await conn.sendMessage(from, {
            document: fs.readFileSync(filePath),
            mimetype: 'application/gzip',
            fileName: fileName,
            caption: `📦 *NPM Package Downloaded*

• *Name:* ${pkg}
• *Version:* ${latestVersion}
• *Size:* ${fileSize} KB
• *Format:* .tgz

> *Powered By NAWAZ-MD*`
        }, { quoted: mek });

        // 7️⃣ Cleanup
        fs.unlinkSync(filePath);
        await react("✅");

    } catch (error) {
        console.error("DLNPM Error:", error.message);
        await react("❌");
        
        let errorMsg = "❌ Failed to download package!\n\n";
        if (error.response?.status === 404) {
            errorMsg += "Package not found on npm registry.";
        } else if (error.code === 'ECONNABORTED') {
            errorMsg += "Download timeout. Package might be too large.";
        } else if (error.code === 'ENOTFOUND') {
            errorMsg += "Network error. Check your connection.";
        } else {
            errorMsg += error.message;
        }
        
        reply(errorMsg);
    }
});
