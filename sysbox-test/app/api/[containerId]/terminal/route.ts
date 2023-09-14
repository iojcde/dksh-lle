import { getDocker } from "@/lib/docker";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const GET = async ({ params: { containerId } }) => {
  const docker = getDocker();
  const container = docker.getContainer(containerId);
  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
    stdin: true,
  });

  return new Response("hi", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
