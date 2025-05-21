class Calendar {
    constructor(containerElement) {
        this.container = containerElement;
        this.date = new Date();
        this.render();
    }

    render() {
        const month = this.date.toLocaleString('de-DE', { month: 'long' });
        const year = this.date.getFullYear();

        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="prev-month">&lt;</button>
                <h2>${month} ${year}</h2>
                <button class="next-month">&gt;</button>
            </div>
            <div class="calendar-grid">
                ${this.renderDays()}
            </div>
        `;

        this.addEventListeners();
    }

    renderDays() {
        const daysInMonth = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            0
        ).getDate();

        const firstDay = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            1
        ).getDay();

        let days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
            .map(d => `<div class="calendar-day-header">${d}</div>`)
            .join('');

        for (let i = 0; i < firstDay; i++) {
            days += '<div class="calendar-day empty"></div>';
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days += `<div class="calendar-day">${i}</div>`;
        }

        return days;
    }

    addEventListeners() {
        this.container.querySelector('.prev-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });

        this.container.querySelector('.next-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });
    }
}
