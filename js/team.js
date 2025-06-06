async function renderTeam() {
    try {
        const response = await fetch('/data/team.json');
        const data = await response.json();
        
        const teamContainer = document.querySelector('.team-grid');
        teamContainer.innerHTML = ''; // Clear existing content
        
        data.categories.forEach(category => {
            // Überprüfen, ob die Kategorie aktiv ist
            // Wenn active nicht definiert ist, gilt die Kategorie als aktiv
            if (category.active === false) {
                return; // Kategorie überspringen, wenn sie inaktiv ist
            }
            
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'team-category';
            
            // Add category header
            const categoryHeader = document.createElement('h2');
            categoryHeader.className = 'category-title';
            categoryHeader.textContent = category.name;
            categorySection.appendChild(categoryHeader);
            
            // Create members grid for this category
            const membersGrid = document.createElement('div');
            membersGrid.className = 'category-members';
            
            // Add members
            category.members.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'team-member';
                
                // Direkte Zuweisung der ID ohne temporäre Variable
                memberElement.id = member.name.toLowerCase().replace(/\s+/g, '-');
                
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
                
                membersGrid.appendChild(memberElement);
            });
            
            categorySection.appendChild(membersGrid);
            teamContainer.appendChild(categorySection);
        });

        // Nach dem Rendern der Team-Mitglieder zum Anker-Element scrollen, falls vorhanden
        scrollToTeamMember();
    } catch (error) {
        console.error('Fehler beim Laden der Team-Daten:', error);
    }
}

// Funktion zum Scrollen zum Team-Mitglied basierend auf URL-Fragment oder Pfad
function scrollToTeamMember() {
    // Fragment aus URL extrahieren (ohne #)
    let fragment = window.location.hash.substring(1);
    
    // Falls kein Fragment vorhanden ist, prüfe auf einen Pfad wie /cenny
    if (!fragment && window.location.pathname) {
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        // Wenn der letzte Teil des Pfads nicht "team.html" oder "team" ist, könnte es ein Mitgliedsname sein
        if (lastPart && lastPart !== 'team.html' && lastPart !== 'team') {
            fragment = lastPart;
        }
    }
    
    // Wenn ein Fragment/Mitgliedsname gefunden wurde, zum Element scrollen
    if (fragment) {
        setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Optional: Hervorhebung des Elements durch eine Klasse
                element.classList.add('highlighted');
                setTimeout(() => {
                    element.classList.remove('highlighted');
                }, 2000);
            }
        }, 300); // Kurze Verzögerung, um sicherzustellen, dass das DOM vollständig geladen ist
    }
}

document.addEventListener('DOMContentLoaded', renderTeam);

// Event-Listener für Hash-Änderungen hinzufügen, falls jemand auf der Seite die URL ändert
window.addEventListener('hashchange', scrollToTeamMember);