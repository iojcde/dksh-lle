import { ContainerCard } from "@/app/container-card";
import { Button } from "@/components/ui/button";
import { getDocker } from "@/lib/docker";
import { Cpu, Settings, Terminal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const ContainerPage = async ({
  params: { containerId },
}: {
  params: { containerId: string };
}) => {
  const docker = getDocker();

  const container = (await docker.listContainers({ all: true })).find(
    (c) => c.Names[0] == `/${containerId}`
  );
  if (!container) {
    return notFound();
  }

  return (
    <div className="container h-[85vh] max-w-5xl mt-8">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Cpu />
          <Link
            href={`/container/${container.Id}`}
            className="font-bold text-xl"
          >
            {container.Names[0].replace("/", "")}
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            asChild
            variant="outline"
            className="bg-black text-white "
            size={"lg"}
          >
            <Link
              href={`/container/${containerId}/terminal`}
              className="flex gap-1 items-center "
            >
              <Terminal size={16} />
              Terminal
            </Link>
          </Button>

          <Button asChild variant="outline" size={"lg"}>
            <Link
              href={`/container/${containerId}/settings`}
              className="flex gap-1 items-center"
            >
              <Settings size={16} />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-2 text-gray-11">
        <div>
          <span className="font-semibold">Image</span>: {container.Image}
        </div>
        <div>
          <span className="font-semibold">Memory</span>: 50MB
        </div>
        <div>
          <span className="font-semibold">Disk</span>: 1GB
        </div>
        <div>
          <span className="font-semibold">IP</span>:{" "}
          {container.NetworkSettings.Networks.bridge.IPAddress}
        </div>
      </div>
    </div>
  );
};
export default ContainerPage;
