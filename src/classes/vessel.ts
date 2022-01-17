import { Physics, Math } from 'phaser';
import { Wind } from './weather';
import { Math_, _d, _r } from '../helpers/math';

import Body = Physics.Arcade.Body;

type SpecName = 'aeroLift' | 'aeroDrag' | 'hydroDrag' | 'yawRate';
export type Specs = Record<SpecName, number>;

const yawDragFactor = 1;
const hydroDragFactor = 100;
const sailAreaFactor = 1;

export const DefaultSpecs: Specs = {
    aeroLift: 1.0,
    aeroDrag: 1.0,
    hydroDrag: 0.05,
    yawRate: 30
};
;

export class Vessel {
    public body: Body;
    protected specs: Specs;
    private fixedRotation: number;

    constructor({ body, fixedRotation, specs }: { body: Body, fixedRotation?: number, specs?: Specs }) {
        this.body = body;
        this.fixedRotation = fixedRotation ?? 0;
        this.specs = specs ?? DefaultSpecs;
    }

    public heading(): number {
        return Math.Angle.Wrap(this.body.rotation + this.fixedRotation);
    }

    public turn(rudder: number) {
        this.body.setAngularAcceleration(rudder * this.specs.yawRate);
    }

    public computeForces(wind: Wind, shipVelocity: Math.Vector2, shipHeading: number) {
        const apparentWind = wind.relativeTo(shipVelocity);
        const angleOfAttack = apparentWind.angleOfAttack(shipHeading);

        const lift = Math_.abs(Math_.sin(angleOfAttack));
        const drag = Math_.cos(angleOfAttack);
        const aeroFactor = this.specs.aeroLift * lift - this.specs.aeroDrag * drag;
        const aeroForce = apparentWind.speed() * aeroFactor;
        const hydroForce = -this.specs.hydroDrag * Math_.pow(shipVelocity.length(), 2);
        const totalForce = aeroForce + hydroForce;

        return {apparentWind, angleOfAttack, lift, drag, aeroFactor, aeroForce, hydroForce, totalForce};
    }

    public applyWindForce(wind: Wind) {
        const shipVelocity = this.body.velocity.clone();
        const f = this.computeForces(wind, shipVelocity, this.heading());
        const accel = new Math.Vector2(f.totalForce, 0);
        accel.rotate(shipVelocity.angle());
        this.body.setAcceleration(accel.x, accel.y);
    }

    public update(wind: Wind) {
        this.applyWindForce(wind);
    }
}