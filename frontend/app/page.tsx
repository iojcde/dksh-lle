import { Nav } from "./nav";
import { ContainerCard } from "./container-card";
import { getDocker } from "@/lib/docker";
export default async function Home() {
  
  const docker = getDocker();

  const containers = await docker.listContainers();
  return (
    <main className="min-h-screen p-24 max-w-5xl mx-auto">
      <Nav />
      <p>DKSH LLE는 리눅스 시스템 실습을 해볼 수 있는 환경을 제공합니다.</p>
      <div className="grid grid-cols-2 gap-1 mt-8 shadow-inner bg-gray-1 border rounded-2xl p-1">
        {containers.map((containerInfo, index) => (
          <ContainerCard key={index} cont={containerInfo} />
        ))}
        {containers.length === 0 && (
          <div className="col-span-2">
            <p className="text-center">실행중인 컨테이너가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
