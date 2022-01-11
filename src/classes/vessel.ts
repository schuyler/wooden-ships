import { Physics, Math } from 'phaser';
import { Wind } from './weather';
import { sin, cos } from '../helpers/math';

type SpecName = 'aeroLift' | 'aeroDrag' | 'hydroDrag' | 'yawRate';
type Specs = Record<SpecName, number>;

const yawDragFactor = 15;
const hydroDragFactor = 100;
const sailAreaFactor = 1;

export const DefaultSpecs: Specs = {
    aeroLift: 0.35,
    aeroDrag: 0.25,
    hydroDrag: 0.95,
    yawRate: 30
};

export class Vessel {
    public body: Physics.Arcade.Body;
    protected specs: Specs;
    private lastReport: number;

    constructor({ specs, body }: { body: Physics.Arcade.Body, specs?: Specs }) {
        this.body = body;
        this.specs = specs ?? DefaultSpecs;
        this.lastReport = 100;

        const drag = this.specs.hydroDrag * hydroDragFactor;
        body.setDrag(drag, drag);
        body.setDamping(true);

        body.setAngularDrag(this.specs.hydroDrag * yawDragFactor);
        // seems like an oversight that there's no accessor for this
        body.maxAngular = this.specs.yawRate;
    }

    public heading(): number {
        return Math.DegToRad(this.body.rotation + 90);
    }

    public turn(rudder: number) {
        this.body.setAngularAcceleration(rudder * this.specs.yawRate);
    }

    public applyWindForce(wind: Wind) {
        const apparentWind = wind.relativeTo(this.body.velocity);
        const angleOfAttack = apparentWind.direction() - Math.Angle.Reverse(this.heading());
        let forceOnSails = 
            this.specs.aeroLift * sin(angleOfAttack) -
            this.specs.aeroDrag * cos(angleOfAttack);
        forceOnSails = Math.Clamp(forceOnSails, 0, 100);
        const windAcceleration = new Math.Vector2();
        const maxSpeed = wind.speed() * forceOnSails;
        windAcceleration.setToPolar(this.heading(), maxSpeed - this.body.velocity.length());
        if (--this.lastReport <= 0) {
            console.log("vB=", this.body.velocity, "r=", Math.RadToDeg(this.heading()));
            console.log("vA=", apparentWind, "⍺=", Math.RadToDeg(angleOfAttack), "wind dir=", Math.RadToDeg(apparentWind.direction()), "|vA|=",apparentWind.speed());
            console.log("Fs=", forceOnSails, "maxS=", maxSpeed);
            console.log("AB=", windAcceleration);
            this.lastReport = 100;
        }
        this.body.setAcceleration(windAcceleration.x, windAcceleration.y);
    }

    public update(wind: Wind) {
        this.applyWindForce(wind);
    }
}