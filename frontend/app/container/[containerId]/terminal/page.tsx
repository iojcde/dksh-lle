import dynamic from "next/dynamic";
import Link from "next/link";

const Terminal = dynamic(() => import("./terminal"), { ssr: false });

const TerminalPage = ({
  params: { containerId },
}: {
  params: { containerId: string };
}) => {
  return (
    <div className="h-[calc(100vh-32px)]">
      <Link href={`/container/${containerId}`}>Back</Link>
      <Terminal containerId={containerId} />
    </div>
  );
};
export default TerminalPage;
