const APIURL = "https://api.github.com/users/";

const searchInput = document.querySelector('.search-bar');
const viewProfileButton = document.querySelector('.view');
const infoImage = document.querySelector('.info-image');
const publicButtons = document.querySelectorAll('.public1, .public2, .public3, .public4');
const company = document.querySelector('.company');
const web = document.querySelector('.Web');
const userlocation = document.querySelector('.location');
const memberSince = document.querySelector('.Member');
const repos = document.querySelectorAll('.repos-name');
const watchers = document.querySelectorAll('.Watchers');
const forks = document.querySelectorAll('.Forks');
const addList = document.getElementById('add-list');
const spinner = document.querySelector('.spinner');

// viewProfileButton 클릭 이벤트 대신 input 입력 이벤트 사용
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // 엔터키의 기본 동작(페이지 새로고침) 방지
        const username = searchInput.value.trim();
        if (username) {
            getUser(username);
        }
    }
});


// 이벤트 리스너 등록
viewProfileButton.addEventListener('click', () => {
    const username = searchInput.value;
    if (username) {
        getUser(username);
    }
});

// GitHub API를 사용하여 사용자 정보 가져오기
const getUser = async (username) => {
    try {
        spinner.classList.add('loading'); // 스피너 표시
        const response = await fetch(APIURL + username);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        displayUser(user);
        // 추가 작업: 사용자의 리포지토리 정보 가져오기
        await getRepos(username);
        spinner.classList.remove('loading'); // 스피너 감추기
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 사용자 정보 표시
const displayUser = (user) => {
    infoImage.src = user.avatar_url;
    company.textContent = `Company: ${user.company || 'N/A'}`;
    web.textContent = `Website/Blog: ${user.blog || 'N/A'}`;
    userlocation.textContent = `Location: ${user.location || 'N/A'}`;
    memberSince.textContent = `Member Since: ${user.created_at.substring(0, 10)}`;
    
    // public 버튼 텍스트 업데이트
    const public1 = document.querySelector('.public1');
    const public2 = document.querySelector('.public2');
    const public3 = document.querySelector('.public3');
    const public4 = document.querySelector('.public4');
    
    public1.textContent = `Public Repos: ${user.public_repos}`;
    public2.textContent = `Public Gists: ${user.public_gists}`;
    public3.textContent = `Followers: ${user.followers}`;
    public4.textContent = `Following: ${user.following}`;
};


// 사용자의 리포지토리 정보 가져오기
const getRepos = async (username) => {
    try {
        const response = await fetch(APIURL + username + '/repos');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reposData = await response.json();
        displayRepos(reposData);
    } catch (error) {
        console.error('Error fetching repositories:', error);
    }
};

// 리포지토리 정보 표시
const displayRepos = (reposData) => {
    addList.innerHTML = '';
    reposData.forEach(repo => { // 여기서 slice 부분을 제거하여 모든 리포지토리 정보를 표시
        const listItem = document.createElement('li');
        listItem.classList.add('bottom-item');

        const repoContainer = document.createElement('div');
        repoContainer.classList.add('repos1');

        const repoName = document.createElement('div');
        repoName.classList.add('repos-name');
        repoName.textContent = repo.name;

        const rightSection = document.createElement('div');
        rightSection.classList.add('right-section');

        const share = document.createElement('div');
        share.classList.add('share1');
        share.textContent = 'Share:';

        const watcherCount = document.createElement('div');
        watcherCount.classList.add('Watchers');
        watcherCount.textContent = `Watchers: ${repo.watchers_count}`;

        const forkCount = document.createElement('div');
        forkCount.classList.add('Forks');
        forkCount.textContent = `Forks: ${repo.forks_count}`;

        rightSection.appendChild(share);
        rightSection.appendChild(watcherCount);
        rightSection.appendChild(forkCount);

        repoContainer.appendChild(repoName);
        repoContainer.appendChild(rightSection);

        listItem.appendChild(repoContainer);
        addList.appendChild(listItem);
    });
};
