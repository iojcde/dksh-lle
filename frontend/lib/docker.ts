import Docker from "dockerode";
import Modem from "docker-modem";

export const getDocker = () => {
  /* const keyFile = "C:\\Users\\jcde0\\.ssh\\id_ed25519";
  const privateKey = require("fs").readFileSync(keyFile);

  const dockerssh = new Docker({
    protocol: "ssh",
    username: "ubuntu",
    host: "3.38.207.235",
    sshOptions: {
      host: "3.38.207.235",
      port: 22,
      username: "ubuntu",
      privateKey,
    },
  });*/
  const docker = new Docker({})

  return docker;
};
