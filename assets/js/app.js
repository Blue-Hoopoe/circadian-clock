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

    start(from = new Date()) {
        this.started = new Date();
        this.offset = this.started - from;
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
        this.update();
    }

    stop() {
        clearInterval(this.interval);
        this.interval = this.started = this.offset = null;
    }

    update() {

        let computed = new Date(new Date() - this.offset);
        console.log(computed)
        let delta = new Delta(this.started, computed);

        // Indicating period of the day.
        this.elements.root.setAttribute('data-period', computed.getHours() < 12 ? 'am' : 'pm');

        // Setting up seconds.
        this.elements.seconds.style.transform = `rotate(${ delta.seconds * 6 }deg)`;

        // Setting up minutes.
        this.elements.minutes.style.transform = `rotate(${ Math.floor(delta.minutes) * 360 / 60 }deg)`;

        // Setting up hours.
        // To do: don't call this function everytime.
        this.elements.hours.querySelector('svg > circle').setAttribute('stroke-dashoffset',  Math.floor(delta.hours) * 30);

        this.previous = computed;
    }
}

(() => {
    let clock = new Clock(document.querySelector('.clock'));
    clock.start();
})()