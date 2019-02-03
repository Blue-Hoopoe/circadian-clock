class Clock {

    constructor(root) {
        this.elementarize(root);
    }

    elementarize(root) {
        let elements = { root, };
        ['seconds', 'minutes', 'hours'].forEach(key => {
            elements[key] = root.querySelector(`[data-${key}]`);
        });
        this.elements = elements;
    }

    start() {
        this.started = this.previous = new Date();
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
        this.update();
    }

    stop() {
        clearInterval(this.interval);
        this.interval = this.started = null;
    }

    update() {

        let now = new Date();
        console.log(now.toLocaleTimeString());

        // Indicating period of the day.
        this.elements.root.setAttribute('data-period', now.getHours() < 12 ? 'am' : 'pm');

        // Setting up seconds.
        this.elements.seconds.style.transform = `rotate(${ now.getSeconds() * 6 }deg)`;

        // Setting up minutes.
        this.elements.minutes.style.transform = `rotate(${ now.getMinutes() * 360 / 60 }deg)`;

        // Setting up hours.
        // To do: don't call this function everytime.
        if (true || now.getHours() !== this.previous.getHours()) {
            let content = '';
            for (let i = 0; i < now.getHours() % 12; i++) {
                content += `<path d="M49.9,50 L49,0 L79,0" transform="rotate(${ 29.9 * i })"/>`
            }
            this.elements.hours.querySelector('svg').innerHTML = content;
        }

        this.previous = now;
    }
}

new Clock(document.querySelector('.clock')).start();