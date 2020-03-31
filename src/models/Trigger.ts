import { DHTSensorStatus } from "./Inputs";
import { Relay, RelayAction } from "./Outputs";

export interface Trigger {
  condition: string;
  input: DHTSensorStatus; // | SensorX
  output: Relay; // | OutputX
  conditionalOutputState: RelayAction;
}