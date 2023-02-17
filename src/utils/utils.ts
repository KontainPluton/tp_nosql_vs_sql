function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

function random() : number {
    return Math.random();
}

export {
    randomDate,
    randomInt,
    random,
}