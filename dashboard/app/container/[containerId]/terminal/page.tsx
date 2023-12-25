import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import Link from "next/link";

const Terminal = dynamic(() => import("./terminal"), { ssr: false });

const TerminalPage = ({
  params: { containerId },
}: {
  params: { containerId: string };
}) => {
  return (
    <div className="h-screen relative">
      <Terminal containerId={containerId} />
    </div>
  );
};
export default TerminalPage;
