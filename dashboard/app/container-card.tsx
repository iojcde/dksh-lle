import { Card } from "@/components/ui/card";
import { ContainerInfo } from "dockerode";
import { Cpu } from "lucide-react";
import Link from "next/link";

export const ContainerCard: React.FC<{ cont: ContainerInfo }> = ({ cont }) => {
  return (
    <Card className="p-8 select-none">
      <div className="flex gap-2">
        <Cpu />
        <Link
          href={`/container/${cont.Names[0].replace("/", "")}`}
          className="font-bold"
        >
          {cont.Names[0].replace("/", "")}
        </Link>
      </div>
      <div className="mt-2 text-xs text-gray-11">
        <div>
          <span className="font-semibold">Image</span>: {cont.Image}
        </div>
        <div>
          <span className="font-semibold">Memory</span>: 0.5GB
        </div>
        <div>
          <span className="font-semibold">Disk</span>: 3GB
        </div>
        <div>
          <span className="font-semibold">IP</span>:{" "}
          {cont.NetworkSettings.Networks.bridge.IPAddress}
        </div>
      </div>
    </Card>
  );
};
