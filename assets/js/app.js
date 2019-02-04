class Delta {
    
    constructor(base, reference = new Date()) {
        if (!base) throw new Error(`Cannot create Delta instance without its base time.`); 
        this.base = base;
        if (this.reference < base) throw new Error(`Reference cannot be less than base.`);
        this.reference = reference;
        this.delta = this.reference - this.base;
    }

    get seconds() {
        return this.base.getSeconds() + this.delta / 1000;
    }

    get minutes() {
        return this.base.getMinutes() + this.seconds / 60;
    }

    get hours() {
        return this.base.getHours() + this.minutes / 60;
    }
}

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
        let delta = new Delta(this.started);

        // Indicating period of the day.
        this.elements.root.setAttribute('data-period', now.getHours() < 12 ? 'am' : 'pm');

        // Setting up seconds.
        this.elements.seconds.style.transform = `rotate(${ delta.seconds * 6 }deg)`;

        // Setting up minutes.
        this.elements.minutes.style.transform = `rotate(${ Math.floor(delta.minutes) * 360 / 60 }deg)`;

        // Setting up hours.
        // To do: don't call this function everytime.
        this.elements.hours.querySelector('svg > circle').setAttribute('stroke-dashoffset',  Math.floor(delta.hours) * 30);


        this.previous = now;
    }
}

new Clock(document.querySelector('.clock')).start();