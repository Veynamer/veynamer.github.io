document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const body = document.body;

    body.classList.add('loading');

    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);

        body.classList.remove('loading');
		body.style.overflow = 'auto';
    });
});
// copy code function
async function copyToClipboard(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert("Команда скопирована в буфер обмена");
    } catch (err) {
        alert("Не удалось скопировать команду.");
    }
}

// Sidebar
const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('sidebar-toggle');
const mainContent = document.querySelector('.main-content');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('open');
});
// language button
const languageButton = document.getElementById('language-button');
const languageOptions = document.querySelector('.language-options');

languageButton.addEventListener('click', () => {
    if (languageOptions.style.display === 'block') {
        languageOptions.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        languageOptions.style.opacity = "0";
        languageOptions.style.transform = "translateX(20px)";

        setTimeout(() => {
            languageOptions.style.display = 'none';
        }, 300);
    } else {
        languageOptions.style.display = 'block';
        setTimeout(() => {
            languageOptions.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            languageOptions.style.opacity = "1";
            languageOptions.style.transform = "translateX(0)";
        }, 10);
    }
});

// get data from GitHub
async function getGitHubStats() {
    const username = 'Veynamer';
    const apiUrl = `https://api.github.com/users/${username}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            showErrorLog('Не удалось загрузить данные');
            return;
        }

        document.getElementById('github-username').textContent = data.login;
        animateCounter('github-followers', 0, data.followers);
        animateCounter('github-repos', 0, data.public_repos);
        animateCounter('github-stars', 0, data.public_gists);

        // get repositories
        const reposResponse = await fetch(data.repos_url);
        const reposData = await reposResponse.json();

        let totalCommits = 0;
        let lastCommitDate = null;
        let openIssuesCount = 0;
        let pullRequestsCount = 0;
        let mostStarredRepo = null;

        for (let repo of reposData) {
            const commitsUrl = repo.commits_url.replace('{/sha}', '');
            const commitsResponse = await fetch(commitsUrl);
            const commitsData = await commitsResponse.json();
            if (Array.isArray(commitsData)) {
                totalCommits += commitsData.length;
                if (commitsData.length > 0) {
                    const lastCommit = commitsData[commitsData.length - 1];
                    lastCommitDate = lastCommit.commit.author.date;
                }
            }

            openIssuesCount += repo.open_issues_count;
            pullRequestsCount += repo.pull_requests ? repo.pull_requests.length : 0;

            if (!mostStarredRepo || repo.stargazers_count > mostStarredRepo.stargazers_count) {
                mostStarredRepo = repo;
            }
        }

        animateCounter('github-commits', 0, totalCommits);
        document.getElementById('github-last-commit').textContent = lastCommitDate ? new Date(lastCommitDate).toLocaleString() : 'Нет коммитов';
        document.getElementById('github-open-issues').textContent = openIssuesCount;
        document.getElementById('github-pull-requests').textContent = pullRequestsCount;
        document.getElementById('github-most-starred').textContent = mostStarredRepo ? mostStarredRepo.name : 'Нет репозиториев';

    } catch (error) {
        showErrorLog('Не удалось загрузить данные');
    }
}

function animateCounter(id, startValue, endValue) {
    let currentValue = startValue;
    const step = (endValue - startValue) / 30;

    function update() {
        currentValue += step;
        if (Math.abs(currentValue - endValue) < Math.abs(step)) {
            currentValue = endValue;
        }
        document.getElementById(id).textContent = Math.round(currentValue);
        if (currentValue !== endValue) {
            requestAnimationFrame(update);
        }
    }
    update();
}

document.addEventListener('DOMContentLoaded', getGitHubStats);


// database

const owner = "Veynamer";
const repo = "veynamer.github.io";
const folder = "database";

function formatFileSize(bytes) {
	if (bytes < 1024) return bytes + " B";
    let k = 1024, i = Math.floor(Math.log(bytes) / Math.log(k));
    let sizes = ["B", "KB", "MB", "GB", "TB"];
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

async function fetchFiles() {
   const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder}`);
   const files = await response.json();

   if (Array.isArray(files)) {
        document.getElementById("file-list").innerHTML = files
            .map(file => `
                <li>
                    <a href="${file.download_url}" target="_blank">${file.name}</a>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </li>
            `).join("");
    } else {
        document.getElementById("file-list").innerHTML = "Ошибка загрузки файлов.";
      }
}

fetchFiles();