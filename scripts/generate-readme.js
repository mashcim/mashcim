const { Octokit } = require('@octokit/rest');
const fs = require('fs');

async function generateREADME() {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    try {

        const { data: user } = await octokit.rest.users.getAuthenticated();
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
            type: 'owner',
            sort: 'updated',
            per_page: 100
        });

        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const publicRepos = repos.filter(repo => !repo.private).length;

        const popularRepos = repos
            .filter(repo => !repo.private)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        const readmeContent = `# 👋 Merhaba, Ben Zeynep Sude!

Yazılım geliştirici ve siber güvenlik tutkunu

---

## � GitHub İstatistiklerim

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=mashcim&show_icons=true&theme=radical&hide_border=true" alt="GitHub Stats">
</div>

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=mashcim&theme=radical&hide_border=true" alt="GitHub Streak">
</div>

---

## 🛡️ Cybersecurity & Security Tools

<div align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Kali_Linux-557C94?style=for-the-badge&logo=kalilinux&logoColor=white" alt="Kali Linux">
  <img src="https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white" alt="Arch Linux">
  <img src="https://img.shields.io/badge/Metasploit-2596CD?style=for-the-badge&logo=metasploit&logoColor=white" alt="Metasploit">
  <img src="https://img.shields.io/badge/Wireshark-1679A7?style=for-the-badge&logo=wireshark&logoColor=white" alt="Wireshark">
  <img src="https://img.shields.io/badge/Burp_Suite-FE7A37?style=for-the-badge&logo=burpsuite&logoColor=white" alt="Burp Suite">
  <img src="https://img.shields.io/badge/Nmap-00897B?style=for-the-badge&logo=nmap&logoColor=white" alt="Nmap">
  <img src="https://img.shields.io/badge/John_the_Ripper-4C5A5A?style=for-the-badge&logo=johntheripper&logoColor=white" alt="John the Ripper">
</div>

---

## � Frontend Development

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SASS">
</div>

---

## � Backend Development

<div align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white" alt="Ruby">
</div>

---

## 🗄️ Database & Cloud

<div align="center">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS">
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" alt="Google Cloud">
  <img src="https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure">
</div>

---

## �️ Tools & Technologies

<div align="center">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="VS Code">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes">
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins">
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL">
  <img src="https://img.shields.io/badge/REST_API-02569B?style=for-the-badge&logo=restapi&logoColor=white" alt="REST API">
  <img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Linux">
  <img src="https://img.shields.io/badge/Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=macos&logoColor=white" alt="macOS">
</div>

---

## 🏆 Başarılar

- ⭐ **${totalStars}** Toplam Star
- 🍴 **${totalForks}** Toplam Fork
- 📂 **${publicRepos}** Public Repo
- 🔥 **${user.public_repos}** Toplam Katkı

---

## 🚀 Popüler Projelerim

${popularRepos.map(repo => `
### [${repo.name}](${repo.html_url})
${repo.description || 'Proje açıklaması yok'}
⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 📝 ${repo.language || 'Bilinmiyor'}
`).join('')}

---

## 📈 Activity Graph

<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=mashcim&theme=radical&hide_border=true" alt="Activity Graph">
</div>

---

## 📧 İletişim

- 📧 Email: ${user.email || 'zeynep.sude@example.com'}
- 🐙 GitHub: [mashcim](${user.html_url})
- 🐦 Twitter: [@${user.twitter_username || 'mashcim'}](https:

---

<div align="center">
  <img src="https://komarev.com/ghpvc/?username=mashcim&style=for-the-badge&color=blueviolet" alt="Profile Views">
</div>

---

*Bu README otomatik olarak güncellenmektedir - 🤖 Son güncelleme: ${new Date().toLocaleString('tr-TR')}*
`;

        fs.writeFileSync('README.md', readmeContent);
        console.log('✅ README başarıyla güncellendi!');

    } catch (error) {
        console.error('❌ Hata:', error.message);
        process.exit(1);
    }
}

generateREADME();
