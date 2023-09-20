import { ContainerCard } from "@/app/container-card";
import { Button } from "@/components/ui/button";
import { getDocker } from "@/lib/docker";
import { Cpu } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const ContainerPage = async ({
  params: { containerId },
}: {
  params: { containerId: string };
}) => {
  const docker = getDocker();

  const container = (await docker.listContainers()).find(
    (c) => c.Id == containerId
  );
  if (!container) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
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
        <Button asChild variant='outline'>
          <Link href={`/container/${containerId}/terminal`}>Terminal</Link>
        </Button>
      </div>
      <div className="mt-2 text-gray-11">
        <div>
          <span className="font-semibold">Image</span>: {container.Image}
        </div>
        <div>
          <span className="font-semibold">Memory</span>: 0.5GB
        </div>
        <div>
          <span className="font-semibold">Disk</span>: 3GB
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
