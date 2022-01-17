import { Math } from 'phaser';

export const minWindSpeed = 5.0;
export const maxWindSpeed = 45.0;
export const windSpeedToPixels = 1;

export class Wind extends Math.Vector2 {
    // This class stores the velocity vector of the wind
    constructor(direction?: number, speed?: number) {
        super(1.0, 1.0);
        this.setDirection(direction ?? Math.Angle.RandomDegrees());
        this.setSpeed(speed ?? Math.RND.realInRange(minWindSpeed, maxWindSpeed));
    }

    public setSpeed(speed: number) {
        this.setLength(Math.Clamp(speed * windSpeedToPixels, minWindSpeed, maxWindSpeed));
    }

    public setDirection(direction: number) {
        // Wind direction is the direction the wind is coming FROM --
        // this is the reverse of the angle of the force vector applied by the wind
        this.setAngle(Math.Angle.Normalize(Math.Angle.Reverse(Math.DegToRad(direction))));
    }

    public speed(): number {
        return this.length();
    }

    public direction(): number {
        // Wind angle is reversed here because direction is where the wind is coming FROM, not where it's going
        return Math.RadToDeg(Math.Angle.Reverse(this.angle()));
    }

    public relativeTo(velocity: Math.Vector2) {
        const apparentWind = new Wind();
        apparentWind.setFromObject(this);
        apparentWind.subtract(velocity);
        return apparentWind;
    }

    public angleOfAttack(heading: number) {
        return Math.Angle.Wrap(Math.Angle.Reverse(this.angle()) - heading);
    }
}