import { ConnectConfig } from "ssh2";
 

declare module "dockerode" {
  interface DockerOptions {
    sshOptions?: ConnectConfig | undefined;
  }
}
