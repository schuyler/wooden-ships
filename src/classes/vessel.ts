import { Physics, Math } from 'phaser';
import { Wind } from './weather';
import { Math_, _d, _r } from '../helpers/math';
import { PX_PER_KNOT, KNOTS_PER_PX } from '../helpers/scale';

import Body = Physics.Arcade.Body;

type radians = number;
type SpecName = 'aeroLift' | 'aeroDrag' | 'bowHydroDrag' | 'beamHydroDrag' | 'yawRate';
export type Specs = Record<SpecName, radians>;

export const DefaultSpecs: Specs = {
    aeroLift: 1.0,
    aeroDrag: 1.0,
    bowHydroDrag: 0.05,
    beamHydroDrag: 0.25, // really this should be measured as the square of the cross section
    yawRate: 0.005,
};

export interface VesselMotion {
    wind: Wind,
    shipVelocity: Math.Vector2,
    heading: radians,
    apparentWind: Math.Vector2,
    angleOfAttack: radians,
    lift: number,
    drag: number,
    aeroFactor: number,
    aeroForce: Math.Vector2,
    hydroDrag: number,
    hydroForce: Math.Vector2,
    totalForce: Math.Vector2,
    rotation: radians
}

export class Vessel {
    public body: Body;
    protected specs: Specs;
    protected rudder: number; // radians from centerline
    protected bowAngle: number;

    constructor({ body, heading, specs }: { body: Body, heading: radians, specs?: Specs }) {
        this.body = body;
        this.specs = specs ?? DefaultSpecs;
        this.rudder = 0;
        this.bowAngle = Math.Angle.Wrap(heading);
    }

    public heading(): number {
        return Math.Angle.Normalize(this.bowAngle); //Math.Angle.Wrap(this.body.velocity.angle());
    }

    public setRudder(rudder: number) {
        this.rudder = rudder;
    }

    public computeForces(wind: Wind, heading: radians, shipVelocity: Math.Vector2): VesselMotion {
        const rotation = this.rudder * this.specs.yawRate;

        const apparentWind = wind.relativeTo(shipVelocity);
        const angleOfAttack = apparentWind.angleOfAttack(heading);

        const lift = Math_.abs(Math_.sin(angleOfAttack));
        const drag = Math_.cos(angleOfAttack);
        const aeroFactor = this.specs.aeroLift * lift - this.specs.aeroDrag * drag;
        const aeroForce = new Math.Vector2(apparentWind.speed() * Math_.max(aeroFactor, 0), 0);
        aeroForce.rotate(heading);

        const hullAngleOfAttack = Math_.abs(Math.Angle.Wrap(shipVelocity.angle() - heading));
        const hydroDrag = this.specs.bowHydroDrag + (this.specs.beamHydroDrag - this.specs.bowHydroDrag) * Math_.abs(hullAngleOfAttack / Math_.PI);
        const hydroFactor = -hydroDrag * Math_.pow(shipVelocity.length(), 2);
        const hydroForce = new Math.Vector2(hydroFactor, 0);
        hydroForce.rotate(shipVelocity.angle() - rotation);

        const totalForce = aeroForce.clone().add(hydroForce);

        return {wind, heading, shipVelocity, apparentWind, angleOfAttack, lift, drag, aeroFactor, aeroForce, hydroDrag, hydroForce, totalForce, rotation};
    }

    debugMotion(f: VesselMotion): string[] {
        const _v = (v: Math.Vector2) => `${_r(_d(v.angle()))}º @ ${_r(v.length(), -1)} kts (x=${_r(v.x, -1)}, y=${_r(v.y, -1)})`;
        return [
            `    ship actual: ${_v(f.shipVelocity)}`,
            `        heading: ${_r(_d(this.heading()))}º`,
            `         rudder: ${_r(this.rudder * this.specs.yawRate, -3)}`,
            '',
            `      wind from: ${_r(f.wind.direction())}º`,
            `    wind actual: ${_v(f.wind)}`,
            `  apparent wind: ${_v(f.apparentWind)}`,
            '',
            `angle of attack: ${_r(_d(f.angleOfAttack))}º`,
            ` lift component: ${_r(f.lift, -3)} * (L=${_r(this.specs.aeroLift, -3)})`,
            ` drag component: ${_r(f.drag, -3)} * (D=${_r(this.specs.aeroDrag, -3)})`,
            `     total aero: ${_r(f.aeroFactor, -3)}`,
            '',
            `     wind force: ${_v(f.aeroForce)}`,
            `     hydro drag: ${_v(f.hydroForce)} (drag=${_r(f.hydroDrag, -5)})`,
            `    total accel: ${_v(f.totalForce)}`,
            `       rotation: ${_d(f.rotation)}º`
        ];
    }

    public applyWindForce(wind: Wind): VesselMotion {
        const shipVelocity = this.body.velocity.clone().scale(KNOTS_PER_PX);
        const f = this.computeForces(wind, this.bowAngle, shipVelocity);
        const accel = f.totalForce;
        accel.scale(PX_PER_KNOT);
        this.body.setAcceleration(accel.x, accel.y);
        this.bowAngle = Math.Angle.Wrap(this.bowAngle + f.rotation);
        return f;
    }

    public update(wind: Wind): VesselMotion {
        const motion = this.applyWindForce(wind);
        return motion;
    }
}