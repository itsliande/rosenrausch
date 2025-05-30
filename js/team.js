async function renderTeam() {
    try {
        const response = await fetch('/data/team.json');
        const data = await response.json();
        
        const teamContainer = document.querySelector('.module-view-grid');
        teamContainer.innerHTML = ''; // Clear existing content
        
        data.categories.forEach(category => {
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'team-category';
            
            // Add category header
            const categoryHeader = document.createElement('h2');
            categoryHeader.className = 'category-title';
            categoryHeader.textContent = category.name;
            categorySection.appendChild(categoryHeader);
            
            // Add members
            category.members.forEach(member => {
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
                                <i class="${social.platform}"></i>
                            </a>
                        `).join('')}
                    </div>
                `;
                
                categorySection.appendChild(memberElement);
            });
            
            teamContainer.appendChild(categorySection);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Team-Daten:', error);
    }
}

document.addEventListener('DOMContentLoaded', renderTeam);
