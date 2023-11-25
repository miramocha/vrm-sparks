import { VRM } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { AnimationMixer } from "three";

type VrmModelProps = {
  vrm: VRM;
  mixer?: AnimationMixer;
};
export default function VrmModel({ vrm, mixer }: VrmModelProps) {
  let hasError = false;
  useFrame((state, delta) => {
    try {
      if (!hasError) {
        vrm.update(delta);

        if (vrm.expressionManager) {
          const blinkDelay = 10;
          const blinkFrequency = 3;

          const elapsedTime = state.clock.getElapsedTime();
          if (Math.round(elapsedTime * blinkFrequency) % blinkDelay === 0) {
            vrm.expressionManager.setValue(
              "blink",
              1 - Math.abs(Math.sin(elapsedTime * blinkFrequency * Math.PI))
            );
          }
        }

        if (mixer) {
          mixer.update(delta);
        }
      }
    } catch (error) {
      hasError = true;
    }
  });

  return (
    <>
      <primitive object={vrm.scene} />
    </>
  );
}
