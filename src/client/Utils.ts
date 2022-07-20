import { Vector3 } from 'three'

export class Utils {
    public static SmoothDamp(current: Vector3, target: Vector3, currentVelocity: Vector3,
                      smoothTime: number, maxSpeed: number, deltaTime: number): Vector3 {
        let output = new Vector3(0, 0, 0);

        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;

        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

        const change = current.clone().sub(target);
        const originalTo = target.clone();

        const maxChange = maxSpeed * smoothTime;
        const maxChangeSq = maxChange * maxChange;
        const sqrmag = change.lengthSq();

        if (sqrmag > maxChangeSq)
        {
            const mag = change.length();
            change.divideScalar(mag * maxChange);
        }

        target = current.clone().sub(change);
        const temp = currentVelocity.clone().add(change.clone().multiplyScalar(omega)).multiplyScalar(deltaTime);
        currentVelocity.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);
        output.add(target).add(change.clone().add(temp).multiplyScalar(exp))

        const origMinusCurrent = originalTo.clone().sub(current);
        const outMinusOrig = output.clone().sub(originalTo);

        if (origMinusCurrent.dot(outMinusOrig) > 0)
        {
            output = new Vector3(0,0,0).add(originalTo);
            currentVelocity = output.clone().sub(originalTo).divideScalar(deltaTime);
        }

        return output;
    }
}