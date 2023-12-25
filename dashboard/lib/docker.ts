import Docker from "dockerode";
import Modem from "docker-modem";

export const getDocker = () => {
  const keyFile = "C:\\Users\\jcde0\\.ssh\\id_ed25519";
  const privateKey = require("fs").readFileSync(keyFile);

  const docker = new Docker({
    protocol: "ssh",
    username: "ubuntu",
    host: "3.36.126.112",
    sshOptions: {
      host: "3.36.126.112",
      port: 22,
      username: "ubuntu",
      privateKey,
    },
  });

  return docker;
};
