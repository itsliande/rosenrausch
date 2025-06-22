// Firebase Data Manager für Admin Panel
import { db } from './firebase-config.js';
// Firebase imports werden dynamisch in den Methoden geladen

class AdminDataManager {
    constructor() {
        this.collections = {
            team: 'team-members',
            news: 'news-items',
            events: 'events',
            quotes: 'quotes'
        };
    }

    // Dynamische Firebase-Imports
    async getFirebaseImports() {
        const { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, addDoc } = 
            await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        return { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, addDoc };
    }

    // Team Management
    async getTeamData() {
        try {
            const { collection, getDocs } = await this.getFirebaseImports();
            const querySnapshot = await getDocs(collection(db, this.collections.team));
            const categories = {};
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!categories[data.category]) {
                    categories[data.category] = {
                        name: data.category,
                        active: data.categoryActive !== false,
                        members: []
                    };
                }
                categories[data.category].members.push({
                    id: doc.id,
                    ...data
                });
            });

            return { categories: Object.values(categories) };
        } catch (error) {
            console.error('Fehler beim Laden der Team-Daten:', error);
            throw error;
        }
    }

    async saveTeamMember(memberData) {
        try {
            const { collection, doc, setDoc, addDoc } = await this.getFirebaseImports();
            if (memberData.id) {
                await setDoc(doc(db, this.collections.team, memberData.id), memberData);
            } else {
                await addDoc(collection(db, this.collections.team), memberData);
            }
        } catch (error) {
            console.error('Fehler beim Speichern des Team-Mitglieds:', error);
            throw error;
        }
    }

    async deleteTeamMember(memberId) {
        try {
            const { doc, deleteDoc } = await this.getFirebaseImports();
            await deleteDoc(doc(db, this.collections.team, memberId));
        } catch (error) {
            console.error('Fehler beim Löschen des Team-Mitglieds:', error);
            throw error;
        }
    }

    // News Management
    async getNewsData() {
        try {
            const { collection, getDocs } = await this.getFirebaseImports();
            const querySnapshot = await getDocs(collection(db, this.collections.news));
            const news = [];
            
            querySnapshot.forEach((doc) => {
                news.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return news.sort((a, b) => b.id - a.id);
        } catch (error) {
            console.error('Fehler beim Laden der News:', error);
            throw error;
        }
    }

    async saveNewsItem(newsData) {
        try {
            const { collection, doc, setDoc, addDoc } = await this.getFirebaseImports();
            if (newsData.id) {
                await setDoc(doc(db, this.collections.news, newsData.id), newsData);
            } else {
                await addDoc(collection(db, this.collections.news), newsData);
            }
        } catch (error) {
            console.error('Fehler beim Speichern der News:', error);
            throw error;
        }
    }

    async deleteNewsItem(newsId) {
        try {
            const { doc, deleteDoc } = await this.getFirebaseImports();
            await deleteDoc(doc(db, this.collections.news, newsId));
        } catch (error) {
            console.error('Fehler beim Löschen der News:', error);
            throw error;
        }
    }

    // Events Management
    async getEventsData() {
        try {
            const { collection, getDocs } = await this.getFirebaseImports();
            const querySnapshot = await getDocs(collection(db, this.collections.events));
            const events = [];
            
            querySnapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return events.sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            throw error;
        }
    }

    async saveEvent(eventData) {
        try {
            const { collection, doc, setDoc, addDoc } = await this.getFirebaseImports();
            if (eventData.id) {
                await setDoc(doc(db, this.collections.events, eventData.id), eventData);
            } else {
                await addDoc(collection(db, this.collections.events), eventData);
            }
        } catch (error) {
            console.error('Fehler beim Speichern des Events:', error);
            throw error;
        }
    }

    async deleteEvent(eventId) {
        try {
            const { doc, deleteDoc } = await this.getFirebaseImports();
            await deleteDoc(doc(db, this.collections.events, eventId));
        } catch (error) {
            console.error('Fehler beim Löschen des Events:', error);
            throw error;
        }
    }

    // Quotes Management
    async getQuotesData() {
        try {
            const { collection, getDocs } = await this.getFirebaseImports();
            const querySnapshot = await getDocs(collection(db, this.collections.quotes));
            const quotes = [];
            
            querySnapshot.forEach((doc) => {
                quotes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return quotes.sort((a, b) => b.id - a.id);
        } catch (error) {
            console.error('Fehler beim Laden der Quotes:', error);
            throw error;
        }
    }

    async saveQuote(quoteData) {
        try {
            const { collection, doc, setDoc, addDoc } = await this.getFirebaseImports();
            if (quoteData.id) {
                await setDoc(doc(db, this.collections.quotes, quoteData.id), quoteData);
            } else {
                await addDoc(collection(db, this.collections.quotes), quoteData);
            }
        } catch (error) {
            console.error('Fehler beim Speichern des Quotes:', error);
            throw error;
        }
    }

    async deleteQuote(quoteId) {
        try {
            const { doc, deleteDoc } = await this.getFirebaseImports();
            await deleteDoc(doc(db, this.collections.quotes, quoteId));
        } catch (error) {
            console.error('Fehler beim Löschen des Quotes:', error);
            throw error;
        }
    }

    // JSON Export für statische Dateien
    async exportToJSON() {
        try {
            const teamData = await this.getTeamData();
            const newsData = await this.getNewsData();
            const eventsData = await this.getEventsData();
            const quotesData = await this.getQuotesData();

            return {
                team: teamData,
                news: newsData,
                events: eventsData,
                quotes: quotesData
            };
        } catch (error) {
            console.error('Fehler beim JSON-Export:', error);
            throw error;
        }
    }
}

export default AdminDataManager;