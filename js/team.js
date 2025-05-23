async function renderTeam() {
    try {
        const response = await fetch('/data/team.json');
        const data = await response.json();
        
        const teamContainer = document.querySelector('.team-grid');
        
        data.team.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'team-member';
            
            memberElement.innerHTML = `
                <img src="${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <div class="role">${member.role}</div>
                <div class="bio">${member.bio}</div>
                <div class="social-links">
                    ${member.social.map(social => `
                        <a href="${social.url}" target="_blank">
                            <i class="fab fa-${social.platform}"></i>
                        </a>
                    `).join('')}
                </div>
            `;
            
            teamContainer.appendChild(memberElement);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Team-Daten:', error);
    }
}

document.addEventListener('DOMContentLoaded', renderTeam);
