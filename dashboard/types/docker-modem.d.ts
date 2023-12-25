import { ConnectConfig } from "ssh2";

declare module "dockerode" {
  interface DockerOptions {
    sshOptions?: ConnectConfig | undefined;
  }

  interface ContainerInspectInfo {
    GraphDriver:
      | {
          Name: string;
          Data: {
            LowerDir: string;
            MergedDir: string;
            UpperDir: string;
            WorkDir: string;
          };
        }
      | {
          Name: string;
          Data: {
            DeviceId: string;
            DeviceName: string;
            DeviceSize: string;
          };
        };
  }
}
