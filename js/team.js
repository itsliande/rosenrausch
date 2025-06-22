async function renderTeam() {
    try {
        // Versuche zuerst Firebase zu laden, falls verfügbar
        const data = await loadTeamData();
        
        async function loadTeamData() {
            // Prüfe ob Firebase verfügbar ist
            if (window.firebase && window.firebase.apps.length > 0) {
                try {
                    const { db } = await import('./firebase-config.js');
                    const { collection, getDocs } = await import('firebase/firestore');
                    
                    const querySnapshot = await getDocs(collection(db, 'team-members'));
                    const categories = {};
                    
                    querySnapshot.forEach((doc) => {
                        const memberData = doc.data();
                        if (!categories[memberData.category]) {
                            categories[memberData.category] = {
                                name: memberData.category,
                                active: memberData.categoryActive !== false,
                                members: []
                            };
                        }
                        categories[memberData.category].members.push({
                            id: doc.id,
                            ...memberData
                        });
                    });

                    return { categories: Object.values(categories) };
                } catch (error) {
                    console.log('Firebase nicht verfügbar, lade JSON-Fallback');
                    return loadJSONFallback();
                }
            } else {
                return loadJSONFallback();
            }
        }
        
        async function loadJSONFallback() {
            const response = await fetch('/data/team.json');
            return await response.json();
        }
        
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
            
            // Setze data-attribute für die Anzahl der Mitglieder
            membersGrid.setAttribute('data-member-count', category.members.length);
            
            // Dynamisches Grid-Layout basierend auf Mitgliederanzahl
            setupDynamicGrid(membersGrid, category.members.length);
            
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

// Funktion zur dynamischen Grid-Erstellung
function setupDynamicGrid(gridElement, memberCount) {
    // Für 1-3 Mitglieder verwende CSS-Regeln
    if (memberCount <= 3) {
        return;
    }
    
    // Prüfe Bildschirmgröße für mobile Optimierung
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Auf mobilen Geräten immer 1 Spalte
        gridElement.style.gridTemplateColumns = '1fr';
        return;
    }
    
    let columnsPerRow, gridColumns;
    
    // Bestimme optimale Spaltenanzahl basierend auf Mitgliederanzahl
    if (memberCount <= 6) {
        columnsPerRow = memberCount === 4 ? 3 : (memberCount === 5 ? 2 : 3);
    } else if (memberCount <= 12) {
        columnsPerRow = memberCount <= 8 ? 2 : 3;
    } else {
        // Für größere Gruppen verwende 3er oder 4er Grid
        columnsPerRow = memberCount <= 20 ? 3 : 4;
    }
    
    gridColumns = columnsPerRow;
    
    // Setze CSS Grid Template
    gridElement.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    
    // Berechne, welche Mitglieder speziell positioniert werden müssen
    const remainder = memberCount % columnsPerRow;
    
    if (remainder === 1) {
        // Letztes Element als breite Karte
        const lastRow = Math.ceil(memberCount / columnsPerRow);
        setTimeout(() => {
            const lastMember = gridElement.children[memberCount - 1];
            if (lastMember) {
                lastMember.style.gridColumn = '1 / -1';
                lastMember.style.gridRow = lastRow.toString();
            }
        }, 100);
    } else if (remainder === 2 && columnsPerRow >= 3) {
        // Letzte 2 Elemente zentriert
        const lastRow = Math.ceil(memberCount / columnsPerRow);
        setTimeout(() => {
            const secondLastMember = gridElement.children[memberCount - 2];
            const lastMember = gridElement.children[memberCount - 1];
            
            if (secondLastMember && lastMember) {
                if (columnsPerRow === 3) {
                    secondLastMember.style.gridColumn = '1 / 2';
                    secondLastMember.style.gridRow = lastRow.toString();
                    lastMember.style.gridColumn = '3 / 4';
                    lastMember.style.gridRow = lastRow.toString();
                }
            }
        }, 100);
    }
}

// Event-Listener für Fenstergrößenänderungen
window.addEventListener('resize', () => {
    // Grid nach Größenänderung neu berechnen
    const teamGrids = document.querySelectorAll('.category-members');
    teamGrids.forEach(grid => {
        const memberCount = parseInt(grid.getAttribute('data-member-count'));
        if (memberCount > 3) {
            // Reset existing styles
            grid.style.gridTemplateColumns = '';
            Array.from(grid.children).forEach(child => {
                child.style.gridColumn = '';
                child.style.gridRow = '';
            });
            // Reapply dynamic grid
            setupDynamicGrid(grid, memberCount);
        }
    });
});

document.addEventListener('DOMContentLoaded', renderTeam);

// Event-Listener für Hash-Änderungen hinzufügen, falls jemand auf der Seite die URL ändert
window.addEventListener('hashchange', scrollToTeamMember);