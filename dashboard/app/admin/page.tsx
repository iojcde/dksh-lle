import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authOptions, getSession } from "@/lib/auth";
import { getDocker } from "@/lib/docker";

const AdminPage = async () => {
  const user = await getSession();
  console.log(user);
  if (user?.user.admin)
    return (
      <div className="container py-20">
        <h1 className="text-4xl font-bold">Admin Page</h1>
        <form
          action={async (formData) => {
            "use server";

            const user = await getSession();
            if (!user?.user.admin) return;

            const emails = formData.get("emails") as string;
            if (!emails) return;

            emails
              .replaceAll("\r", "")
              .replaceAll("\n", "")
              .split(",")
              .forEach(async (email) => {
                const docker = getDocker();
                const container = await docker.createContainer({
                  Image: "lle",
                  Cmd: ["bash"],
                  Tty: true,
                  OpenStdin: true,

                  HostConfig: {
                    PidsLimit: 256,
                    Memory: 400000000,
                    MemorySwap: 400000000,
                    StorageOpt: {
                      size: "512MB",
                    },
                  },
                  Labels: { email },
                });

                await container.start();
              });
          }}
        >
          <h2 className="text-2xl font-bold mt-8">Create Container</h2>
          <p>input emails of user to create container for</p>
          <Textarea name="emails" />
          <Button type="submit" className="mt-8">
            Create Container
          </Button>
        </form>
      </div>
    );
};

export default AdminPage;
