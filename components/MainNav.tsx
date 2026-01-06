import React from "react";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/option";
import ClientNav from "./ClientNav";

const MainNav = async () => {
  const session = await getServerSession(options);

  return <ClientNav session={session} />;
};

export default MainNav;
