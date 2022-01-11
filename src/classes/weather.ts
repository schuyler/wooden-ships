import { Math } from 'phaser';

export const minWindSpeed = 5.0;
export const maxWindSpeed = 45.0;
export const windSpeedToPixels = 5;

export class Wind extends Math.Vector2 {
    constructor(direction?: number, speed?: number) {
        super(1.0, 1.0);
        this.setDirection(direction ?? Math.Angle.RandomDegrees());
        this.setSpeed(speed ?? Math.RND.realInRange(minWindSpeed, maxWindSpeed));
    }

    public setSpeed(speed: number) {
        this.setLength(speed * windSpeedToPixels);
    }

    public setDirection(direction: number) {
        this.setAngle(Math.Angle.Normalize(Math.DegToRad(direction)));
    }

    public speed(): number {
        return this.length();
    }

    public direction(): number {
        return this.angle();
    }

    public relativeTo(velocity: Math.Vector2) {
        const apparentWind = new Wind();
        apparentWind.setFromObject(this);
        apparentWind.subtract(velocity);
        return apparentWind;
    }
}